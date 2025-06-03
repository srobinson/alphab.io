# Supabase Newsletter System Schema Documentation

## Overview

This document describes the comprehensive newsletter system database schema implemented in Supabase. The system is designed to handle user management, newsletter subscriptions, email campaigns, analytics, and user preferences with full GDPR compliance.

## Migration Files

The schema is implemented through the following migration files (in order):

1. **20250604030000_consolidated_schema.sql** - Core schema with users and newsletters
2. **20250604030100_email_templates.sql** - Email templates and campaign management
3. **20250604030200_user_preferences_segmentation.sql** - User preferences and segmentation
4. **20250604030300_analytics_reporting.sql** - Analytics and reporting features
5. **20250604030400_cleanup_and_utilities.sql** - Utility functions and maintenance

## Core Tables

### Users and Subscriptions

#### `user` table

- **Purpose**: Core user information and status tracking
- **Key Features**:
  - UUID primary key for security
  - Email verification tracking
  - Activity tracking with `last_activity_at`
  - Source tracking for attribution
  - IP and user agent for analytics
  - Status enum: `active`, `inactive`, `bounced`, `unsubscribed`, `pending`

#### `newsletter` table

- **Purpose**: Newsletter subscription management
- **Key Features**:
  - Many-to-many relationship between users and publications
  - Publication types: `general`, `tech_accelerator`, `ai_dispatch`, `innovation_updates`, `product_launches`
  - Subscription and unsubscription tracking
  - JSONB preferences for flexible configuration
  - Unique constraint per user per publication

### Email Campaign Management

#### `email_templates` table

- **Purpose**: Reusable email templates
- **Key Features**:
  - HTML and text content support
  - Template variables in JSONB format
  - Status tracking: `draft`, `active`, `archived`
  - Publication-specific templates

#### `email_campaigns` table

- **Purpose**: Email campaign management and tracking
- **Key Features**:
  - Campaign scheduling and status tracking
  - Comprehensive metrics (sent, delivered, opened, clicked, bounced)
  - Subject override capability
  - Performance statistics

#### `email_sends` table

- **Purpose**: Individual email send tracking
- **Key Features**:
  - Per-user campaign delivery tracking
  - Detailed status tracking
  - Bounce and unsubscribe tracking
  - Unique constraint per campaign per user

### User Management and Segmentation

#### `user_preferences` table

- **Purpose**: User-specific preferences
- **Categories**: `content_type`, `frequency`, `topics`, `format`, `timing`
- **Key Features**:
  - JSONB values for flexible preference storage
  - Category-based organization

#### `user_segments` table

- **Purpose**: Dynamic user segmentation
- **Key Features**:
  - JSONB conditions for flexible segment rules
  - Active/inactive status
  - Automatic membership calculation

#### `user_tags` table & `user_tag_assignments`

- **Purpose**: Manual user categorization
- **Key Features**:
  - Color-coded tags
  - Many-to-many relationship
  - Assignment tracking

#### `user_activity_log` table

- **Purpose**: Comprehensive activity tracking
- **Key Features**:
  - Flexible activity type system
  - JSONB data for custom properties
  - IP and user agent tracking

### Analytics and Reporting

#### `analytics_events` table

- **Purpose**: Detailed event tracking
- **Key Features**:
  - Session-based tracking
  - Custom properties in JSONB
  - Device and location tracking
  - Page and referrer tracking

#### `daily_analytics` table

- **Purpose**: Daily aggregated metrics
- **Key Features**:
  - Publication-specific metrics
  - Flexible metric types
  - Historical data retention

#### `subscription_analytics` table

- **Purpose**: Subscription growth and churn tracking
- **Key Features**:
  - Daily subscription metrics
  - Growth and churn rate calculations
  - Net growth tracking

#### `email_performance` table

- **Purpose**: Email campaign performance tracking
- **Key Features**:
  - Event-based tracking (sent, delivered, opened, clicked, etc.)
  - Link tracking for clicks
  - Integration with campaign analytics

## Key Functions

### Core Operations

#### `upsert_user_and_subscribe()`

- **Purpose**: Safely create or update user and subscription
- **Features**: Atomic operation, handles existing users, resubscription logic

#### `update_updated_at_column()`

- **Purpose**: Automatic timestamp updates
- **Usage**: Trigger function for all tables with `updated_at` columns

#### `update_user_activity()`

- **Purpose**: Track user activity on newsletter interactions
- **Usage**: Automatically updates `last_activity_at` on newsletter changes

### Campaign Management

#### `create_campaign_sends()`

- **Purpose**: Generate email send records for campaign recipients
- **Features**: Filters active subscribers, prevents duplicates

#### `update_campaign_stats()`

- **Purpose**: Real-time campaign statistics updates
- **Usage**: Triggered on email_sends changes

### Analytics Functions

#### `track_analytics_event()`

- **Purpose**: Record user behavior events
- **Features**: Flexible event properties, session tracking

