# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

## 2. Set Environment Variables

Update your `.env.local` file with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Run Database Migration

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project:

   ```bash
   supabase init
   ```

3. Link to your remote project:

   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push the migration:
   ```bash
   supabase db push
   ```

### Option B: Manual SQL Execution

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20241206000001_create_email_signups.sql`
4. Execute the SQL

## 4. Verify Setup

The migration creates a comprehensive email subscription system with:

- **Normalized database schema** with separate user and newsletter tables
- **ENUM types** for data integrity
- **Comprehensive indexes** for performance
- **Row Level Security (RLS)** policies for secure access
- **Auto-updating timestamps** and activity tracking
- **Utility functions** for safe user creation and subscription management
- **Analytics views** for subscription insights

## 5. Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Visit the landing page and try subscribing to the newsletter
3. Visit `/accelerator` and try the email signup
4. Check your Supabase dashboard to see the data being inserted

## Database Schema

### Core Tables

#### user

- `id` (UUID PRIMARY KEY) - Auto-generated UUID
- `email` (VARCHAR(255) UNIQUE NOT NULL) - User's email address
- `status` (ENUM: 'active', 'inactive', 'bounced', 'unsubscribed', 'pending')
- `first_name` (VARCHAR(100)) - Optional first name
- `last_name` (VARCHAR(100)) - Optional last name
- `source` (VARCHAR(100)) - Where they signed up from
- `ip_address` (INET) - For analytics and spam prevention
- `user_agent` (TEXT) - Browser/device info
- `email_verified` (BOOLEAN) - Email verification status
- `email_verified_at` (TIMESTAMP) - When email was verified
- `last_activity_at` (TIMESTAMP) - Last user activity
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

#### newsletter

- `id` (BIGSERIAL PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY) - References user.id
- `publication` (ENUM: 'general', 'tech_accelerator', 'ai_dispatch', 'innovation_updates', 'product_launches')
- `subscribed_at` (TIMESTAMP) - When they subscribed
- `unsubscribed_at` (TIMESTAMP) - When they unsubscribed (NULL if active)
- `source` (VARCHAR(100)) - Specific source for this subscription
- `preferences` (JSONB) - Subscription preferences
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### ENUM Types

#### user_status

- `active` - User is active and can receive emails
- `inactive` - User account is inactive
- `bounced` - Email bounced, delivery failed
- `unsubscribed` - User has unsubscribed from all communications
- `pending` - User registration is pending verification

#### publication_type

- `general` - General newsletter (landing page default)
- `tech_accelerator` - Tech accelerator updates
- `ai_dispatch` - AI-focused content
- `innovation_updates` - Innovation and product updates
- `product_launches` - Product launch announcements

### Views

#### active_subscriptions

Combines user and newsletter data for active subscriptions:

- Filters for active users and non-unsubscribed newsletters
- Includes user details and subscription information
- Perfect for email campaign targeting

#### subscription_stats

Analytics view showing subscription metrics:

- Total subscriptions per publication
- Active vs unsubscribed counts
- Unique user counts
- Date ranges for first and latest subscriptions

### Functions

#### upsert_user_and_subscribe()

Smart function that handles the complete signup flow:

- **Parameters:**

  - `p_email` (required) - User's email
  - `p_publication` (optional, default: 'general') - Publication type
  - `p_source` (optional) - Signup source tracking
  - `p_first_name` (optional) - User's first name
  - `p_last_name` (optional) - User's last name
  - `p_ip_address` (optional) - User's IP for analytics
  - `p_user_agent` (optional) - Browser/device info

- **Returns:**

  - `user_id` - The user's UUID
  - `is_new_user` - Boolean indicating if this is a new user
  - `is_new_subscription` - Boolean indicating if this is a new subscription

- **Features:**
  - Creates user if they don't exist
  - Creates subscription if it doesn't exist
  - Handles resubscription for previously unsubscribed users
  - Prevents duplicate subscriptions
  - Thread-safe with proper error handling

### Indexes

The schema includes comprehensive indexes for optimal performance:

- **User table**: email, status, creation date, activity, source, verification
- **Newsletter table**: user_id, publication, subscription dates, source
- **Composite indexes**: for common query patterns
- **Partial indexes**: for active subscriptions and verified users

### Security

- **Row Level Security (RLS)** enabled on all tables
- **Public INSERT** policies for anonymous signups
- **User-specific SELECT/UPDATE** policies for authenticated users
- **Admin access** for authenticated users to read all data
- **Foreign key constraints** ensure data integrity
- **Unique constraints** prevent duplicate emails and subscriptions

### Usage Examples

```sql
-- Subscribe a user to the general newsletter
SELECT * FROM upsert_user_and_subscribe('user@example.com', 'general', 'landing_page');

-- Get all active subscriptions
SELECT * FROM active_subscriptions WHERE publication = 'tech_accelerator';

-- View subscription statistics
SELECT * FROM subscription_stats;

-- Find users who signed up from a specific source
SELECT * FROM "user" WHERE source = 'landing_page';
```

This schema provides a robust foundation for email marketing, user management, and subscription analytics while maintaining data integrity and security.
