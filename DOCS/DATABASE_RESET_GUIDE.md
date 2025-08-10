# Database Reset & Clean Schema Setup Guide

## Overview

This guide helps you reset your Supabase database and apply a clean, comprehensive newsletter system schema from scratch.

## 🚨 Quick Fix for Immediate Issue

Your accelerator page should now work because I've added fallback logic. If it's still not working, you can apply the clean schema immediately.

## 📋 What You Get

The new schema includes:

- **15 core tables** for users, subscriptions, campaigns, analytics
- **Essential functions** like `upsert_user_and_subscribe()`
- **Analytics views** for reporting
- **Row Level Security** for data protection
- **Performance indexes** for speed
- **Sample data** to get started

## 🔄 Reset Process

### Option 1: Complete Reset (Recommended)

1. **Backup your data** (if you have important data)
2. **Reset database** in Supabase dashboard:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Settings > Database
   - Click "Reset database"
3. **Apply clean schema**:
   ```bash
   ./scripts/reset-database.sh --apply
   ```

### Option 2: Apply to Current Database

If you want to keep existing data and just add the new schema:

```bash
./scripts/reset-database.sh --apply-only
```

### Option 3: Manual Application

1. Copy contents of [`supabase/schema.sql`](supabase/schema.sql)
2. Go to Supabase Dashboard > SQL Editor
3. Paste and execute the SQL

## 🧪 Testing

After applying the schema, test it:

```bash
# Check system health
supabase db exec "SELECT system_health_check();"

# Test user signup function
supabase db exec "SELECT upsert_user_and_subscribe('test@example.com', 'tech_accelerator', 'test');"

# View subscription stats
supabase db exec "SELECT * FROM subscription_stats;"
```

## 🌐 Verify Your Site

1. Test accelerator page: https://alphab.io/accelerator
2. Try signing up with an email
3. Check if the success message appears

## 📁 Files Created

- **`supabase/schema.sql`** - Complete database schema (650 lines)
- **`scripts/reset-database.sh`** - Reset and setup script
- **`DATABASE_RESET_GUIDE.md`** - This guide

## 🔧 What's Different

### Before (Problems)

- Multiple conflicting migration files
- Missing functions causing page errors
- Inconsistent schema structure

### After (Clean)

- Single comprehensive schema file
- All functions properly defined
- Consistent table structure
- Performance optimized
- Fully documented

## 🚀 Key Functions Available

```sql
-- Main signup function (what your accelerator page uses)
SELECT upsert_user_and_subscribe(email, publication, source);

-- Analytics tracking
SELECT track_analytics_event(user_id, event_type, event_name, properties);

-- System monitoring
SELECT system_health_check();

-- Subscription statistics
SELECT get_subscription_stats();
```

## 📊 Database Structure

### Core Tables

- `user` - User information and status
- `newsletter` - Subscription management
- `email_templates` - Email templates
- `email_campaigns` - Campaign tracking
- `email_sends` - Individual send tracking

### Analytics Tables

- `analytics_events` - Event tracking
- `daily_analytics` - Daily metrics
- `subscription_analytics` - Growth tracking
- `email_performance` - Campaign performance

### User Management

- `user_preferences` - User preferences
- `user_segments` - Dynamic segmentation
- `user_tags` - Manual categorization
- `user_activity_log` - Activity tracking

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public policies** for signup and unsubscribe
- **Authenticated policies** for admin access
- **Data protection** with proper permissions

## 🎯 Next Steps After Reset

1. **Test the accelerator page** - Should work immediately
2. **Set up monitoring** - Use `system_health_check()`
3. **Configure analytics** - Start tracking user events
4. **Create email templates** - For your campaigns
5. **Set up user segments** - For targeted campaigns

## 🆘 Troubleshooting

### If accelerator page still doesn't work:

1. Check Supabase connection in browser console
2. Verify environment variables in `.env.local`
3. Test database connection: `supabase status`

### If schema application fails:

1. Try manual application via Supabase dashboard
2. Check for permission issues
3. Verify you're linked to the correct project

### If functions don't work:

1. Check RLS policies
2. Verify function permissions
3. Test with authenticated user

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Test database functions directly in Supabase dashboard
3. Verify your project is properly linked: `supabase status`

---

**Ready to reset?** Run: `./scripts/reset-database.sh`

**Just want to apply schema?** Run: `./scripts/reset-database.sh --apply-only`
