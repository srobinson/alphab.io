-- Complete Newsletter System Database Schema
-- Single file to create the entire database from scratch
-- Run this after resetting/recreating your Supabase database
-- ============================================================================
-- CLEANUP: Drop everything if it exists
-- ============================================================================
-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS system_overview CASCADE;

DROP VIEW IF EXISTS email_campaign_performance CASCADE;

DROP VIEW IF EXISTS analytics_dashboard CASCADE;

DROP VIEW IF EXISTS user_profiles CASCADE;

DROP VIEW IF EXISTS campaign_analytics CASCADE;

DROP VIEW IF EXISTS subscription_stats CASCADE;

DROP VIEW IF EXISTS active_subscriptions CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS daily_maintenance CASCADE;

DROP FUNCTION IF EXISTS system_health_check CASCADE;

DROP FUNCTION IF EXISTS cleanup_old_data CASCADE;

DROP FUNCTION IF EXISTS process_unsubscribe_token CASCADE;

DROP FUNCTION IF EXISTS generate_unsubscribe_token CASCADE;

DROP FUNCTION IF EXISTS delete_user_data CASCADE;

DROP FUNCTION IF EXISTS export_user_data CASCADE;

DROP FUNCTION IF EXISTS bulk_unsubscribe CASCADE;

DROP FUNCTION IF EXISTS get_subscription_stats CASCADE;

DROP FUNCTION IF EXISTS update_user_segments CASCADE;

DROP FUNCTION IF EXISTS log_user_activity CASCADE;

DROP FUNCTION IF EXISTS get_user_preferences CASCADE;

DROP FUNCTION IF EXISTS set_user_preference CASCADE;

DROP FUNCTION IF EXISTS calculate_subscription_analytics CASCADE;

DROP FUNCTION IF EXISTS update_daily_analytics CASCADE;

DROP FUNCTION IF EXISTS track_analytics_event CASCADE;

DROP FUNCTION IF EXISTS update_campaign_stats CASCADE;

DROP FUNCTION IF EXISTS create_campaign_sends CASCADE;

DROP FUNCTION IF EXISTS update_user_activity CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

DROP FUNCTION IF EXISTS upsert_user_and_subscribe CASCADE;

-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS content_performance CASCADE;

DROP TABLE IF EXISTS subscription_analytics CASCADE;

DROP TABLE IF EXISTS email_performance CASCADE;

DROP TABLE IF EXISTS daily_analytics CASCADE;

DROP TABLE IF EXISTS analytics_events CASCADE;

DROP TABLE IF EXISTS user_activity_log CASCADE;

DROP TABLE IF EXISTS user_tag_assignments CASCADE;

DROP TABLE IF EXISTS user_tags CASCADE;

DROP TABLE IF EXISTS user_segment_memberships CASCADE;

DROP TABLE IF EXISTS user_segments CASCADE;

DROP TABLE IF EXISTS user_preferences CASCADE;

DROP TABLE IF EXISTS email_sends CASCADE;

DROP TABLE IF EXISTS email_campaigns CASCADE;

DROP TABLE IF EXISTS email_templates CASCADE;

DROP TABLE IF EXISTS newsletter CASCADE;

DROP TABLE IF EXISTS "user" CASCADE;

-- Drop types
DROP TYPE IF EXISTS template_status CASCADE;

DROP TYPE IF EXISTS preference_category CASCADE;

DROP TYPE IF EXISTS publication_type CASCADE;

DROP TYPE IF EXISTS user_status CASCADE;

-- ============================================================================
-- ENUMS: Create all enum types
-- ============================================================================
CREATE TYPE user_status AS ENUM (
    'active',
    'inactive',
    'bounced',
    'unsubscribed',
    'pending'
);

CREATE TYPE publication_type AS ENUM (
    'general',
    'tech_accelerator',
    'ai_dispatch',
    'innovation_updates',
    'product_launches'
);

CREATE TYPE preference_category AS ENUM (
    'content_type',
    'frequency',
    'topics',
    'format',
    'timing'
);

CREATE TYPE template_status AS ENUM ('draft', 'active', 'archived');

-- ============================================================================
-- CORE TABLES: Users and Subscriptions
-- ============================================================================
-- Users table
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status user_status DEFAULT 'active',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    source VARCHAR(100),
    -- Track where they signed up from
    ip_address INET,
    -- For analytics and spam prevention
    user_agent TEXT,
    -- Browser/device info
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions table
CREATE TABLE newsletter (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(id) ON
    DELETE CASCADE,
        publication publication_type DEFAULT 'general',
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        unsubscribed_at TIMESTAMP WITH TIME ZONE,
        source VARCHAR(100),
        -- Specific source for this subscription
        preferences JSONB DEFAULT '{}',
        -- Store subscription preferences
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        -- Ensure unique subscription per user per publication
        UNIQUE(user_id, publication)
);

