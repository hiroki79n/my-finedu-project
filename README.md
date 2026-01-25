# 🌱 EcoMate - 子供向け株式投資学習アプリ

**Duolingoスタイルの没入感のあるUIUXで学ぶ、楽しい株式投資体験！**

## 🎯 プロジェクト概要

EcoMateは、子供たちが楽しみながら株式投資を学べる教育アプリです。Duolingoのようなゲーミフィケーション要素と、Framer Motionによる豪華なアニメーションで、学習体験を最大化します。

### 主な特徴

- 🎮 **ゲーミフィケーション**: XPシステム、レベルアップ、ストリーク機能
- ✨ **リッチなアニメーション**: Framer Motionによるスムーズな画面遷移と動的なUI
- 🔊 **Duolingo風サウンド**: Web Audio APIによる没入感ある効果音システム
- 🇯🇵 **日本企業を学習**: 任天堂、トヨタ、ファーストリテイリングなど実在企業
- 📈 **仮想市場システム**: 24時間365日いつでもトレード体験可能
- 🤖 **相棒キャラクター**: 状態に応じて表情が変わるAIパートナー
- 📊 **リアルな取引体験**: 仮想通貨での株式売買シミュレーション
- 🧠 **教育クイズ**: 金融リテラシーを高める学習コンテンツ
- 💰 **ポートフォリオ管理**: 保有銘柄の損益をリアルタイム表示
- 🎉 **成功体験の演出**: 購入成功時の紙吹雪エフェクトなど

## 🚀 デモURL

**開発環境**: https://3000-ia2yj8h4ykytgt2jhh0x0-02b9cc79.sandbox.novita.ai

### デモアカウント
- **ユーザー名**: `demo`
- **パスワード**: `demo123`

## 📋 実装済み機能

### ✅ 認証システム
- ユーザー登録・ログイン機能
- パスワードハッシュ化（bcrypt）
- 新規登録時に100万円の仮想通貨をプレゼント

### ✅ ホーム画面
- XPプログレスバー（次のレベルまでの進捗表示）
- ストリーク表示（連続ログイン日数）
- 資産残高のアニメーション表示（カウントアップ効果）
- 4つのメインアクション：マーケット、クイズ、ポートフォリオ、取引履歴

### ✅ マーケット機能（NEW! 🇯🇵）
- **12銘柄の日本企業**を実装:
  - 🎮 任天堂 (7974) - ゲーム・エンタメ
  - 🚗 トヨタ自動車 (7203) - 自動車
  - 👕 ファーストリテイリング (9983) - アパレル
  - 🛡️ トレンドマイクロ (4704) - IT・セキュリティ
  - 💬 LINEヤフー (4689) - IT・通信
  - 🛒 楽天グループ (4755) - EC・フィンテック
  - 🎵 ソニーグループ (6758) - 電機・エンタメ
  - 📱 ソフトバンクグループ (9984) - 通信・投資
  - 💊 武田薬品工業 (4502) - 医薬品
  - 🍃 日本たばこ産業 (2914) - 食品・飲料
  - ⚕️ 第一三共 (4568) - 医薬品
  - 💼 リクルートホールディングス (6098) - 人材サービス
- **仮想市場ロジック**: Random Walkアルゴリズムで株価が自動変動
- **リアルタイム価格**: 30秒ごとに自動更新
- **企業アイコン**: Lucide React風の絵文字アイコンで視覚的に認識
- **長押し購入UI**: 誤操作防止のインタラクション
- **購入成功時の紙吹雪エフェクト**: 達成感を演出

### ✅ クイズ機能
- 5つの金融教育クイズ（PER、分散投資、配当利回りなど）
- 正解時にXPと仮想通貨を獲得
- 解説付きフィードバック

### ✅ ポートフォリオ管理
- 保有銘柄の一覧表示
- 平均取得価格と現在価格の比較
- 評価損益の表示（金額・パーセント）

### ✅ 取引履歴
- 過去50件の売買履歴を表示
- 取引日時、銘柄、数量、価格、合計金額

### ✅ 相棒キャラクター
- 画面右下に常駐する絵文字キャラクター
- 状態に応じた表情変化（happy, excited, surprised, sad, thinking, celebrate）
- ふわふわと浮遊するアニメーション

