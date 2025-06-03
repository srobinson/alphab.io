-- Create newsletter_signups table for landing page newsletter
CREATE TABLE IF NOT EXISTS newsletter_signups (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(100) DEFAULT 'landing_page',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accelerator_signups table for tech accelerator page
CREATE TABLE IF NOT EXISTS accelerator_signups (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(100) DEFAULT 'tech_accelerator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_signups_created_at ON newsletter_signups(created_at);

CREATE INDEX IF NOT EXISTS idx_accelerator_signups_email ON accelerator_signups(email);

CREATE INDEX IF NOT EXISTS idx_accelerator_signups_created_at ON accelerator_signups(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

ALTER TABLE accelerator_signups ENABLE ROW LEVEL SECURITY;

-- Create policies to allow inserts from anyone (for public signup)
CREATE POLICY IF NOT EXISTS "Allow public inserts on newsletter_signups" ON newsletter_signups FOR
INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "Allow public inserts on accelerator_signups" ON accelerator_signups FOR
INSERT TO anon WITH CHECK (TRUE);

-- Create policies to allow authenticated users to read their own data
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read newsletter_signups" ON newsletter_signups FOR
SELECT TO authenticated USING (TRUE);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to read accelerator_signups" ON accelerator_signups FOR
SELECT TO authenticated USING (TRUE);