-- Add these columns to your existing ph_posts table
ALTER TABLE ph_posts ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE ph_posts ADD COLUMN IF NOT EXISTS makers TEXT;
ALTER TABLE ph_posts ADD COLUMN IF NOT EXISTS media_urls TEXT;

-- Run this query to get enhanced data
SELECT 
  ph_id, name, tagline, description, slug, website_url, 
  votes, comments, thumbnail_url, posted_at, 
  makers, media_urls, categories, category_slugs
FROM ph_posts 
ORDER BY posted_at DESC;
