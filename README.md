# 🎯 XESTA - 金融教育Webアプリ

**Invest in the Unknown - 未知なる投資の冒険へ**

金融教育をゲーム化した没入型学習アプリケーション。Cloudflare Pages + Hono + Framer Motionで構築された次世代型教育プラットフォーム。

## 🌐 デモURL

**開発環境**: https://3000-ia2yj8h4ykytgt2jhh0x0-02b9cc79.sandbox.novita.ai

### デモアカウント
- **ユーザー名**: `demo` または任意のユーザー名で新規登録
- **パスワード**: `demo123`
- **初期資金**: 新規登録時に100万円を自動付与

### 🐛 デバッグモード有効

現在、詳細なコンソールログが有効になっています。
ブラウザのコンソール（F12キー）を開いて、以下のログを確認できます：

- クエスト開始処理のログ
- 画面遷移のログ
- クイズデータ取得のログ

詳細なデバッグ手順は `DEBUG_QUEST_QUIZ.md` を参照してください。

---

## ✅ 実装済み画面一覧

### 1. **AuthScreen（認証画面）** ✅
- **URL**: ルートアクセス時
- **機能**:
  - ユーザー登録（新規100万円付与）
  - ログイン機能
  - パスワードハッシュ化（bcrypt）
  - バリデーション機能
- **状態**: **完全動作**

### 2. **HomeScreen（ホーム画面）** ✅
- **ナビゲーション**: ログイン後の初期画面
- **機能**:
  - ユーザー情報表示（名前、レベル、XP、ストリーク）
  - 総資産表示（現金 + 株式評価額）
  - クイックアクセスボタン（マーケット、クエスト、ポートフォリオ）
  - ニュースカード（4件の市場ニュース）
  - 下部ナビゲーション（ホーム、マーケット、クエスト、設定）
- **状態**: **完全動作**

### 3. **MapScreen（クエストマップ画面）** ✅
- **ナビゲーション**: ホーム画面から「Quest Forest」ボタン、または下部ナビ
- **機能**:
  - **メインクエスト（Chapter 1-5）**:
    - Chapter 1: 価値の誕生と交換（Origin）- 各10問のクイズ
    - Chapter 2: 労働と社会の歯車（Society）- 各10問のクイズ
    - Chapter 3: 企業の森と株式会社（Enterprise）- 各10問のクイズ
    - Chapter 4: 世界市場とリスク（Global Market）- 各10問のクイズ
    - Chapter 5: 未来への投資（Future X）- 各10問のクイズ
  - **サブクエスト（並列エリア）**:
    - 仮想通貨の洞窟（5問）
    - 歴史の図書館（5問）
    - 税金の役所（5問）
  - **クエスト詳細**:
    - 各クエストをクリックで詳細モーダル表示
    - タイトル、説明、報酬、XPを表示
    - 「クエスト開始」ボタンでクイズ画面へ遷移
  - **テスト用ロック解除**: 全クエストがクリック可能（テスト用設定）
- **状態**: **完全動作**

### 4. **QuizScreen（クイズ画面）** ✅
- **ナビゲーション**: MapScreenからクエスト選択後
- **機能**:
  - **Chapter別クイズ表示**: 選択したChapterのクイズのみ表示（10問）
  - **クイズタイトル表示**: 例: "物々交換の限界"
  - **4択問題形式**: ラジオボタンで選択
  - **回答送信**: 選択後に「回答する」ボタン
  - **結果表示**:
    - 正解: 🎉 + 解説 + 獲得XP/報酬
    - 不正解: 😢 + 解説
  - **次のクイズへ**: 同じChapter内の次のクイズへ自動遷移
  - **完了後**: 最後のクイズ完了後は「マップに戻る」ボタン
- **データベース統合**: クイズデータはD1データベースから取得
- **状態**: **完全動作**