-- ============================================================================
-- EMAIL CAMPAIGN TABLES
-- ============================================================================
-- Email templates
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    NAME VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    publication publication_type NOT NULL,
    status template_status DEFAULT 'draft',
    variables JSONB DEFAULT '{}',
    -- Template variables like {{first_name}}, {{unsubscribe_url}}
    created_by UUID,
    -- Could reference auth.users if using Supabase Auth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure unique template names per publication
    UNIQUE(NAME, publication)
);

-- Email campaigns
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    NAME VARCHAR(255) NOT NULL,
    template_id UUID NOT NULL REFERENCES email_templates(id) ON
    DELETE RESTRICT,
        publication publication_type NOT NULL,
        subject_override VARCHAR(500),
        -- Override template subject if needed
        scheduled_at TIMESTAMP WITH TIME ZONE,
        sent_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'draft' CHECK (
            status IN (
                'draft',
                'scheduled',
                'sending',
                'sent',
                'cancelled'
            )
        ),
        recipient_count INTEGER DEFAULT 0,
        sent_count INTEGER DEFAULT 0,
        delivered_count INTEGER DEFAULT 0,
        opened_count INTEGER DEFAULT 0,
        clicked_count INTEGER DEFAULT 0,
        bounced_count INTEGER DEFAULT 0,
        unsubscribed_count INTEGER DEFAULT 0,
        created_by UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email sends tracking
CREATE TABLE email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON
    DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES "user"(id) ON
    DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        -- Denormalized for performance
        status VARCHAR(50) DEFAULT 'pending' CHECK (
            status IN (
                'pending',
                'sent',
                'delivered',
                'bounced',
                'failed'
            )
        ),
        sent_at TIMESTAMP WITH TIME ZONE,
        delivered_at TIMESTAMP WITH TIME ZONE,
        opened_at TIMESTAMP WITH TIME ZONE,
        clicked_at TIMESTAMP WITH TIME ZONE,
        bounced_at TIMESTAMP WITH TIME ZONE,
        bounce_reason TEXT,
        unsubscribed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        -- Ensure unique send per campaign per user
        UNIQUE(campaign_id, user_id)
);

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================
-- User preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON
    DELETE CASCADE,
        category preference_category NOT NULL,
        key VARCHAR(100) NOT NULL,
        VALUE JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        -- Ensure unique preference per user per category per key
        UNIQUE(user_id, category, key)
);

-- User segments
CREATE TABLE user_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    NAME VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    conditions JSONB NOT NULL,
    -- JSON conditions for segment membership
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User segment memberships
CREATE TABLE user_segment_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON
    DELETE CASCADE,
        segment_id UUID NOT NULL REFERENCES user_segments(id) ON
    DELETE CASCADE,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        -- Ensure unique membership per user per segment
        UNIQUE(user_id, segment_id)
);

-- User tags
CREATE TABLE user_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    NAME VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#6B7280',
    -- Hex color code
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tag assignments
CREATE TABLE user_tag_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON
    DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES user_tags(id) ON
    DELETE CASCADE,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        assigned_by UUID,
        -- Could reference auth.users
        -- Ensure unique tag assignment per user
        UNIQUE(user_id, tag_id)
);

-- User activity log
CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON
    DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        activity_data JSONB DEFAULT '{}',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS TABLES
-- ============================================================================
-- Analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "user"(id) ON
    DELETE
    SET NULL,
        session_id UUID,
        event_type VARCHAR(100) NOT NULL,
        event_name VARCHAR(100) NOT NULL,
        properties JSONB DEFAULT '{}',
        page_url TEXT,
        referrer TEXT,
        ip_address INET,
        user_agent TEXT,
        device_type VARCHAR(50),
        browser VARCHAR(50),
        os VARCHAR(50),
        country VARCHAR(2),
        -- ISO country code
        city VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily analytics
CREATE TABLE daily_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    DATE DATE NOT NULL,
    publication publication_type,
    metric_type VARCHAR(100) NOT NULL,
    metric_value BIGINT NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure unique metric per date per publication
    UNIQUE(DATE, publication, metric_type)
);

