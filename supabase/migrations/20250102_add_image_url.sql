-- Add image_url column to articles table for caching Unsplash images
-- This prevents making Unsplash API calls on every request

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_articles_image_url ON articles(image_url) WHERE image_url IS NOT NULL;

-- Comment
COMMENT ON COLUMN articles.image_url IS 'Cached thumbnail image URL from Unsplash or other sources';
