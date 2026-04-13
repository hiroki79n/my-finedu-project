-- Quick seed for chapters 4-10 (simplified test data)
DELETE FROM quizzes WHERE id >= 401 AND id <= 1020;

-- Generate 20 quizzes for each chapter (401-420, 501-520, ..., 1001-1020)
-- Using simple template data for testing
INSERT INTO quizzes (id, chapter_id, title, question, options, correct_answer, explanation, reward, xp)
SELECT 
  400 + (chapter * 100) + quest_num AS id,
  chapter AS chapter_id,
  'レッスン ' || quest_num AS title,
  'Chapter ' || chapter || ' Question ' || quest_num AS question,
  '["選択肢A", "選択肢B", "選択肢C", "選択肢D"]' AS options,
  (quest_num % 4) AS correct_answer,
  'Chapter ' || chapter || 'の学習内容です。' AS explanation,
  (chapter * 100 + 200) AS reward,
  (chapter * 10 + 20) AS xp
FROM 
  (SELECT 4 AS chapter UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) chapters,
  (SELECT 1 AS quest_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
   UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
   UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
   UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20) quests;
