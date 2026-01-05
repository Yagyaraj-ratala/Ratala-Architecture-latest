-- Add area fields to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS plot_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS plinth_area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS build_up_area DECIMAL(10, 2);

