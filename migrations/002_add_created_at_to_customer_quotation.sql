-- Add submitted/created timestamp to CUSTOMER_QUOTATION
ALTER TABLE public."CUSTOMER_QUOTATION"
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- For existing rows that may have null created_at, set to current timestamp
UPDATE public."CUSTOMER_QUOTATION" SET created_at = now() WHERE created_at IS NULL;