#### `update_daily_analytics()`

- **Purpose**: Calculate and store daily metrics
- **Features**: Publication-specific calculations, conflict handling

#### `calculate_subscription_analytics()`

- **Purpose**: Calculate subscription growth and churn metrics
- **Features**: Rate calculations, historical comparisons

### User Management

#### `set_user_preference()` & `get_user_preferences()`

- **Purpose**: Manage user preferences
- **Features**: Category-based organization, upsert logic

#### `log_user_activity()`

- **Purpose**: Record user activities
- **Features**: Flexible activity types, metadata support

#### `update_user_segments()`

- **Purpose**: Update user segment memberships
- **Features**: Condition evaluation, automatic updates

### Utility Functions

#### `get_subscription_stats()`

- **Purpose**: Comprehensive subscription statistics
- **Features**: Date range filtering, growth/churn calculations

#### `bulk_unsubscribe()`

- **Purpose**: Bulk unsubscribe operations
- **Features**: Activity logging, publication filtering

#### `export_user_data()` & `delete_user_data()`

- **Purpose**: GDPR compliance functions
- **Features**: Complete data export, anonymization options

#### `generate_unsubscribe_token()` & `process_unsubscribe_token()`

- **Purpose**: Secure unsubscribe links
- **Features**: Token generation, validation, automatic unsubscribe

#### `cleanup_old_data()`

- **Purpose**: Data retention management
- **Features**: Configurable retention periods, selective cleanup

#### `system_health_check()`

- **Purpose**: System monitoring and statistics
- **Features**: Comprehensive metrics, performance indicators

#### `daily_maintenance()`

- **Purpose**: Automated daily tasks
- **Features**: Analytics updates, segment recalculation

## Views

### `active_subscriptions`

- **Purpose**: Current active newsletter subscriptions
- **Features**: User and subscription details, source tracking

### `subscription_stats`

- **Purpose**: Publication-level subscription analytics
- **Features**: Total, active, and unsubscribed counts by publication

### `campaign_analytics`

- **Purpose**: Email campaign performance metrics
- **Features**: Delivery rates, open rates, click-through rates

### `user_profiles`

- **Purpose**: Comprehensive user information
- **Features**: Aggregated preferences, tags, and segments

### `analytics_dashboard`

- **Purpose**: High-level analytics overview
- **Features**: Monthly aggregations, growth metrics

### `email_campaign_performance`

- **Purpose**: Detailed campaign performance
- **Features**: Engagement scores, performance metrics

### `system_overview`

- **Purpose**: System-wide statistics
- **Features**: Total counts, active metrics

## Security Features

### Row Level Security (RLS)

- **Enabled on all tables** for data protection
- **User-specific policies** for personal data access
- **Public policies** for signup and unsubscribe operations
- **Authenticated policies** for administrative access

### Data Protection

- **Email verification** tracking and enforcement
- **IP address logging** for security and analytics
- **Activity logging** for audit trails
- **GDPR compliance** with export and deletion functions

## Indexes and Performance

### Strategic Indexing

- **Email lookups** optimized with unique indexes
- **Date-based queries** optimized for analytics
- **Status filtering** for active record queries
- **Composite indexes** for common query patterns

### Performance Features

- **Partial indexes** for active records only
- **JSONB indexing** for preference queries
- **Trigger-based updates** for real-time statistics
- **View materialization** for complex aggregations

## Usage Examples

### Basic Subscription

```sql
SELECT * FROM upsert_user_and_subscribe(
    'user@example.com',
    'tech_accelerator',
    'website_signup',
    'John',
    'Doe'
);
```

### Analytics Tracking

```sql
SELECT track_analytics_event(
    user_id,
    'page_view',
    'newsletter_signup',
    '{"page": "/signup", "source": "organic"}'::jsonb
);
```

### Campaign Creation

```sql
-- Create campaign sends for all eligible subscribers
SELECT create_campaign_sends(campaign_id, 'ai_dispatch');
```

### User Data Export (GDPR)

```sql
SELECT export_user_data(user_id);
```

## Maintenance and Monitoring

### Daily Tasks

- Run `daily_maintenance()` for analytics updates
- Monitor `system_health_check()` for system status
- Execute `cleanup_old_data()` for data retention

### Performance Monitoring

- Monitor index usage and query performance
- Track table sizes and growth patterns
- Review RLS policy performance

### Data Quality

- Validate email addresses and domains
- Monitor bounce rates and deliverability
- Track user engagement patterns

## Migration Strategy

### Development to Production

1. Test migrations in development environment
2. Backup production database before migration
3. Run migrations in order during maintenance window
4. Verify data integrity and function operation
5. Monitor performance after migration

### Rollback Plan

- Each migration includes DROP statements for rollback
- Backup data before destructive operations
- Test rollback procedures in development
- Document rollback steps for each migration

This schema provides a robust foundation for a comprehensive newsletter system with advanced analytics, user management, and compliance features.
