ALTER TABLE categories DROP COLUMN IF EXISTS parent_id;
ALTER TABLE comments DROP COLUMN IF EXISTS parent_id;
DROP INDEX IF EXISTS idx_comments_parent_id;