### 5. **MarketScreen（市場画面）** ✅
- **ナビゲーション**: ホーム画面「Market」ボタン、または下部ナビ
- **機能**:
  - **3つのタブ**:
    - 🏢 **Stocks**: 日本企業12銘柄（任天堂、トヨタなど）
    - ⚡ **Commodities**: 商品5種類（金、銀、原油など）
    - 📦 **ETF Packs**: 投資パック5種類（AI-PACK、GREEN-PACKなど）
  - **株式情報**:
    - リアルタイム価格表示
    - 価格変動率（前日比）
    - 企業名、銘柄コード、業種
  - **ETFパック詳細**:
    - 構成銘柄表示（例: AI-PACK → ソフトバンクG、LINEヤフー、トレンドマイクロ）
    - テーマ説明（AI・機械学習・クラウドサービス）
    - 特徴（高リスク高リターン など）
  - **取引モーダル**:
    - 購入数量入力（上下ボタン、または直接入力）
    - 合計金額リアルタイム計算
    - 長押し購入機能（誤操作防止）
    - 購入成功時の紙吹雪エフェクト
  - **サポートモード**: 購入時のヘルプ表示
- **状態**: **完全動作**

### 6. **PortfolioScreen（ポートフォリオ画面）** ✅
- **ナビゲーション**: ホーム画面「Portfolio」ボタン、または設定画面から
- **機能**:
  - 保有銘柄一覧表示
  - 各銘柄の詳細:
    - 銘柄コード、名前、アイコン
    - 保有数量
    - 平均取得価格
    - 現在価格
    - 評価損益（金額 + パーセント）
    - 評価額合計
  - 色分け表示:
    - 利益: 緑色
    - 損失: 赤色
  - 売却機能:
    - 各銘柄に「売却」ボタン
    - 売却数量を選択
    - 売却成功時に資産更新
- **状態**: **完全動作**

### 7. **NewsScreen（ニュース画面）** ✅
- **ナビゲーション**: ホーム画面のニュースカード、または下部ナビ（ホーム経由）
- **機能**:
  - **市場ニュース16件を表示**:
    - 経済（3件）
    - テクノロジー（3件）
    - 製薬（2件）
    - 小売（2件）
    - コモディティ（2件）
    - 金融（2件）
    - エネルギー（2件）
  - **カテゴリータブフィルタリング**:
    - 全て、経済、テクノロジー、製薬、小売、コモディティ、金融、エネルギー
  - **各ニュースカードの詳細**:
    - カテゴリーアイコン
    - タイトル
    - 詳細説明
    - 影響度バッジ（📈 上昇期待 / 📉 下落懸念 / ➡️ 中立）
    - 関連銘柄タグ
  - **🆕 AIチャット機能「フィンに聞く」**:
    - 各ニュースカードに「フィンに聞く」ボタン
    - ニュース内容に応じたAI分析を表示
    - ユーザーからの質問に対応した回答生成
    - クイックアクションボタン（影響を知る、銘柄情報、タイミング）
    - 質問内容に応じた適切な回答:
      - 「なぜ」「理由」 → 背景説明
      - 「いつ」「タイミング」 → 慎重な判断アドバイス
      - 「買」「売」 → 自己判断の重要性強調
      - 「影響」「どう」 → セクター全体への影響説明
  - **カテゴリー別色分け**:
    - 経済: 緑/エメラルド系
    - テクノロジー: 青/紫系
    - 製薬: 紫/ピンク系
    - 小売: 赤/オレンジ系
    - コモディティ: 黄/琥珀系
    - 金融: 青/藍系
    - エネルギー: 緑/ティール系
- **状態**: **完全動作**

### 8. **SettingsScreen（設定画面）** ✅
- **ナビゲーション**: 下部ナビの「設定」アイコン
- **機能**:
  - **マーケット更新設定**:
    - 自動更新のオン/オフ
    - 更新間隔（10秒〜120秒）
    - スライダーで調整
  - **ナビゲーションボタン**:
    - ポートフォリオへ
    - 取引履歴へ
  - **アプリ情報**:
    - アプリ概要
    - 機能説明
    - 利用ガイド
- **状態**: **完全動作**

### 9. **HistoryScreen（履歴画面）** ✅
- **ナビゲーション**: 設定画面から「履歴」ボタン
- **機能**:
  - 過去の取引履歴表示（最新50件）
  - 各取引の詳細:
    - 取引日時
    - 取引種別（買い/売り）
    - 銘柄情報（コード、名前、アイコン）
    - 数量
    - 単価
    - 合計金額
  - 色分け表示:
    - 買い: 緑色背景
    - 売り: 赤色背景
  - 取引がない場合の空状態表示
