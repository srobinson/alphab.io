-- Performance optimization for articles pagination
-- This migration adds critical indexes for fast pagination queries

-- Drop old indexes that will be replaced by better composite indexes
DROP INDEX IF EXISTS idx_articles_published_at;
DROP INDEX IF EXISTS idx_articles_source_published;

-- Create optimal composite index for the pagination query
-- Query: WHERE status = 'published' ORDER BY published_at DESC
CREATE INDEX idx_articles_status_published_at 
ON articles (status, published_at DESC NULLS LAST)
WHERE status = 'published';

-- Partial index for just published articles (even faster!)
CREATE INDEX idx_articles_published_only 
ON articles (published_at DESC NULLS LAST)
WHERE status = 'published';

-- Index for URL lookups (used during ingestion)
CREATE INDEX IF NOT EXISTS idx_articles_url ON articles (url);

-- Index for status (general queries)
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status);

-- Index for created_at (alternative ordering)
CREATE INDEX IF NOT EXISTS idx_articles_created_at 
ON articles (created_at DESC)
WHERE status = 'published';

-- Composite index for source + status filtering
CREATE INDEX IF NOT EXISTS idx_articles_source_status_published
ON articles (source, status, published_at DESC NULLS LAST)
WHERE status = 'published';

-- ANALYZE to update query planner statistics
ANALYZE articles;

-- Verify indexes
DO $$
DECLARE
  idx_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes 
  WHERE tablename = 'articles';
  
  RAISE NOTICE 'Created % indexes on articles table', idx_count;
  RAISE NOTICE 'Run EXPLAIN ANALYZE on your queries to verify performance improvement';
END $$;