### ✅ サウンドシステム（NEW! 🔊）
- **Web Audio API**: ブラウザネイティブの高品質サウンド生成
- **8種類の効果音**:
  - 🎵 クリック音: ボタン押下時のポップ音
  - 🎉 成功音: ログイン成功、購入完了時の上昇音階
  - ❌ エラー音: 失敗時の下降音
  - 🎊 レベルアップ音: 祝福の音階メロディ
  - 💰 コイン音: クイズ正解時のキラキラ音
  - 🔔 通知音: 画面遷移、メッセージ表示時
  - 🛒 購入音: レジの「チーン！」音
  - 🔥 ストリーク音: ログイン時の炎の効果音
- **音声ON/OFFトグル**: 画面左下の🔊/🔇ボタンで切り替え可能
- **タイミング最適化**: 各アクションに応じた適切な効果音を自動再生

### ✅ 仮想市場システム（NEW! 📈）
- **24時間365日トレード可能**: 市場の開閉時間に関係なく、いつでも体験できる
- **Random Walkアルゴリズム**: 現実的な株価変動を実装
  - 各銘柄ごとに異なるボラティリティ（変動率）を設定
  - 時間経過で自動的に価格が変動
  - 価格履歴を最大100件まで保存
- **リアルな初期価格**: 実際の株価に近い値で設定
  - 任天堂: 約7,850円
  - トヨタ自動車: 約2,680円
  - ファーストリテイリング: 約38,500円
- **価格変動幅の調整**: 銘柄ごとに適切なボラティリティ
  - 安定株: 1.5-2.0%（JT、武田薬品など）
  - 通常株: 2.0-2.8%（任天堂、トヨタなど）
  - 変動株: 3.0-3.5%（楽天、ファーストリテイリングなど）

## 🛠 技術スタック

### フロントエンド
- **React 18**: UIライブラリ（CDN版）
- **Framer Motion 11**: アニメーションライブラリ
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク
- **Babel Standalone**: JSXのブラウザ内トランスパイル
- **Web Audio API**: リアルタイム効果音生成

### バックエンド
- **Hono**: 軽量でパフォーマンスの高いWebフレームワーク
- **Cloudflare Workers**: エッジランタイム環境
- **TypeScript**: 型安全な開発

### データベース
- **Cloudflare D1**: グローバル分散SQLiteデータベース
- **テーブル構成**:
  - `users`: ユーザー情報（ID、ユーザー名、XP、レベル、ストリーク）
  - `assets`: 資産情報（現金残高、ポートフォリオ総額）
  - `holdings`: 保有銘柄（銘柄コード、数量、平均取得価格）
  - `market_data`: 市場データ（銘柄情報、現在価格、価格履歴）
  - `quiz_results`: クイズ結果（正誤、獲得XP）
  - `transactions`: 取引履歴（売買種別、数量、価格）

### 認証・セキュリティ
- **bcryptjs**: パスワードハッシュ化

## 📂 プロジェクト構造

```
webapp/
├── src/
│   ├── index.tsx           # Honoサーバー（API + HTMLレンダリング）
│   └── renderer.tsx         # JSXレンダラー設定
├── public/
│   ├── index.html           # HTMLテンプレート（未使用）
│   └── static/
│       ├── app.js           # Reactアプリケーション本体
│       └── style.css        # 追加スタイル
├── migrations/
│   └── 0001_initial_schema.sql  # データベーススキーマ
├── dist/                    # ビルド出力ディレクトリ
│   ├── _worker.js           # Cloudflare Worker
│   ├── _routes.json         # ルーティング設定
│   ├── index.html           # 静的HTML
│   └── static/              # 静的アセット
├── seed.sql                 # シードデータ（デモ用）
├── ecosystem.config.cjs     # PM2設定
├── wrangler.jsonc           # Cloudflare設定
├── vite.config.ts           # Viteビルド設定
├── tsconfig.json            # TypeScript設定
└── package.json             # 依存関係とスクリプト
```

## 🎨 主要なアニメーション実装

### 1. ボタンホバー＆タップ効果
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  クリック
</motion.button>
```

### 2. 数値カウントアップ
```jsx
const CountUp = ({ value, duration = 1 }) => {
  // スロットマシン風のドラムロールアニメーション
}
```

### 3. 紙吹雪エフェクト
```javascript
const createConfetti = () => {
  // 50個の色とりどりの紙吹雪を画面全体に散布
  // 3秒かけて落下・回転しながらフェードアウト
}
```

### 4. 画面遷移
```jsx
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
  >
    {/* コンテンツ */}
  </motion.div>