- **状態**: **完全動作**

---

## 🦊 Finnナビゲーターキャラクター ✅

### 機能
- **グローバルオーバーレイ**: 全画面で常駐表示（z-index: 9999）
- **ドラッグ可能**: 任意の位置に移動可能
- **四隅スナップ**: ドラッグ終了時に最も近い隅に自動吸着
- **画面別キャラクター**:
  - **ノーマル版** (`finn-normal.png`): Home, Map, Quiz画面
  - **チャート版** (`finn-chart.png`): Market, Portfolio, News画面
- **🆕 AIチャット機能**:
  - **ニュースAI解説**: 各ニュースの内容をFinnが分析・解説
  - **質問対応**: ユーザーの質問に対して適切なアドバイス提供
  - **クイックアクション**: よくある質問を1クリックで入力
  - **コンテキスト理解**: ニュース内容に基づいた適切な回答生成
  - **インタラクティブUI**:
    - ユーザーメッセージ（右側・青背景）
    - Finnメッセージ（左側・灰背景）
    - 入力中インジケーター
    - Enterキー送信対応
- **リアクションアニメーション**:
  - **通常時**: 浮遊アニメーション（上下10px）+ 揺れ（±2度）
  - **ドラッグ中**: 激しい揺れ（±8度）+ 振動
  - **画面遷移時**: ジャンプ（30px）+ 回転（±10度）+ 拡大（1.2倍）
  - **ホバー時**: 拡大（1.15倍）+ 上昇（5px）
  - **タップ時**: 縮小（0.9倍）
- **メッセージ吹き出し**:
  - 画面別メッセージ表示（5秒間）
  - ドラッグ中は非表示
- **視覚エフェクト**:
  - 動的な影
  - アクティブインジケーター（緑の脈打つ点）
  - ヒントテキスト「ドラッグして移動 🖱️」
- **状態**: **完全動作**

---

## 🗄️ データベース構造

### テーブル一覧（Cloudflare D1）

#### 1. **users** - ユーザー情報
- `id` (INTEGER): ユーザーID
- `username` (TEXT): ユーザー名
- `password_hash` (TEXT): ハッシュ化パスワード
- `xp` (INTEGER): 経験値
- `level` (INTEGER): レベル
- `streak` (INTEGER): 連続ログイン日数
- `created_at` (DATETIME): 作成日時

#### 2. **assets** - 資産情報
- `user_id` (INTEGER): ユーザーID
- `cash_balance` (REAL): 現金残高
- `portfolio_value` (REAL): ポートフォリオ評価額
- `updated_at` (DATETIME): 更新日時

#### 3. **holdings** - 保有銘柄
- `id` (INTEGER): 保有ID
- `user_id` (INTEGER): ユーザーID
- `symbol` (TEXT): 銘柄コード
- `quantity` (INTEGER): 数量
- `average_price` (REAL): 平均取得価格
- `purchase_date` (DATETIME): 購入日

#### 4. **market_data** - 市場データ
- `symbol` (TEXT): 銘柄コード
- `name` (TEXT): 銘柄名
- `type` (TEXT): タイプ（STOCK/COMMODITY/ETF）
- `current_price` (REAL): 現在価格
- `previous_close` (REAL): 前日終値
- `updated_at` (DATETIME): 更新日時

#### 5. **quiz_results** - クイズ結果
- `id` (INTEGER): 結果ID
- `user_id` (INTEGER): ユーザーID
- `quiz_id` (INTEGER): クイズID
- `correct` (BOOLEAN): 正誤
- `xp_earned` (INTEGER): 獲得XP
- `completed_at` (DATETIME): 完了日時

#### 6. **transactions** - 取引履歴
- `id` (INTEGER): 取引ID
- `user_id` (INTEGER): ユーザーID
- `symbol` (TEXT): 銘柄コード
- `type` (TEXT): 取引種別（BUY/SELL）
- `quantity` (INTEGER): 数量
- `price` (REAL): 単価
- `total_amount` (REAL): 合計金額
- `timestamp` (DATETIME): 取引日時