-- Email performance tracking
CREATE TABLE email_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id) ON
    DELETE CASCADE,
        template_id UUID REFERENCES email_templates(id) ON
    DELETE
    SET NULL,
        user_id UUID REFERENCES "user"(id) ON
    DELETE CASCADE,
        email_send_id UUID REFERENCES email_sends(id) ON
    DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL CHECK (
            event_type IN (
                'sent',
                'delivered',
                'opened',
                'clicked',
                'bounced',
                'unsubscribed',
                'complained'
            )
        ),
        event_data JSONB DEFAULT '{}',
        link_url TEXT,
        -- For click events
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription analytics
CREATE TABLE subscription_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    DATE DATE NOT NULL,
    publication publication_type NOT NULL,
    new_subscriptions INTEGER DEFAULT 0,
    unsubscriptions INTEGER DEFAULT 0,
    net_growth INTEGER DEFAULT 0,
    total_active_subscribers INTEGER DEFAULT 0,
    churn_rate DECIMAL(5, 2) DEFAULT 0.00,
    growth_rate DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure unique record per date per publication
    UNIQUE(DATE, publication)
);

-- Content performance
CREATE TABLE content_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id VARCHAR(255) NOT NULL,
    -- Could be campaign_id, article_id, etc.
    content_type VARCHAR(100) NOT NULL,
    -- 'email_campaign', 'blog_post', etc.
    publication publication_type,
    title VARCHAR(500),
    VIEWS INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_score DECIMAL(10, 2) DEFAULT 0.00,
    performance_data JSONB DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure unique record per content
    UNIQUE(content_id, content_type)
);

-- Contact form submissions
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    NAME VARCHAR(255) NOT NULL,
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

-- ============================================================================
-- INDEXES: Performance optimization
-- ============================================================================
-- User table indexes
CREATE INDEX idx_user_email ON "user"(email);

CREATE INDEX idx_user_status ON "user"(status);

CREATE INDEX idx_user_created_at ON "user"(created_at);

CREATE INDEX idx_user_last_activity ON "user"(last_activity_at);

CREATE INDEX idx_user_source ON "user"(source);

CREATE INDEX idx_user_email_verified ON "user"(email_verified);

CREATE INDEX idx_user_active_email ON "user"(email, status)
WHERE status = 'active';

-- Newsletter table indexes
CREATE INDEX idx_newsletter_user_id ON newsletter(user_id);

CREATE INDEX idx_newsletter_publication ON newsletter(publication);

CREATE INDEX idx_newsletter_subscribed_at ON newsletter(subscribed_at);

CREATE INDEX idx_newsletter_source ON newsletter(source);

CREATE INDEX idx_newsletter_active_subscriptions ON newsletter(user_id, publication)
WHERE unsubscribed_at IS NULL;

CREATE INDEX idx_newsletter_active_by_publication ON newsletter(publication, subscribed_at)
WHERE unsubscribed_at IS NULL;

-- Email campaign indexes
CREATE INDEX idx_email_templates_publication ON email_templates(publication);

CREATE INDEX idx_email_templates_status ON email_templates(status);

CREATE INDEX idx_email_campaigns_template_id ON email_campaigns(template_id);

CREATE INDEX idx_email_campaigns_publication ON email_campaigns(publication);

CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);

CREATE INDEX idx_email_sends_campaign_id ON email_sends(campaign_id);

CREATE INDEX idx_email_sends_user_id ON email_sends(user_id);

CREATE INDEX idx_email_sends_status ON email_sends(status);

-- User management indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

CREATE INDEX idx_user_preferences_category ON user_preferences(category);

CREATE INDEX idx_user_segment_memberships_user_id ON user_segment_memberships(user_id);

CREATE INDEX idx_user_segment_memberships_segment_id ON user_segment_memberships(segment_id);

CREATE INDEX idx_user_tag_assignments_user_id ON user_tag_assignments(user_id);

CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);

CREATE INDEX idx_user_activity_log_activity_type ON user_activity_log(activity_type);

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);

CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);

CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

CREATE INDEX idx_daily_analytics_date ON daily_analytics(DATE);

CREATE INDEX idx_daily_analytics_publication ON daily_analytics(publication);

CREATE INDEX idx_email_performance_campaign_id ON email_performance(campaign_id);

CREATE INDEX idx_subscription_analytics_date ON subscription_analytics(DATE);

-- Contact table indexes
CREATE INDEX idx_contacts_email ON contacts(email);

CREATE INDEX idx_contacts_status ON contacts(status);

