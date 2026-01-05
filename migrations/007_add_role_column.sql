-- Add role column to sign_in table
ALTER TABLE public."sign_in" 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Update existing records to have 'user' role if null (just in case, though default handles new ones)
UPDATE public."sign_in" SET role = 'user' WHERE role IS NULL;

-- Set admin role correctly for likely admin users (optional, but good practice)
UPDATE public."sign_in" SET role = 'admin' WHERE username = 'admin';
