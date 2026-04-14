# クエスト拡張と間違い問題再出題機能 - 実装完了

## ✅ 完了した機能

### 1. 各チャプターを20問に拡張
- **Chapter 0**: 3問（ビデオクエスト1問 + クイズ2問）
- **Chapter 1-10**: 各20問（合計200問）
- **総クエスト数**: 203問

### 2. 間違えた問題を再出題する仕組み
#### データベース
- `wrong_answers` テーブル作成（user_id, quiz_id, chapter_id, retry_count, last_attempt）

#### バックエンド (src/index.tsx)
1. **クイズ回答API (`/api/quiz/:quizId/answer`)**:
   - 不正解時: `wrong_answers` テーブルに記録（既存の場合は retry_count を +1）
   - 正解時: `wrong_answers` テーブルから削除

2. **クイズ取得API (`/api/quiz`)**:
   - `userId` と `chapterId` をクエリパラメータとして受け取る
   - 間違えた問題を `wrong_answers` から取得
   - 間違えた問題を優先的にソート（retry_count が多い順）
   - `is_wrong` フラグと `retry_count` を含めて返す

#### フロントエンド (public/static/app.js)
1. **QuizScreen コンポーネント**:
   - `fetchQuizzes` で `userId` と `chapterId` をクエリパラメータとして送信
   - 間違えた問題が優先的に出題される

## 📊 クイズデータ詳細

### Chapter 1: お金と経済の概念 (20問)
- インフレと預金、実質賃金、円安と物価、複利効果、72の法則、現金のリスク
- 長期投資、現在価値、低金利時代、投資の3要素、時間価値、デフレの影響
- 金利と債券、GDP、景気循環、為替レート、CPI、名目と実質、機会費用、リスクとリターン

### Chapter 2: 給与明細・税・社会保険 (20問)
- 給与天引き、住民税、所得税制度、健康保険、厚生年金、雇用保険
- 扶養控除、配偶者控除、基礎控除、医療費控除、ふるさと納税、源泉徴収
- 年末調整、確定申告、社会保険料、介護保険、賞与、所得の種類、退職金、iDeCo

### Chapter 3: キャッシュフロー設計 (20問)
- キャッシュフロー設計、生活防衛資金、固定費削減、変動費管理、家計簿
- クレジットカード、先取り貯金、貯蓄比率、予算管理、無駄な支出
- ボーナス、緊急時資金、住宅ローン、自動車維持費、教育費、保険見直し
- 通信費、サブスク、外食費、ポイント活用

### Chapter 4-10 (各20問)
- テンプレートデータで各チャプター20問を用意（本番環境では詳細な問題に差し替え予定）

## 🔄 間違い問題再出題の流れ

1. **ユーザーがクイズに不正解**
   → `wrong_answers` テーブルに記録（retry_count = 1）

2. **同じ問題に再度不正解**
   → `retry_count` をインクリメント（2, 3, ...）

3. **クイズ取得時**
   → `wrong_answers` から該当チャプターの間違えた問題を取得
   → `retry_count` が多い順にソート
   → 通常の問題よりも優先的に表示

4. **正解した場合**
   → `wrong_answers` テーブルから削除

## 🧪 テスト結果

### API動作確認
```bash
# Chapter 1のクイズ取得（20問確認）
curl http://localhost:3000/api/quiz?chapterId=1
→ ✅ 20問のクイズが正しく返される

# 各チャプターのクイズ数確認
Chapter 0: 3問
Chapter 1-10: 各20問
→ ✅ 合計203問
```

### 間違い問題再出題テスト
1. ユーザーがChapter 1のクイズに不正解
2. `wrong_answers` テーブルに記録を確認
3. 再度Chapter 1のクイズを取得
4. 間違えた問題が先頭に表示されることを確認
→ ✅ 正常動作

## 📂 追加ファイル

### マイグレーション
- `migrations/0008_add_wrong_answers_table.sql`

### シードデータ
- `seed_chapters_1-3.sql` (Chapter 1-3の詳細なクイズデータ)
- `seed_quick_chapters_4-10.sql` (Chapter 4-10のテンプレートデータ生成SQL)

## 🚀 デプロイ

### ローカル開発環境
```bash
# データベースマイグレーション
npx wrangler d1 execute ecomate-production --local --file=./migrations/0008_add_wrong_answers_table.sql

# クイズデータ投入
npx wrangler d1 execute ecomate-production --local --file=./seed_chapters_1-3.sql

# ビルド
npm run build

# 起動
pm2 restart ecomate
```

### デモURL
https://3000-ia2yj8h4ykytgt2jhh0x0-02b9cc79.sandbox.novita.ai

### GitHub
リポジトリ: https://github.com/hiroki79n/my-finedu-project
最新コミット: faf1d97 "Implement 20 questions per chapter and wrong answer retry system"

## 🎯 今後の拡張提案

1. **より詳細なクイズ内容**: Chapter 4-10のテンプレートデータを実際の金融教育コンテンツに置き換え
2. **復習アラート**: 一定期間が経過した間違い問題を再度出題
3. **統計機能**: ユーザーごとの正解率、苦手分野の可視化
4. **レベル調整**: ユーザーの理解度に応じてクイズの難易度を調整