CREATE INDEX idx_contacts_created_at ON contacts(created_at);

CREATE INDEX idx_contacts_source ON contacts(source);

-- ============================================================================
-- FUNCTIONS: Core functionality
-- ============================================================================
-- Function to automatically update updated_at timestamp
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW .updated_at = NOW();

RETURN NEW;

END;

$$ LANGUAGE 'plpgsql';

-- Function to handle user activity tracking
CREATE
OR REPLACE FUNCTION update_user_activity() RETURNS TRIGGER AS $$
BEGIN
UPDATE "user"
SET last_activity_at = NOW()
WHERE id = NEW .user_id;

RETURN NEW;

END;

$$ LANGUAGE 'plpgsql';

-- Main function for user creation and subscription
CREATE
OR REPLACE FUNCTION upsert_user_and_subscribe(
    p_email VARCHAR(255),
    p_publication publication_type DEFAULT 'general',
    p_source VARCHAR(100) DEFAULT NULL,
    p_first_name VARCHAR(100) DEFAULT NULL,
    p_last_name VARCHAR(100) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS TABLE(
    user_id UUID,
    is_new_user BOOLEAN,
    is_new_subscription BOOLEAN
) AS $$
DECLARE v_user_id UUID;

v_is_new_user BOOLEAN := FALSE;

v_is_new_subscription BOOLEAN := FALSE;

v_existing_subscription_id BIGINT;

BEGIN -- Try to find existing user
SELECT u.id INTO v_user_id
FROM "user" u
WHERE u.email = p_email;

-- If user doesn't exist, create them
IF v_user_id IS NULL THEN
INSERT INTO "user" (
        email,
        source,
        first_name,
        last_name,
        ip_address,
        user_agent
    )
VALUES (
        p_email,
        p_source,
        p_first_name,
        p_last_name,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO v_user_id;

v_is_new_user := TRUE;

END IF;

-- Check if subscription already exists
SELECT n.id INTO v_existing_subscription_id
FROM newsletter n
WHERE n.user_id = v_user_id
    AND n.publication = p_publication;

-- If subscription doesn't exist, create it
IF v_existing_subscription_id IS NULL THEN
INSERT INTO newsletter (user_id, publication, source)
VALUES (v_user_id, p_publication, p_source);

v_is_new_subscription := TRUE;

ELSE -- If subscription exists but was unsubscribed, resubscribe
UPDATE newsletter
SET unsubscribed_at = NULL,
    subscribed_at = NOW(),
    updated_at = NOW()
WHERE id = v_existing_subscription_id
    AND unsubscribed_at IS NOT NULL;

IF FOUND THEN v_is_new_subscription := TRUE;

END IF;

END IF;

RETURN QUERY
SELECT v_user_id,
    v_is_new_user,
    v_is_new_subscription;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track analytics events
CREATE
OR REPLACE FUNCTION track_analytics_event(
    p_event_type VARCHAR(100),
    p_event_name VARCHAR(100),
    p_user_id UUID DEFAULT NULL,
    p_session_id UUID DEFAULT NULL,
    p_properties JSONB DEFAULT '{}',
    p_page_url TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE v_event_id UUID;

BEGIN
INSERT INTO analytics_events (
        event_type,
        event_name,
        user_id,
        session_id,
        properties,
        page_url,
        referrer,
        ip_address,
        user_agent
    )
VALUES (
        p_event_type,
        p_event_name,
        p_user_id,
        p_session_id,
        p_properties,
        p_page_url,
        p_referrer,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO v_event_id;

RETURN v_event_id;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get subscription statistics
CREATE
OR REPLACE FUNCTION get_subscription_stats(
    p_publication publication_type DEFAULT NULL
) RETURNS TABLE(
    publication publication_type,
    total_subscribers BIGINT,
    active_subscribers BIGINT,
    growth_rate DECIMAL(5, 2)
) AS $$
BEGIN RETURN QUERY
SELECT n.publication,
    COUNT(*) AS total_subs,
    COUNT(*) FILTER (
        WHERE n.unsubscribed_at IS NULL
    ) AS active_subs,
    CASE
        WHEN COUNT(*) > 0 THEN ROUND(
            (
                COUNT(*) FILTER (
                    WHERE n.unsubscribed_at IS NULL
                )::DECIMAL / COUNT(*)
            ) * 100,
            2
        )
        ELSE 0
    END AS growth_rate
FROM newsletter n
WHERE (
        p_publication IS NULL
        OR n.publication = p_publication
    )
GROUP BY n.publication;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- System health check function
CREATE
OR REPLACE FUNCTION system_health_check() RETURNS JSON AS $$
DECLARE v_result JSON;

BEGIN
SELECT json_build_object(
        'timestamp',
        NOW(),
        'total_users',
        (
            SELECT COUNT(*)
            FROM "user"
        ),
        'active_users',
        (
            SELECT COUNT(*)
            FROM "user"
            WHERE status = 'active'
        ),
        'total_subscriptions',
        (
            SELECT COUNT(*)
            FROM newsletter
        ),
        'active_subscriptions',
        (
            SELECT COUNT(*)
            FROM newsletter
            WHERE unsubscribed_at IS NULL
        ),
        'subscription_by_publication',
        (
            SELECT json_object_agg(publication, active_count)
            FROM (
                    SELECT publication,
                        COUNT(*) FILTER (
                            WHERE unsubscribed_at IS NULL
                        ) AS active_count
                    FROM newsletter
                    GROUP BY publication
                ) pub_stats
        )
    ) INTO v_result;

RETURN v_result;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS: Automatic updates
-- ============================================================================
-- Triggers for updated_at columns
CREATE TRIGGER update_user_updated_at BEFORE
UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at BEFORE
UPDATE ON newsletter FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE
UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE
UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE
UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE
UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update user activity
CREATE TRIGGER update_user_activity_on_newsletter_change AFTER
INSERT
    OR
UPDATE ON newsletter FOR EACH ROW EXECUTE FUNCTION update_user_activity();

-- ============================================================================
-- VIEWS: Easy data access
-- ============================================================================
-- Active subscriptions view
CREATE VIEW active_subscriptions AS
SELECT u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.status AS user_status,
    n.publication,
    n.subscribed_at,
    n.source AS subscription_source,
    u.source AS user_source,
    u.created_at AS user_created_at
FROM "user" u
    JOIN newsletter n ON u.id = n.user_id
WHERE u.status = 'active'
    AND n.unsubscribed_at IS NULL;

-- Subscription statistics view
CREATE VIEW subscription_stats AS
SELECT publication,
    COUNT(*) AS total_subscriptions,
    COUNT(*) FILTER (
        WHERE unsubscribed_at IS NULL
    ) AS active_subscriptions,
    COUNT(*) FILTER (
        WHERE unsubscribed_at IS NOT NULL
    ) AS unsubscribed_count,
    COUNT(DISTINCT user_id) AS unique_users,
    DATE_TRUNC('day', MIN(subscribed_at)) AS first_subscription,
    DATE_TRUNC('day', MAX(subscribed_at)) AS latest_subscription
FROM newsletter
GROUP BY publication;

-- System overview
CREATE VIEW system_overview AS
SELECT 'Newsletter System' AS system_name,
    NOW() AS generated_at,
    (
        SELECT COUNT(*)
        FROM "user"
    ) AS total_users,
    (
        SELECT COUNT(*)
        FROM "user"
        WHERE status = 'active'
    ) AS active_users,
    (
        SELECT COUNT(*)
        FROM newsletter
        WHERE unsubscribed_at IS NULL
    ) AS active_subscriptions,
    (
        SELECT COUNT(*)
        FROM email_campaigns
    ) AS total_campaigns,
    (
        SELECT COUNT(*)
        FROM email_templates
    ) AS total_templates;

-- ============================================================================
-- ROW LEVEL SECURITY: Data protection
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_segments ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_segment_memberships ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_tag_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

ALTER TABLE email_performance ENABLE ROW LEVEL SECURITY;

ALTER TABLE subscription_analytics ENABLE ROW LEVEL SECURITY;

ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for public access (signup, unsubscribe)
CREATE POLICY "Allow public inserts on user" ON "user" FOR
INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "Allow public inserts on newsletter" ON newsletter FOR
INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "Allow public analytics events" ON analytics_events FOR
INSERT TO anon,
    authenticated WITH CHECK (TRUE);

-- Authenticated user policies
CREATE POLICY "Allow authenticated users to read all data" ON "user" FOR
SELECT TO authenticated USING (TRUE);

CREATE POLICY "Allow authenticated users to read newsletters" ON newsletter FOR
SELECT TO authenticated USING (TRUE);

CREATE POLICY "Allow authenticated users to manage campaigns" ON email_campaigns FOR ALL TO authenticated USING (TRUE);

CREATE POLICY "Allow authenticated users to read analytics" ON analytics_events FOR
SELECT TO authenticated USING (TRUE);

-- RLS Policies for contacts table
CREATE POLICY "Allow public contact form submissions" ON contacts FOR
INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "Allow authenticated users to read contacts" ON contacts FOR
SELECT TO authenticated USING (TRUE);

CREATE POLICY "Allow authenticated users to manage contacts" ON contacts FOR ALL TO authenticated USING (TRUE);

-- ============================================================================
-- PERMISSIONS: Grant access
-- ============================================================================
-- Grant usage on schema
GRANT USAGE ON SCHEMA PUBLIC TO anon,
authenticated;

-- Grant table permissions
GRANT ALL ON "user" TO anon,
authenticated;

GRANT ALL ON newsletter TO anon,
authenticated;

GRANT ALL ON email_templates TO authenticated;

GRANT ALL ON email_campaigns TO authenticated;

GRANT ALL ON email_sends TO authenticated;

GRANT ALL ON user_preferences TO authenticated;

GRANT ALL ON user_segments TO authenticated;

GRANT ALL ON user_segment_memberships TO authenticated;

GRANT ALL ON user_tags TO authenticated;

GRANT ALL ON user_tag_assignments TO authenticated;

GRANT ALL ON user_activity_log TO anon,
authenticated;

GRANT ALL ON analytics_events TO anon,
authenticated;

GRANT ALL ON daily_analytics TO authenticated;

GRANT ALL ON email_performance TO anon,
authenticated;

GRANT ALL ON subscription_analytics TO authenticated;

GRANT ALL ON content_performance TO authenticated;

GRANT ALL ON contacts TO anon,
authenticated;

-- Grant sequence permissions
GRANT USAGE,
SELECT ON SEQUENCE newsletter_id_seq TO anon,
authenticated;

-- Grant view permissions
GRANT SELECT ON active_subscriptions TO authenticated;

GRANT SELECT ON subscription_stats TO authenticated;

GRANT SELECT ON system_overview TO authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION upsert_user_and_subscribe TO anon,
authenticated;

GRANT EXECUTE ON FUNCTION track_analytics_event TO anon,
authenticated;

GRANT EXECUTE ON FUNCTION get_subscription_stats TO authenticated;

GRANT EXECUTE ON FUNCTION system_health_check TO authenticated;

-- ============================================================================
-- SAMPLE DATA: Initial setup
-- ============================================================================
-- Insert default user tags
INSERT INTO user_tags (NAME, color, description)
VALUES ('VIP', '#F59E0B', 'VIP subscribers'),
    (
        'Early Adopter',
        '#10B981',
        'Early adopters of new features'
    ),
    (
        'High Engagement',
        '#3B82F6',
        'Highly engaged users'
    ),
    (
        'At Risk',
        '#EF4444',
        'Users at risk of churning'
    ),
    (
        'New Subscriber',
        '#8B5CF6',
        'Recently subscribed users'
    );

-- Insert default user segments
INSERT INTO user_segments (NAME, description, conditions)
VALUES (
        'Active Subscribers',
        'Users with active subscriptions',
        '{"status": "active", "has_subscription": true}'
    ),
    (
        'Tech Enthusiasts',
        'Users interested in tech content',
        '{"interests": ["technology", "ai", "innovation"]}'
    ),
    (
        'Weekly Digest Subscribers',
        'Users who prefer weekly content',
        '{"frequency_preference": "weekly"}'
    );

-- ============================================================================
-- COMMENTS: Documentation
-- ============================================================================
COMMENT ON TABLE "user" IS 'Core user table for newsletter subscriptions';

COMMENT ON TABLE newsletter IS 'Newsletter subscription tracking table';

COMMENT ON FUNCTION upsert_user_and_subscribe IS 'Safely creates or updates user and subscription in a single transaction';

COMMENT ON VIEW active_subscriptions IS 'View of all active newsletter subscriptions';

COMMENT ON VIEW subscription_stats IS 'Analytics view for subscription metrics by publication type';

COMMENT ON VIEW system_overview IS 'High-level overview of the entire newsletter system';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN RAISE NOTICE 'Newsletter system database schema created successfully!';

RAISE NOTICE 'Tables created: %, Functions: %, Views: %',
(
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = 'public'
),
(
    SELECT COUNT(*)
    FROM information_schema.routines
    WHERE routine_schema = 'public'
),
(
    SELECT COUNT(*)
    FROM information_schema.views
    WHERE table_schema = 'public'
);

RAISE NOTICE 'Test the system with: SELECT * FROM system_health_check();';

END $$;