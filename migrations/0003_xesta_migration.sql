-- XESTA Migration: Add chapter progress and extend market data

-- Add chapter_progress to users table
ALTER TABLE users ADD COLUMN chapter_progress INTEGER DEFAULT 1;

-- Create commodities table for gold/silver
CREATE TABLE IF NOT EXISTS commodities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  current_price REAL NOT NULL,
  price_history TEXT DEFAULT '[]',
  volatility REAL DEFAULT 0.01,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create etf_packs table for X-Packs
CREATE TABLE IF NOT EXISTS etf_packs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  current_price REAL NOT NULL,
  price_history TEXT DEFAULT '[]',
  volatility REAL DEFAULT 0.02,
  theme TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add type column to market_data
ALTER TABLE market_data ADD COLUMN type TEXT DEFAULT 'STOCK';

-- Update existing data to have type
UPDATE market_data SET type = 'STOCK' WHERE type IS NULL;

-- Insert initial commodities data
INSERT OR IGNORE INTO commodities (symbol, name, current_price, volatility) VALUES
  ('GOLD', '金（ゴールド）', 8500.0, 0.008),
  ('SILVER', '銀（シルバー）', 950.0, 0.012);

-- Insert initial ETF packs data
INSERT OR IGNORE INTO etf_packs (symbol, name, description, current_price, volatility, theme) VALUES
  ('AI-PACK', 'AI最強パック', 'AI・テクノロジー企業の詰め合わせ', 15000.0, 0.035, 'technology'),
  ('GREEN-PACK', '農業パック', '食品・農業関連企業の詰め合わせ', 12000.0, 0.025, 'agriculture'),
  ('GAME-PACK', 'ゲーム最強パック', 'ゲーム・エンタメ企業の詰め合わせ', 18000.0, 0.040, 'entertainment');

-- Add quests table for chapter-based missions
CREATE TABLE IF NOT EXISTS quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reward_cash REAL NOT NULL,
  reward_xp INTEGER NOT NULL,
  is_cleared INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert chapter quests
INSERT OR IGNORE INTO quests (chapter, title, description, reward_cash, reward_xp) VALUES
  -- Chapter 1: はじまりの村
  (1, '株式って何？', '株式投資の基本を学ぼう', 500, 50),
  (1, '株価の見方', 'チャートの読み方を理解する', 600, 60),
  (1, '初めての取引', '実際に株を買ってみよう', 800, 80),
  
  -- Chapter 2: 変動の森
  (2, '価格変動の仕組み', '需要と供給を学ぶ', 1000, 100),
  (2, 'リスクとリターン', 'リスク管理の基礎', 1200, 120),
  (2, '分散投資入門', '卵を一つのカゴに盛るな', 1500, 150),
  
  -- Chapter 3: 市場の城
  (3, 'ファンダメンタル分析', '企業の価値を見極める', 2000, 200),
  (3, 'テクニカル分析', 'チャートパターンを読む', 2500, 250),
  (3, 'ETFの活用', 'パック投資の魅力', 3000, 300),
  
  -- Chapter 4: 経済の大陸
  (4, 'マクロ経済入門', '景気と株価の関係', 4000, 400),
  (4, '金融政策を知る', '金利と投資', 5000, 500),
  (4, 'グローバル投資', '世界に目を向ける', 6000, 600),
  
  -- Chapter 5: 投資家の頂
  (5, 'ポートフォリオ最適化', '資産配分の極意', 8000, 800),
  (5, '長期投資戦略', '複利の力を活かす', 10000, 1000),
  (5, '伝説の投資家', '最終試験', 15000, 1500);