</AnimatePresence>
```

### 5. プログレスバー
```jsx
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${xpProgress}%` }}
  transition={{ duration: 1, ease: "easeOut" }}
  className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
/>
```

### 6. サウンドシステム (NEW! 🔊)
```javascript
class SoundSystem {
  // Web Audio APIによる効果音生成
  playClick() { /* ボタンクリック音 */ }
  playSuccess() { /* 成功の上昇音階 */ }
  playError() { /* エラーの下降音 */ }
  playLevelUp() { /* 祝福のメロディ */ }
  playCoin() { /* コイン獲得のキラキラ音 */ }
  playNotification() { /* 通知音 */ }
  playPurchase() { /* 購入音 */ }
  playStreak() { /* ストリーク炎音 */ }
}

// 使用例
soundSystem.playClick(); // ボタンクリック時
soundSystem.playSuccess(); // ログイン成功時
soundSystem.playCoin(); // クイズ正解時
```

## 🔌 API エンドポイント

### 認証
- `POST /api/auth/signup` - ユーザー登録
- `POST /api/auth/login` - ログイン

### ユーザー
- `GET /api/user/:userId` - ユーザー情報取得
- `POST /api/user/:userId/xp` - XP追加

### マーケット
- `GET /api/market` - 全銘柄データ取得
- `GET /api/market/:symbol` - 特定銘柄の詳細取得
- `POST /api/market/tick` - 株価更新（ランダムウォーク）

### トレード
- `GET /api/holdings/:userId` - 保有銘柄取得
- `POST /api/trade/buy` - 株式購入
- `POST /api/trade/sell` - 株式売却

### クイズ
- `GET /api/quiz` - クイズリスト取得
- `POST /api/quiz/:quizId/answer` - クイズ回答送信

### 取引履歴
- `GET /api/transactions/:userId` - 取引履歴取得

## 🚀 開発環境セットアップ

### 前提条件
- Node.js 18以上
- npm

### インストール

```bash
# 依存関係のインストール
npm install

# データベースマイグレーション
npm run db:migrate:local

# シードデータ投入
npm run db:seed

# ビルド
npm run build
```

### 開発サーバー起動

```bash
# ポートクリーンアップ
npm run clean-port

# PM2で起動
pm2 start ecosystem.config.cjs

# ログ確認
pm2 logs ecomate --nostream

# ステータス確認
pm2 list
```

### アクセス
- **ローカル**: http://localhost:3000
- **API例**: http://localhost:3000/api/market

### データベース管理

```bash
# ローカルDBコンソール
npm run db:console:local

# データベースリセット
npm run db:reset

# 本番DBマイグレーション
npm run db:migrate:prod
```

## 📦 デプロイ

### Cloudflare Pagesへのデプロイ

```bash
# ビルド＆デプロイ
npm run deploy:prod

# 本番環境用データベースマイグレーション
npm run db:migrate:prod
```

### 環境変数設定
本番環境では、以下の設定が必要です：

```bash
# D1データベースの作成
npx wrangler d1 create ecomate-production

# wrangler.jsonc に database_id を追加
```

## 🎮 使用方法

### 1. アカウント作成
- 新規登録で100万円の仮想通貨をゲット！
- 相棒キャラクターが「🎉 相棒が100万円をプレゼント！」とお祝い

### 2. マーケットで株を購入
- 銘柄を選択して、長押しで購入確定
- 購入成功で紙吹雪が舞う！

### 3. クイズで学習
- 金融知識クイズに挑戦
- 正解でXPと報酬をゲット

### 4. ポートフォリオ確認
- 保有銘柄の損益をチェック
- 緑色なら利益、赤色なら損失

## 🔧 トラブルシューティング

### ポート3000が使用中
```bash
npm run clean-port
# または
fuser -k 3000/tcp
```

### ビルドエラー
```bash
# node_modulesを再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### データベースエラー
```bash
# データベースをリセット
npm run db:reset
```

## 🌟 今後の拡張予定

- [ ] リアルタイム株価チャート（Chart.js統合）
- [ ] 友達との競争機能（リーダーボード）
- [ ] より多くのクイズコンテンツ
- [ ] 保護者向けダッシュボード
- [ ] アチーブメント・バッジシステム
- [ ] 音声ガイド・効果音
- [ ] ダークモード対応

## 🤝 コントリビューション

このプロジェクトは教育目的で作成されています。機能追加やバグ修正の提案は大歓迎です！

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

EcoMate Development Team

---

**🎉 楽しい投資学習の旅を始めよう！**
