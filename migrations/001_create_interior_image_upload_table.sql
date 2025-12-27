-- Create the interior_image_upload table
CREATE TABLE IF NOT EXISTS interior_image_upload (
    id BIGSERIAL PRIMARY KEY,
    image_description TEXT,
    image_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_interior_image_upload_created_at ON interior_image_upload(created_at);
