-- Add media fields to projects table (storing arrays as JSONB)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS drawing_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS project_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS project_videos JSONB DEFAULT '[]'::jsonb;

