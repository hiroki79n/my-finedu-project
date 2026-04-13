-- Add table to track wrong answers for re-quiz functionality

CREATE TABLE IF NOT EXISTS wrong_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  quiz_id INTEGER NOT NULL,
  chapter_id INTEGER NOT NULL,
  wrong_count INTEGER DEFAULT 1,
  last_wrong_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, quiz_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_wrong_answers_user_chapter ON wrong_answers(user_id, chapter_id, resolved);
CREATE INDEX IF NOT EXISTS idx_wrong_answers_user_quiz ON wrong_answers(user_id, quiz_id);