#### 7. **user_settings** - ユーザー設定
- `user_id` (INTEGER): ユーザーID
- `market_update_interval` (INTEGER): 市場更新間隔（秒）
- `auto_update_enabled` (BOOLEAN): 自動更新フラグ

#### 8. **quizzes** - クイズデータ
- `id` (INTEGER): クイズID
- `chapter_id` (INTEGER): チャプターID（1-8）
- `title` (TEXT): クイズタイトル
- `question` (TEXT): 質問文
- `options` (TEXT): 選択肢（JSON配列）
- `correct_answer` (INTEGER): 正解インデックス
- `explanation` (TEXT): 解説
- `reward` (INTEGER): 報酬金額
- `xp` (INTEGER): 獲得XP
- `type` (TEXT): タイプ（quiz）

#### 9. **commodities** - 商品情報
- `symbol` (TEXT): 商品コード
- `name` (TEXT): 商品名
- `unit` (TEXT): 単位
- `icon` (TEXT): アイコン

#### 10. **etf_packs** - ETFパック情報
- `id` (TEXT): パックID
- `name` (TEXT): パック名
- `description` (TEXT): 説明
- `stocks` (TEXT): 構成銘柄（JSON配列）
- `theme` (TEXT): テーマ
- `features` (TEXT): 特徴

---

## 🎨 技術スタック

### フロントエンド
- **React 18**: UIライブラリ（CDN版）
- **Framer Motion 11**: アニメーションライブラリ
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク
- **Babel Standalone**: JSXのブラウザ内トランスパイル

### バックエンド
- **Hono 4.0**: 軽量Webフレームワーク
- **Cloudflare Workers**: エッジランタイム
- **TypeScript 5.0**: 型安全な開発

### データベース
- **Cloudflare D1**: グローバル分散SQLite
- **Wrangler CLI**: D1管理ツール

### デプロイ
- **Cloudflare Pages**: 静的サイトホスティング
- **Vite 5.0**: ビルドツール
- **PM2**: プロセス管理（開発環境）

---

## 🚀 セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. データベースのセットアップ
```bash
# ローカルD1データベースにマイグレーション適用
npm run db:migrate:local

# シードデータ投入（クイズデータなど）
npm run db:seed
```

### 3. ビルド
```bash
npm run build
```

### 4. 開発サーバー起動
```bash
# PM2で起動
pm2 start ecosystem.config.cjs

# ログ確認
pm2 logs ecomate --nostream
```

### 5. アクセス
- **ローカル**: http://localhost:3000
- **Sandbox**: https://3000-ia2yj8h4ykytgt2jhh0x0-02b9cc79.sandbox.novita.ai

---

## 📝 npm scripts

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --ip 0.0.0.0 --port 3000",
  "dev:d1": "wrangler pages dev dist --d1=ecomate-production --local --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "deploy": "npm run build && wrangler pages deploy dist --project-name ecomate",
  "db:migrate:local": "wrangler d1 migrations apply ecomate-production --local",
  "db:migrate:prod": "wrangler d1 migrations apply ecomate-production",
  "db:seed": "wrangler d1 execute ecomate-production --local --file=./seed.sql",
  "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local && npm run db:seed",
  "clean-port": "fuser -k 3000/tcp 2>/dev/null || true"
}
```

---

## 🎯 今後の拡張予定

### 機能追加
- [ ] クイズ進捗の永続化
- [ ] ランキングシステム
- [ ] バッジ・実績システム
- [ ] ソーシャル機能（友達との競争）
- [ ] より多くの学習コンテンツ
- [ ] 音声ガイド・効果音
- [✅] **AIチャット機能** - ニュース記事ごとにFinnとチャット可能（完成）

### Finn拡張
- [✅] **AIチャット機能** - ニュース解説とインタラクティブな質問対応（完成）
- [ ] Riveファイル統合（.rivアニメーション）
- [ ] State Machine入力（isHover, isDragging, trigSuccess, trigFail）
- [ ] レベルアップ時の特別なリアクション
- [ ] 成功/失敗時の特別なアニメーション
- [ ] タップでヒント/豆知識表示（ニュースチャット機能で一部実装済み）

---

## 📄 ライセンス

MIT License

## 👨‍💻 開発チーム

XESTA Development Team

---

**🎉 未知なる投資の冒険を始めよう！**
