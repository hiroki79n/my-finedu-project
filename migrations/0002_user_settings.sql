-- User settings table for customizable update intervals
CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  market_update_interval INTEGER DEFAULT 30000, -- ミリ秒単位（デフォルト30秒）
  auto_update_enabled BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id)
);

-- Insert default settings for existing demo user
INSERT OR IGNORE INTO user_settings (user_id, market_update_interval, auto_update_enabled) VALUES 
  (1, 30000, 1);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
