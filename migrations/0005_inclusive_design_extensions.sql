-- Migration 0005: Inclusive Design Extensions
-- ============================================
-- Purpose: Add support for dual themes, user sanctuary (My City), and X-News events

-- 1. Add theme preference to users table
ALTER TABLE users ADD COLUMN theme_preference TEXT DEFAULT 'cyber' CHECK(theme_preference IN ('cyber', 'pop'));

-- 2. Create user_items table for "My City" sanctuary feature
CREATE TABLE IF NOT EXISTS user_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK(item_type IN ('building', 'decoration', 'special')),
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create city_items catalog table
CREATE TABLE IF NOT EXISTS city_items_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL CHECK(item_type IN ('building', 'decoration', 'special')),
  icon TEXT NOT NULL,
  unlock_condition TEXT, -- JSON: {"type": "profit", "amount": 10000} or {"type": "level", "value": 5}
  rarity TEXT DEFAULT 'common' CHECK(rarity IN ('common', 'rare', 'epic', 'legendary'))
);

-- 4. Create news_events table for X-News feature
CREATE TABLE IF NOT EXISTS news_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('economy', 'weather', 'tech', 'politics', 'global')),
  impact_sector TEXT, -- Affected market sector (e.g., 'agriculture', 'tech', 'automotive')
  impact_type TEXT CHECK(impact_type IN ('positive', 'negative', 'neutral')),
  volatility_multiplier REAL DEFAULT 1.0, -- Multiplier for affected sector (e.g., 1.5 = 50% more volatility)
  event_date DATE NOT NULL,
  expires_at DATETIME,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create user_news_interactions table to track user responses
CREATE TABLE IF NOT EXISTS user_news_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  news_event_id INTEGER NOT NULL,
  action_taken TEXT CHECK(action_taken IN ('wait', 'trade', 'dismissed')),
  interacted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (news_event_id) REFERENCES news_events(id) ON DELETE CASCADE,
  UNIQUE(user_id, news_event_id)
);

-- 6. Create quest_types table for hybrid quest system
CREATE TABLE IF NOT EXISTS quest_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quest_id INTEGER NOT NULL,
  quest_type TEXT NOT NULL CHECK(quest_type IN ('main', 'sub')),
  is_parallel INTEGER DEFAULT 0, -- 1 = accessible anytime, 0 = requires unlock
  FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Insert default city items catalog
INSERT OR IGNORE INTO city_items_catalog (id, name, description, item_type, icon, unlock_condition, rarity) VALUES
  ('cafe_001', 'カフェ', '初めての収益で建てるカフェ', 'building', '☕', '{"type":"profit","amount":1000}', 'common'),
  ('park_001', '公園', '緑豊かな憩いの場', 'building', '🌳', '{"type":"profit","amount":5000}', 'common'),
  ('tower_001', 'タワー', '街のシンボルタワー', 'building', '🗼', '{"type":"profit","amount":10000}', 'rare'),
  ('fountain_001', '噴水', 'きらめく噴水広場', 'decoration', '⛲', '{"type":"level","value":5}', 'common'),
  ('ferris_001', '観覧車', '夢を見る大観覧車', 'building', '🎡', '{"type":"profit","amount":50000}', 'epic'),
  ('castle_001', '城', '最終目標の大城', 'building', '🏰', '{"type":"profit","amount":100000}', 'legendary');

-- Insert sample news events (these will be updated via API in production)
INSERT OR IGNORE INTO news_events (title, content, category, impact_sector, impact_type, volatility_multiplier, event_date) VALUES
  ('台風接近！野菜の価格が高騰予想', '大型台風が接近中。農作物の収穫に影響が出る可能性があります。食品関連の株価に注目！', 'weather', 'agriculture', 'negative', 1.5, date('now')),
  ('新型スマホ発表！テック株が急騰', '人気メーカーが革新的な新製品を発表。テクノロジーセクターに追い風が吹いています。', 'tech', 'tech', 'positive', 1.3, date('now')),
  ('円安進行中、輸出企業に恩恵', '為替市場で円安が進行。自動車メーカーなど輸出企業の業績改善が期待されます。', 'economy', 'automotive', 'positive', 1.2, date('now'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_items_user_id ON user_items(user_id);
CREATE INDEX IF NOT EXISTS idx_news_events_active ON news_events(is_active, event_date);
CREATE INDEX IF NOT EXISTS idx_user_news_interactions_user_id ON user_news_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_quest_types_quest_id ON quest_types(quest_id);
