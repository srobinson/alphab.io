import { createAdminClient } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  console.log("[contacts] API called");
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      email,
      message,
      source = "contact_page",
      subscribed_to_newsletter = false,
    } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json({
        error: "name, email and message are required",
      }, { status: 400 });
    }

    const admin = createAdminClient();

    const userAgent = request.headers.get("user-agent") || null;
    const referer = request.headers.get("referer") || null;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      null;

    // Basic rate limit: block repeat by same email or IP within last 2 minutes
    try {
      const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      let recentCount = 0;
      const { count: emailCount } = await admin
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("email", email)
        .gte("created_at", since);
      recentCount += emailCount || 0;
      if (ip) {
        const { count: ipCount } = await admin
          .from("contacts")
          .select("id", { count: "exact", head: true })
          .eq("ip_address", ip)
          .gte("created_at", since);
        recentCount += ipCount || 0;
      }
      if (recentCount > 0) {
        return NextResponse.json({
          error: "Too many requests. Please wait a moment and try again.",
        }, { status: 429 });
      }
    } catch (e) {
      console.warn("[contacts] rate check failed:", e);
    }

    const { data, error } = await admin
      .from("contacts")
      .insert({
        name,
        email,
        message,
        source,
        ip_address: ip,
        user_agent: userAgent,
        subscribed_to_newsletter,
      })
      .select("id");

    if (error) {
      console.error("[contacts] insert failed:", error);
      return NextResponse.json({ error: "Failed to store contact" }, {
        status: 500,
      });
    }

    const id = data?.[0]?.id;
    console.log("[contacts] inserted id:", id);

    // Track analytics server-side (non-fatal)
    try {
      await admin.rpc("track_analytics_event", {
        p_event_type: "contact",
        p_event_name: "submitted",
        p_properties: { source, subscribed_to_newsletter },
        p_page_url: referer,
        p_user_agent: userAgent,
      });
    } catch (e) {
      console.warn("[contacts] analytics failed:", e);
    }

    // Send user acknowledgment email with admins BCC'd (saves extra sends)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const adminBcc = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      const replyTo = process.env.SUPPORT_REPLY_TO || email;

      const subject = "Thank you for your message — AlphaB";
      const plain =
        `Hi ${name},\n\nThanks for reaching out. We received your message and will get back to you soon.\n\n— Your message —\n${message}\n\nSource: ${source}${
          referer ? `\nPage: ${referer}` : ""
        }\n\n— AlphaB`;
      const html = `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out. We received your message and will get back to you soon.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p><strong>Your message</strong></p>
        <p>${(message || "").replace(/\n/g, "<br/>")}</p>
        <p style="color:#6b7280;margin-top:12px">Source: ${source}${
        referer ? ` • Page: ${referer}` : ""
      }</p>
        <p style="margin-top:16px">— AlphaB</p>
      `;

      await resend.emails.send({
        from: process.env.WELCOME_FROM_EMAIL || "notifications@alphab.io",
        to: email,
        bcc: adminBcc.length ? adminBcc : undefined,
        replyTo: replyTo,
        subject,
        text: plain,
        html,
      });
      console.log("[contacts] acknowledgment email sent to:", email);
    } catch (e) {
      console.warn("[contacts] acknowledgment email failed:", e);
    }

    return NextResponse.json({ id });
  } catch (err) {
    console.error("[contacts] API error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
