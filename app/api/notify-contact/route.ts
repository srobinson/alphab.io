import { createAdminClient } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// This API route can be called to send notifications about new contacts
// You can integrate this with email services like Resend, SendGrid, or Nodemailer

export async function POST(request: NextRequest) {
  console.log("[notify-contact] API called");
  try {
    const requestBody = await request.json();

    const { contactId, notificationType = "new_contact" } = requestBody;

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 },
      );
    }

    // Get contact details
    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", contactId)
      .single();

    if (contactError || !contact) {
      console.warn("[notify-contact] contact fetch failed:", contactError);
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 },
      );
    }

    // Log the notification activity
    await supabase
      .from("user_activity_log")
      .insert({
        user_id: null,
        activity_type: "notification_sent",
        activity_data: {
          contact_id: contactId,
          notification_type: notificationType,
          contact_email: contact.email,
          contact_name: contact.name,
          timestamp: new Date().toISOString(),
        },
      });

    const notificationData = {
      type: notificationType,
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        source: contact.source,
        subscribed_to_newsletter: contact.subscribed_to_newsletter,
        created_at: contact.created_at,
      },
      emailData: {
        from: "noreply@alphab.io", // Your verified domain
        to: process.env.ADMIN_EMAIL || "admin@alphab.io", // Your admin email
        subject: `New Contact Form Submission from ${contact.name}`,
        html: generateEmailHTML(contact),
        text: generateEmailText(contact),
      },
    };

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send(notificationData.emailData);

    return NextResponse.json({
      success: true,
      message: "Notification processed",
      data: notificationData,
    });
  } catch (error: any) {
    console.error("[notify-contact] Notification error:", error);
    return NextResponse.json(
      { error: "Failed to process notification" },
      { status: 500 },
    );
  }
}

function generateEmailHTML(contact: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #495057; }
            .value { margin-top: 5px; }
            .message { background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #6c757d; }
            .badge { display: inline-block; padding: 4px 8px; background: #e7f3ff; color: #0066cc; border-radius: 4px; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2 style="margin: 0; color: #007bff;">New Contact Form Submission</h2>
                <p style="margin: 10px 0 0 0; color: #6c757d;">Received on ${
    new Date(contact.created_at).toLocaleString()
  }</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${contact.name}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">
                        <a href="mailto:${contact.email}">${contact.email}</a>
                        ${
    contact.subscribed_to_newsletter
      ? '<span class="badge">Newsletter Subscriber</span>'
      : ""
  }
                    </div>
                </div>
                
                <div class="field">
                    <div class="label">Source:</div>
                    <div class="value">${contact.source}</div>
                </div>
                
                <div class="field">
                    <div class="label">Message:</div>
                    <div class="message">${
    contact.message.replace(/\n/g, "<br>")
  }</div>
                </div>
            </div>
            
            <div class="footer">
                <p>You can manage this contact and reply directly from your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/contacts">admin dashboard</a>.</p>
                <p>Contact ID: ${contact.id}</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateEmailText(contact: any): string {
  return `
New Contact Form Submission

Name: ${contact.name}
Email: ${contact.email}
Source: ${contact.source}
Newsletter Subscription: ${contact.subscribed_to_newsletter ? "Yes" : "No"}
Submitted: ${new Date(contact.created_at).toLocaleString()}

Message:
${contact.message}

---
Contact ID: ${contact.id}
Manage contacts: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/contacts
  `.trim();
}

// GET endpoint to test the notification system
export async function GET() {
  return NextResponse.json({
    message: "Contact notification API is working",
    endpoints: {
      POST: "Send notification for a contact",
      required_fields: ["contactId"],
      optional_fields: ["notificationType"],
    },
  });
}
