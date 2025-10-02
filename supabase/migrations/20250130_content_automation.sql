-- Content automation database schema extension
-- Adds tables for content sources, sync logs, and industry moves cache

-- Content sources tracking
CREATE TABLE IF NOT EXISTS content_sources (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rss_url TEXT,
  api_url TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('ai', 'tech', 'business', 'research')),
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  max_items INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  last_checked TIMESTAMPTZ,
  last_successful_sync TIMESTAMPTZ,
  consecutive_failures INTEGER DEFAULT 0,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content sync logs for monitoring
CREATE TABLE IF NOT EXISTS content_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id VARCHAR(255) REFERENCES content_sources(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) DEFAULT 'scheduled' CHECK (sync_type IN ('manual', 'scheduled', 'test')),
  items_found INTEGER DEFAULT 0,
  items_processed INTEGER DEFAULT 0,
  items_published INTEGER DEFAULT 0,
  items_skipped INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  sync_duration_ms INTEGER,
  success BOOLEAN DEFAULT FALSE,
  errors JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Industry moves cache for fast loading
CREATE TABLE IF NOT EXISTS industry_moves_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('breaking', 'trending', 'update', 'insight')),
  is_trending BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  priority_score INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 hour',
  
  UNIQUE(article_id)
);

-- Content classification cache
CREATE TABLE IF NOT EXISTS content_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  classification_type VARCHAR(50) NOT NULL,
  relevance_score INTEGER DEFAULT 0,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  ai_generated BOOLEAN DEFAULT FALSE,
  classification_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(article_id, classification_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_sources_active ON content_sources(is_active, priority);
CREATE INDEX IF NOT EXISTS idx_content_sources_last_checked ON content_sources(last_checked) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_sync_logs_source_created ON content_sync_logs(source_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_success_created ON content_sync_logs(success, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_industry_moves_cache_expires ON industry_moves_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_industry_moves_cache_order ON industry_moves_cache(display_order, expires_at);
CREATE INDEX IF NOT EXISTS idx_industry_moves_cache_trending ON industry_moves_cache(is_trending, display_order, expires_at);
CREATE INDEX IF NOT EXISTS idx_industry_moves_cache_breaking ON industry_moves_cache(is_breaking, display_order, expires_at);

CREATE INDEX IF NOT EXISTS idx_content_classifications_article ON content_classifications(article_id, classification_type);
CREATE INDEX IF NOT EXISTS idx_content_classifications_relevance ON content_classifications(relevance_score DESC);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_content_sources()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_content_sources_updated_at
BEFORE UPDATE ON content_sources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_content_sources();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM industry_moves_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get active content sources by priority
CREATE OR REPLACE FUNCTION get_active_content_sources()
RETURNS TABLE(
  id VARCHAR(255),
  name VARCHAR(255),
  rss_url TEXT,
  category VARCHAR(50),
  priority VARCHAR(10),
  max_items INTEGER,
  last_checked TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT cs.id, cs.name, cs.rss_url, cs.category, cs.priority, cs.max_items, cs.last_checked
  FROM content_sources cs
  WHERE cs.is_active = TRUE
  ORDER BY 
    CASE cs.priority 
      WHEN 'high' THEN 1 
      WHEN 'medium' THEN 2 
      WHEN 'low' THEN 3 
    END,
    cs.name;
END;
$$ LANGUAGE plpgsql;

-- Function to log sync results
CREATE OR REPLACE FUNCTION log_content_sync(
  p_source_id VARCHAR(255),
  p_sync_type VARCHAR(50),
  p_items_found INTEGER,
  p_items_processed INTEGER,
  p_items_published INTEGER,
  p_items_skipped INTEGER DEFAULT 0,
  p_items_failed INTEGER DEFAULT 0,
  p_duration_ms INTEGER DEFAULT NULL,
  p_success BOOLEAN DEFAULT TRUE,
  p_errors JSONB DEFAULT '[]',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO content_sync_logs (
    source_id, sync_type, items_found, items_processed, items_published,
    items_skipped, items_failed, sync_duration_ms, success, errors, metadata
  ) VALUES (
    p_source_id, p_sync_type, p_items_found, p_items_processed, p_items_published,
    p_items_skipped, p_items_failed, p_duration_ms, p_success, p_errors, p_metadata
  ) RETURNING id INTO v_log_id;
  
  -- Update source last_checked timestamp
  UPDATE content_sources 
  SET 
    last_checked = NOW(),
    last_successful_sync = CASE WHEN p_success THEN NOW() ELSE last_successful_sync END,
    consecutive_failures = CASE WHEN p_success THEN 0 ELSE consecutive_failures + 1 END
  WHERE id = p_source_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default content sources
INSERT INTO content_sources (id, name, rss_url, category, priority, max_items, is_active) VALUES
('techcrunch-ai', 'TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'ai', 'high', 15, TRUE),
('venturebeat-ai', 'VentureBeat AI', 'https://venturebeat.com/ai/feed/', 'ai', 'high', 15, TRUE),
('the-verge-ai', 'The Verge AI', 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', 'ai', 'high', 10, TRUE),
('wired-ai', 'Wired AI', 'https://www.wired.com/feed/tag/ai/latest/rss', 'ai', 'high', 10, TRUE),
('ars-technica', 'Ars Technica Tech', 'https://feeds.arstechnica.com/arstechnica/technology-lab', 'tech', 'medium', 8, TRUE),
('ai-news', 'AI News', 'https://www.artificialintelligence-news.com/feed/', 'ai', 'medium', 12, TRUE),
('openai-blog', 'OpenAI Blog', 'https://openai.com/blog/rss.xml', 'research', 'high', 5, TRUE),
('anthropic-blog', 'Anthropic Blog', 'https://www.anthropic.com/news/rss.xml', 'research', 'high', 5, FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  rss_url = EXCLUDED.rss_url,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  max_items = EXCLUDED.max_items,
  updated_at = NOW();

-- RLS Policies for new tables
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_moves_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_classifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read content sources and sync logs
CREATE POLICY content_sources_read_authenticated ON content_sources FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY sync_logs_read_authenticated ON content_sync_logs FOR SELECT TO authenticated USING (TRUE);

-- Allow public access to industry moves cache (for the API)
CREATE POLICY industry_moves_cache_read_public ON industry_moves_cache FOR SELECT TO anon, authenticated USING (expires_at > NOW());

-- Allow public access to content classifications (for relevance scoring)
CREATE POLICY content_classifications_read_public ON content_classifications FOR SELECT TO anon, authenticated USING (TRUE);

-- Allow service role to manage all data
CREATE POLICY content_sources_service_role ON content_sources FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY sync_logs_service_role ON content_sync_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY industry_moves_cache_service_role ON industry_moves_cache FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY content_classifications_service_role ON content_classifications FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT SELECT ON content_sources TO anon, authenticated;
GRANT SELECT ON content_sync_logs TO authenticated;
GRANT SELECT ON industry_moves_cache TO anon, authenticated;
GRANT SELECT ON content_classifications TO anon, authenticated;

GRANT ALL ON content_sources TO service_role;
GRANT ALL ON content_sync_logs TO service_role;
GRANT ALL ON industry_moves_cache TO service_role;
GRANT ALL ON content_classifications TO service_role;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_cache() TO service_role;
GRANT EXECUTE ON FUNCTION get_active_content_sources() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION log_content_sync(VARCHAR, VARCHAR, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, BOOLEAN, JSONB, JSONB) TO service_role;

-- Comments for documentation
COMMENT ON TABLE content_sources IS 'Configuration for RSS feeds and content sources';
COMMENT ON TABLE content_sync_logs IS 'Logs of content synchronization operations';
COMMENT ON TABLE industry_moves_cache IS 'Cached and categorized content for industry moves display';
COMMENT ON TABLE content_classifications IS 'AI-powered content classification and relevance scoring';

COMMENT ON FUNCTION cleanup_expired_cache() IS 'Removes expired entries from industry_moves_cache';
COMMENT ON FUNCTION get_active_content_sources() IS 'Returns active content sources ordered by priority';
COMMENT ON FUNCTION log_content_sync(VARCHAR, VARCHAR, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER, BOOLEAN, JSONB, JSONB) IS 'Logs the results of a content sync operation';

-- Final success message
DO $$
BEGIN
  RAISE NOTICE 'Content automation schema created successfully!';
  RAISE NOTICE 'Tables: content_sources, content_sync_logs, industry_moves_cache, content_classifications';
  RAISE NOTICE 'Functions: cleanup_expired_cache, get_active_content_sources, log_content_sync';
  RAISE NOTICE 'Default content sources inserted. Ready for automation!';
END $$;