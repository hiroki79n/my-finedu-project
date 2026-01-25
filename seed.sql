-- Insert market data for Japanese companies (仮想市場データ)
-- 実在企業名を使用、ロゴは使わずLucide Reactアイコンで表現
INSERT OR IGNORE INTO market_data (symbol, company_name, current_price, sector, price_history, volatility) VALUES 
  ('7974', '任天堂', 7850.0, 'ゲーム・エンタメ', '[]', 0.025),
  ('7203', 'トヨタ自動車', 2680.0, '自動車', '[]', 0.02),
  ('9983', 'ファーストリテイリング', 38500.0, 'アパレル', '[]', 0.03),
  ('4704', 'トレンドマイクロ', 7200.0, 'IT・セキュリティ', '[]', 0.028),
  ('4689', 'LINEヤフー', 4850.0, 'IT・通信', '[]', 0.022),
  ('4755', '楽天グループ', 885.0, 'EC・フィンテック', '[]', 0.035),
  ('6758', 'ソニーグループ', 13200.0, '電機・エンタメ', '[]', 0.024),
  ('9984', 'ソフトバンクグループ', 5980.0, '通信・投資', '[]', 0.032),
  ('4502', '武田薬品工業', 4250.0, '医薬品', '[]', 0.018),
  ('2914', '日本たばこ産業', 3890.0, '食品・飲料', '[]', 0.015),
  ('4568', '第一三共', 5120.0, '医薬品', '[]', 0.02),
  ('6098', 'リクルートホールディングス', 9250.0, '人材サービス', '[]', 0.026);

-- Insert demo user (username: demo, password: demo123)
-- Password hash for 'demo123' using bcryptjs
INSERT OR IGNORE INTO users (id, username, password_hash, xp, level, streak_count, last_login_date) VALUES 
  (1, 'demo', '$2b$10$15uaNtS3QYURNQjhnlOpCe.eVhuVeA9j1Y3ygGXOZAOV6unrZdUZ6', 500, 3, 5, date('now'));

-- Insert demo user assets
INSERT OR IGNORE INTO assets (user_id, cash_balance, total_portfolio_value) VALUES 
  (1, 750000.0, 1250000.0);

-- Insert demo user holdings (日本株を保有)
INSERT OR IGNORE INTO holdings (user_id, stock_symbol, quantity, average_price) VALUES 
  (1, '7974', 10, 7500.00),
  (1, '7203', 50, 2600.00),
  (1, '9983', 2, 37000.00);
