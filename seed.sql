-- Insert market data for demo stocks
INSERT OR IGNORE INTO market_data (symbol, company_name, current_price, sector, price_history, volatility) VALUES 
  ('AAPL', 'Apple Inc.', 175.50, 'Technology', '[]', 0.02),
  ('GOOGL', 'Alphabet Inc.', 142.30, 'Technology', '[]', 0.025),
  ('TSLA', 'Tesla Inc.', 238.80, 'Automotive', '[]', 0.04),
  ('MSFT', 'Microsoft Corporation', 378.90, 'Technology', '[]', 0.018),
  ('AMZN', 'Amazon.com Inc.', 155.20, 'E-commerce', '[]', 0.022),
  ('NVDA', 'NVIDIA Corporation', 495.60, 'Technology', '[]', 0.035),
  ('META', 'Meta Platforms Inc.', 368.40, 'Social Media', '[]', 0.028),
  ('NFLX', 'Netflix Inc.', 445.20, 'Entertainment', '[]', 0.03),
  ('DIS', 'Walt Disney Company', 92.80, 'Entertainment', '[]', 0.025),
  ('KO', 'Coca-Cola Company', 61.50, 'Beverages', '[]', 0.015);

-- Insert demo user (username: demo, password: demo123)
-- Password hash for 'demo123' using bcryptjs
INSERT OR IGNORE INTO users (id, username, password_hash, xp, level, streak_count, last_login_date) VALUES 
  (1, 'demo', '$2b$10$15uaNtS3QYURNQjhnlOpCe.eVhuVeA9j1Y3ygGXOZAOV6unrZdUZ6', 500, 3, 5, date('now'));

-- Insert demo user assets
INSERT OR IGNORE INTO assets (user_id, cash_balance, total_portfolio_value) VALUES 
  (1, 850000.0, 1150000.0);

-- Insert demo user holdings
INSERT OR IGNORE INTO holdings (user_id, stock_symbol, quantity, average_price) VALUES 
  (1, 'AAPL', 10, 170.00),
  (1, 'GOOGL', 5, 140.00),
  (1, 'TSLA', 3, 230.00);
