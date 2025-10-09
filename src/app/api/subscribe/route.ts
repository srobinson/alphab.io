import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      source = "unknown",
      publication = "general",
      first_name = null,
      last_name = null,
    } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        {
          status: 400,
        }
      );
    }

    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection not available" },
        {
          status: 500,
        }
      );
    }

    // Upsert subscriber via RPC (handles dedupe and audit server-side)
    const { error: upsertError } = await supabase.rpc("upsert_user_and_subscribe", {
      p_email: email,
      p_publication: publication,
      p_source: source,
      p_first_name: first_name,
      p_last_name: last_name,
      p_user_agent: request.headers.get("user-agent") || null,
    });

    if (upsertError && !upsertError.message?.includes("duplicate")) {
      return NextResponse.json(
        { error: "Failed to subscribe" },
        {
          status: 500,
        }
      );
    }

    // Send welcome email via Resend (non-fatal if fails)
    try {
      console.log("Sending welcome email to:", email);
      // Optional BCC to admins to save on additional sends
      const adminBcc = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const resend = new Resend(process.env.RESEND_API_KEY);
      const sent = await resend.emails.send({
        from: process.env.WELCOME_FROM_EMAIL || "welcome@alphab.io",
        to: email,
        ...(adminBcc.length ? { bcc: adminBcc } : {}),
        subject: "Welcome to AlphaB",
        html: generateWelcomeHTML({ first_name, source }),
        text: generateWelcomeText({ first_name, source }),
      });
      console.log("Welcome email sent:", sent);
    } catch (e) {
      console.warn("Welcome email failed:", e);
    }

    // Track analytics event (non-fatal)
    try {
      await supabase.rpc("track_analytics_event", {
        p_event_type: "newsletter",
        p_event_name: "subscribed",
        p_properties: { source, publication },
        p_page_url: null,
        p_user_agent: request.headers.get("user-agent") || null,
      });
    } catch (e) {
      console.warn("Analytics tracking failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

function generateWelcomeHTML({
  first_name,
  source,
}: {
  first_name: string | null;
  source: string;
}) {
  const name = first_name ? ` ${first_name}` : "";
  return `
  <div style="font-family: Arial, sans-serif; line-height:1.6">
    <h2>Welcome${name} to AlphaB 🚀</h2>
    <p>Thanks for subscribing${
      source ? ` via <b>${source}</b>` : ""
    }. You'll receive updates on innovations, launches, and insights.</p>
    <p>In the meantime, explore our AI consulting at <a href="https://rade.alphab.io">RADE</a>.</p>
    <hr/>
    <p style="font-size:12px;color:#666">You can unsubscribe anytime from the footer of our emails.</p>
  </div>`;
}

function generateWelcomeText({
  first_name,
  source,
}: {
  first_name: string | null;
  source: string;
}) {
  const name = first_name ? ` ${first_name}` : "";
  return `Welcome${name} to AlphaB!\n\nThanks for subscribing${
    source ? ` via ${source}` : ""
  }. You'll receive updates on innovations, launches, and insights.\n\nExplore RADE: https://rade.alphab.io\n\n- AlphaB`;
}
