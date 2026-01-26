-- Add type column to market_data table for categorization
ALTER TABLE market_data ADD COLUMN type TEXT DEFAULT 'stock';

-- Update existing stocks to have proper type
UPDATE market_data SET type = 'stock' WHERE type IS NULL OR type = 'stock';
