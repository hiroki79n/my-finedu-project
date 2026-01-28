# クエスト→クイズ遷移デバッグ手順

## 🔍 問題

「開始！」ボタンをクリックしても画面が遷移しない

## 📋 デバッグ手順

### 1. デモURLを開く
https://3000-ia2yj8h4ykytgt2jhh0x0-02b9cc79.sandbox.novita.ai

### 2. ブラウザのコンソールを開く
- **Chrome/Edge**: F12キー → Consoleタブ
- **Firefox**: F12キー → コンソールタブ
- **Safari**: Option + Command + C

### 3. ログイン
- ユーザー名: `demo`
- パスワード: `demo123`

### 4. Quest Forestへ移動
- ホーム画面の「Quest Forest」ボタンをクリック

### 5. クエストを選択
- 任意のクエストをクリック（例: Chapter 1の「物々交換の限界」）

### 6. 「開始！」ボタンをクリック

### 7. コンソールログを確認

#### 期待されるログ（正常な場合）:

```
=== Starting Quest ===
Quest ID: 101
Quest Title: 物々交換の限界
Chapter: {id: 1, title: "価値の誕生と交換", ...}
Target Chapter ID: 1
Set questId: 101
Set chapterId: 1
Navigating to quiz screen...

=== handleNavigate called ===
Current screen: map
Target screen: quiz
setCurrentScreen executed

=== App Render ===
currentScreen: quiz
user: demo
selectedQuestId: 101
selectedChapterId: 1

=== QuizScreen Mounted ===
Props: {userId: 1, questId: 101, chapterId: 1}

Fetched quizzes: 65
chapterId: 1 questId: 101
Filtered quizzes for chapter 1 : 10
```

## 🐛 問題診断

### ケース1: handleStartQuestが実行されない
- ログに `=== Starting Quest ===` が表示されない
- 原因: ボタンのonClick属性が正しく設定されていない
- 対策: MapScreenのモーダル部分を確認

### ケース2: handleNavigateが実行されない
- ログに `=== Starting Quest ===` は表示されるが、`=== handleNavigate called ===` が表示されない
- 原因: onNavigate propsが正しく渡されていない
- 対策: MapScreenのprops確認

### ケース3: currentScreenが変更されない
- ログに `=== handleNavigate called ===` は表示されるが、`currentScreen` が 'quiz' にならない
- 原因: setCurrentScreenが実行されていない、または状態更新が反映されない
- 対策: React状態管理の問題を確認

### ケース4: QuizScreenがマウントされない
- ログに `currentScreen: quiz` は表示されるが、`=== QuizScreen Mounted ===` が表示されない
- 原因: ルーティング条件（`currentScreen === 'quiz' && user`）が満たされていない
- 対策: userオブジェクトの存在確認

### ケース5: クイズデータが取得できない
- ログに `=== QuizScreen Mounted ===` は表示されるが、`Fetched quizzes` が表示されない
- 原因: API `/api/quiz` の呼び出しエラー
- 対策: ネットワークタブでAPIレスポンスを確認

## 🔧 各ログの意味

| ログメッセージ | 実行箇所 | 意味 |
|--------------|---------|------|
| `=== Starting Quest ===` | MapScreen.handleStartQuest | クエスト開始処理開始 |
| `Target Chapter ID: X` | MapScreen.handleStartQuest | チャプターID抽出成功 |
| `Set chapterId: X` | MapScreen.handleStartQuest | setSelectedChapterId実行 |
| `Navigating to quiz screen...` | MapScreen.handleStartQuest | onNavigate('quiz')実行 |
| `=== handleNavigate called ===` | App.handleNavigate | ナビゲーション関数実行 |
| `setCurrentScreen executed` | App.handleNavigate | 状態更新実行 |
| `=== App Render ===` | App.render | App再レンダリング |
| `currentScreen: quiz` | App.render | 画面状態がquizに変更 |
| `=== QuizScreen Mounted ===` | QuizScreen | QuizScreenマウント |
| `Fetched quizzes: 65` | QuizScreen.fetchQuizzes | APIからクイズ取得成功 |
| `Filtered quizzes for chapter X : Y` | QuizScreen.fetchQuizzes | チャプターフィルタ成功 |

## 📝 結果報告

コンソールに表示されたログを以下にコピーしてください：

```
（ここにログを貼り付け）
```

## ✅ 期待される動作

1. クエストモーダルが開く
2. 「開始！」ボタンをクリック
3. モーダルが閉じる
4. **画面がクイズ画面に遷移**
5. クイズのタイトルが表示
6. 質問文が表示
7. 4つの選択肢が表示
8. 選択肢をクリックして選択可能
9. 「回答する」ボタンが有効化

---

**デバッグログを確認して、どのステップで止まっているか特定してください。**
