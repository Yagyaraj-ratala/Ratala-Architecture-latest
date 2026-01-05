-- Create the sign_in table for admin authentication
CREATE TABLE IF NOT EXISTS public."sign_in" (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_sign_in_email ON public."sign_in"(email);
CREATE INDEX IF NOT EXISTS idx_sign_in_username ON public."sign_in"(username);

-- Note: Admin user should be inserted manually or using the create-admin.js script
-- The script is located at: frontend/scripts/create-admin.js

-- Add comment to table
COMMENT ON TABLE public."sign_in" IS 'Admin authentication table for Ratala Architecture';

