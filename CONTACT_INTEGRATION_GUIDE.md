# Contact Form Integration Guide

## Overview

Your contact form at `https://alphab.io/contact` is now fully integrated with Supabase and includes:

- ✅ **Contact form submissions** stored in database
- ✅ **Newsletter signup integration**
- ✅ **Admin dashboard** for managing contacts
- ✅ **Notification system** ready for email integration
- ✅ **Analytics tracking** for form submissions

## 🗄️ Database Schema

The contact form uses the `contacts` table with these fields:

```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(100) DEFAULT 'contact_page',
    ip_address INET,
    user_agent TEXT,
    subscribed_to_newsletter BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📧 Email Notification Setup

### Option 1: Resend (Recommended)

1. **Install Resend**:

   ```bash
   npm install resend
   ```

2. **Add environment variables** to `.env.local`:

   ```env
   RESEND_API_KEY=your_resend_api_key
   ADMIN_EMAIL=your-email@domain.com
   NEXT_PUBLIC_SITE_URL=https://alphab.io
   ```

3. **Update the notification API** (`app/api/notify-contact/route.ts`):

   ```typescript
   import { Resend } from "resend";

   const resend = new Resend(process.env.RESEND_API_KEY);

   // Replace the TODO section with:
   await resend.emails.send({
     from: "noreply@alphab.io", // Your verified domain
     to: process.env.ADMIN_EMAIL!,
     subject: notificationData.emailData.subject,
     html: notificationData.emailData.html,
   });
   ```

### Option 2: SendGrid

1. **Install SendGrid**:

   ```bash
   npm install @sendgrid/mail
   ```

2. **Add environment variables**:

   ```env
   SENDGRID_API_KEY=your_sendgrid_api_key
   ADMIN_EMAIL=your-email@domain.com
   ```

3. **Update the notification API**:

   ```typescript
   import sgMail from "@sendgrid/mail";

   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

   await sgMail.send({
     to: process.env.ADMIN_EMAIL!,
     from: "noreply@alphab.io", // Your verified sender
     subject: notificationData.emailData.subject,
     html: notificationData.emailData.html,
   });
   ```

### Option 3: Nodemailer (SMTP)

1. **Install Nodemailer**:

   ```bash
   npm install nodemailer
   npm install -D @types/nodemailer
   ```

2. **Add environment variables**:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=your-email@domain.com
   ```

3. **Update the notification API**:

   ```typescript
   import nodemailer from "nodemailer";

   const transporter = nodemailer.createTransporter({
     host: process.env.SMTP_HOST,
     port: parseInt(process.env.SMTP_PORT!),
     secure: false,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });

   await transporter.sendMail({
     from: process.env.SMTP_USER,
     to: process.env.ADMIN_EMAIL,
     subject: notificationData.emailData.subject,
     html: notificationData.emailData.html,
   });
   ```

## 🔧 Setup Instructions

### 1. Apply Database Schema

Choose one of these methods:

**Option A: Complete Reset (Recommended)**

```bash
# Reset your Supabase database in the dashboard
# Then apply the clean schema:
./scripts/reset-database.sh --apply
```

**Option B: Apply Schema Only**

```bash
# Copy supabase/schema.sql content
# Paste in Supabase Dashboard > SQL Editor
# Execute the SQL
```

### 2. Test the Contact Form

1. Visit `https://alphab.io/contact`
2. Fill out and submit the form
3. Check that the submission appears in your database
4. Verify newsletter signup works if checked

### 3. Access Admin Dashboard

Visit `https://alphab.io/admin/contacts` to:

- View all contact submissions
- Filter by status (new, read, replied, archived)
- Search contacts by name, email, or message
- Update contact status
- See newsletter signup statistics

### 4. Set Up Email Notifications

1. Choose an email service (Resend recommended)
2. Add the required environment variables
3. Update the notification API code
4. Test by submitting a contact form

## 📊 Features

### Contact Form Features

- ✅ **Form validation** with error handling
- ✅ **Loading states** during submission
- ✅ **Success confirmation** with reset option
- ✅ **Newsletter signup** integration
- ✅ **Responsive design** with dark mode support
- ✅ **Analytics tracking** for form submissions

### Admin Dashboard Features

- ✅ **Contact management** with status updates
- ✅ **Search and filtering** capabilities
- ✅ **Statistics overview** with visual indicators
- ✅ **Newsletter signup tracking**
- ✅ **Responsive design** for mobile management

### Notification System Features

- ✅ **Automatic notifications** on form submission
- ✅ **HTML and text email** templates
- ✅ **Activity logging** for audit trails
- ✅ **Flexible email service** integration
- ✅ **Error handling** that doesn't break form submission

## 🔐 Security Features

- ✅ **Row Level Security (RLS)** enabled
- ✅ **Public form submissions** allowed
- ✅ **Admin-only dashboard** access
- ✅ **Input validation** and sanitization
- ✅ **Rate limiting** ready (add middleware if needed)

## 📈 Analytics Integration

The contact form automatically tracks:

- Form submission events
- Newsletter signup conversions
- Source attribution
- User agent and timing data

Access analytics through:

```sql
-- View contact form analytics
SELECT * FROM analytics_events WHERE event_type = 'contact_form';

-- View newsletter signups from contact form
SELECT * FROM active_subscriptions WHERE subscription_source = 'contact_page_signup';
```

## 🚀 Going Live

1. **Apply the database schema** using the reset script
2. **Set up email notifications** with your preferred service
3. **Test the complete flow**:
   - Submit contact form
   - Check database record
   - Verify email notification
   - Test admin dashboard
4. **Monitor the admin dashboard** for new submissions

## 🔧 Customization Options

### Email Templates

Customize the email templates in `app/api/notify-contact/route.ts`:

- Modify `generateEmailHTML()` for custom styling
- Update `generateEmailText()` for plain text version
- Add additional fields or formatting

### Admin Dashboard

Extend the admin dashboard in `app/admin/contacts/page.tsx`:

- Add bulk actions
- Export functionality
- Advanced filtering
- Response templates

### Contact Form

Enhance the contact form in `app/contact/page.tsx`:

- Add additional fields
- Custom validation rules
- File upload support
- Multi-step forms

## 📞 Support

Your contact integration includes:

- **Database storage** for all submissions
- **Newsletter integration** for lead capture
- **Admin dashboard** for management
- **Email notifications** for immediate alerts
- **Analytics tracking** for insights

The system is production-ready and will scale with your needs!
