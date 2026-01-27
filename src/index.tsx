import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as bcrypt from 'bcryptjs'

type Bindings = {
  DB: D1Database
}

type User = {
  id: number
  username: string
  password_hash: string
  xp: number
  level: number
  streak_count: number
  last_login_date: string | null
}

type Asset = {
  user_id: number
  cash_balance: number
  total_portfolio_value: number
}

type Holding = {
  user_id: number
  stock_symbol: string
  quantity: number
  average_price: number
}

type MarketData = {
  symbol: string
  company_name: string
  current_price: number
  sector: string
  price_history: string
  volatility: number
}

type Transaction = {
  user_id: number
  stock_symbol: string
  transaction_type: string
  quantity: number
  price: number
  total_amount: number
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS設定
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ===== 認証API =====

// ユーザー登録
app.post('/api/auth/signup', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400)
    }

    const db = c.env.DB

    // ユーザー名の重複チェック
    const existingUser = await db.prepare('SELECT id FROM users WHERE username = ?')
      .bind(username)
      .first()

    if (existingUser) {
      return c.json({ error: 'Username already exists' }, 409)
    }

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(password, 10)

    // ユーザー作成
    const result = await db.prepare(
      'INSERT INTO users (username, password_hash, xp, level, streak_count, last_login_date) VALUES (?, ?, 0, 1, 1, date("now"))'
    )
      .bind(username, passwordHash)
      .run()

    const userId = result.meta.last_row_id

    // 初期資産作成（100万円プレゼント）
    await db.prepare(
      'INSERT INTO assets (user_id, cash_balance, total_portfolio_value) VALUES (?, 1000000.0, 1000000.0)'
    )
      .bind(userId)
      .run()

    return c.json({
      success: true,
      user: {
        id: userId,
        username,
        xp: 0,
        level: 1,
        streak_count: 1,
      },
      message: '🎉 相棒が100万円をプレゼント！投資を始めよう！'
    }, 201)
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ログイン
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json()

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400)
    }

    const db = c.env.DB

    // ユーザー検索
    const user = await db.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first() as User | null

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // パスワード検証
    const isValid = await bcrypt.compare(password, user.password_hash)

    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // ストリーク計算
    const today = new Date().toISOString().split('T')[0]
    const lastLogin = user.last_login_date
    let newStreak = user.streak_count

    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // 連続ログイン
        newStreak += 1
      } else if (diffDays > 1) {
        // ストリークリセット
        newStreak = 1
      }
      // diffDays === 0 の場合は同日ログインなので変更なし
    }

    // ログイン日時とストリーク更新
    if (lastLogin !== today) {
      await db.prepare('UPDATE users SET last_login_date = date("now"), streak_count = ? WHERE id = ?')
        .bind(newStreak, user.id)
        .run()
    }

    // 資産情報取得
    const asset = await db.prepare('SELECT * FROM assets WHERE user_id = ?')
      .bind(user.id)
      .first() as Asset | null

    return c.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        streak_count: newStreak,
        last_login_date: today,
      },
      asset: asset ? {
        cash_balance: asset.cash_balance,
        total_portfolio_value: asset.total_portfolio_value,
      } : null
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ===== ユーザー情報API =====

// ユーザー情報取得
app.get('/api/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const db = c.env.DB

    const user = await db.prepare('SELECT id, username, xp, level, streak_count, last_login_date FROM users WHERE id = ?')
      .bind(userId)
      .first() as User | null

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    const asset = await db.prepare('SELECT * FROM assets WHERE user_id = ?')
      .bind(userId)
      .first() as Asset | null

    return c.json({
      user,
      asset
    })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 総資産計算（現金 + 株式評価額）
app.get('/api/user/:userId/total-assets', async (c) => {
  try {
    const userId = c.req.param('userId')
    const db = c.env.DB

    // 現金残高取得
    const asset = await db.prepare('SELECT cash_balance FROM assets WHERE user_id = ?')
      .bind(userId)
      .first() as { cash_balance: number } | null

    if (!asset) {
      return c.json({ error: 'User not found' }, 404)
    }

    // 保有株式の評価額計算
    const holdings = await db.prepare(`
      SELECT h.stock_symbol, h.quantity, h.average_price, m.current_price
      FROM holdings h
      JOIN market_data m ON h.stock_symbol = m.symbol
      WHERE h.user_id = ?
    `).bind(userId).all()

    let stockValue = 0
    const stockDetails = []

    for (const holding of holdings.results as any[]) {
      const value = holding.current_price * holding.quantity
      stockValue += value
      stockDetails.push({
        symbol: holding.stock_symbol,
        quantity: holding.quantity,
        average_price: holding.average_price,
        current_price: holding.current_price,
        current_value: value,
        profit: (holding.current_price - holding.average_price) * holding.quantity
      })
    }

    const totalAssets = asset.cash_balance + stockValue

    // 総資産を更新
    await db.prepare('UPDATE assets SET total_portfolio_value = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
      .bind(totalAssets, userId)
      .run()

    return c.json({
      totalAssets: totalAssets,
      cash: asset.cash_balance,
      stockValue: stockValue
    })
  } catch (error) {
    console.error('Calculate total assets error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// XP追加（クイズ報酬など）
app.post('/api/user/:userId/xp', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { xp } = await c.req.json()
    const db = c.env.DB

    // 現在のユーザー情報取得
    const user = await db.prepare('SELECT xp, level FROM users WHERE id = ?')
      .bind(userId)
      .first() as { xp: number, level: number } | null

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    const newXp = user.xp + xp
    const xpPerLevel = 1000
    const newLevel = Math.floor(newXp / xpPerLevel) + 1

    await db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?')
      .bind(newXp, newLevel, userId)
      .run()

    return c.json({
      success: true,
      xp: newXp,
      level: newLevel,
      leveledUp: newLevel > user.level
    })
  } catch (error) {
    console.error('Add XP error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ===== ユーザー設定API =====

// ユーザー設定取得
app.get('/api/user/:userId/settings', async (c) => {
  try {
    const userId = c.req.param('userId')
    const db = c.env.DB

    let settings = await db.prepare('SELECT * FROM user_settings WHERE user_id = ?')
      .bind(userId)
      .first()

    // 設定が存在しない場合はデフォルト値を作成
    if (!settings) {
      await db.prepare(
        'INSERT INTO user_settings (user_id, market_update_interval, auto_update_enabled) VALUES (?, 30, 1)'
      ).bind(userId).run()

      settings = await db.prepare('SELECT * FROM user_settings WHERE user_id = ?')
        .bind(userId)
        .first()
    }

    return c.json(settings)
  } catch (error) {
    console.error('Get user settings error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ユーザー設定更新
app.put('/api/user/:userId/settings', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { market_update_interval, auto_update_enabled } = await c.req.json()
    const db = c.env.DB

    await db.prepare(
      'UPDATE user_settings SET market_update_interval = ?, auto_update_enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(market_update_interval, auto_update_enabled ? 1 : 0, userId).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Update user settings error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ===== マーケットAPI =====

// 市場データ取得
app.get('/api/market', async (c) => {
  try {
    const db = c.env.DB

    // Stocks (market_data)
    const stocks = await db.prepare('SELECT *, "STOCK" as type FROM market_data')
      .all()

    // Commodities
    const commodities = await db.prepare('SELECT symbol, name as company_name, current_price, volatility, "COMMODITY" as type, "商品" as sector FROM commodities')
      .all()

    // ETF Packs
    const etfs = await db.prepare('SELECT symbol, name as company_name, current_price, volatility, "ETF" as type, theme as sector, description FROM etf_packs')
      .all()

    // Combine all markets
    const allMarkets = [
      ...(stocks.results || []),
      ...(commodities.results || []),
      ...(etfs.results || [])
    ]

    return c.json({
      markets: allMarkets
    })
  } catch (error) {
    console.error('Get market error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 特定銘柄の詳細取得
app.get('/api/market/:symbol', async (c) => {
  try {
    const symbol = c.req.param('symbol')
    const db = c.env.DB

    const market = await db.prepare('SELECT * FROM market_data WHERE symbol = ?')
      .bind(symbol)
      .first() as MarketData | null

    if (!market) {
      return c.json({ error: 'Stock not found' }, 404)
    }

    return c.json({
      market: {
        ...market,
        price_history: JSON.parse(market.price_history || '[]')
      }
    })
  } catch (error) {
    console.error('Get stock error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 株価更新（ランダムウォーク）
app.post('/api/market/tick', async (c) => {
  try {
    const db = c.env.DB

    // すべての株式銘柄を取得
    const stocks = await db.prepare('SELECT * FROM market_data').all()

    for (const market of stocks.results as MarketData[]) {
      const volatility = market.volatility || 0.02
      const change = (Math.random() - 0.5) * 2 * volatility
      const newPrice = market.current_price * (1 + change)

      // 価格履歴更新
      const priceHistory = JSON.parse(market.price_history || '[]')
      priceHistory.push({
        price: newPrice,
        timestamp: new Date().toISOString()
      })

      // 最新100件のみ保持
      if (priceHistory.length > 100) {
        priceHistory.shift()
      }

      await db.prepare(
        'UPDATE market_data SET current_price = ?, price_history = ?, updated_at = CURRENT_TIMESTAMP WHERE symbol = ?'
      )
        .bind(newPrice, JSON.stringify(priceHistory), market.symbol)
        .run()
    }

    // Commodities（商品）の価格更新
    const commodities = await db.prepare('SELECT * FROM commodities').all()

    for (const commodity of commodities.results as any[]) {
      const volatility = commodity.volatility || 0.015
      const change = (Math.random() - 0.5) * 2 * volatility
      const newPrice = commodity.current_price * (1 + change)

      const priceHistory = JSON.parse(commodity.price_history || '[]')
      priceHistory.push({
        price: newPrice,
        timestamp: new Date().toISOString()
      })

      if (priceHistory.length > 100) {
        priceHistory.shift()
      }

      await db.prepare(
        'UPDATE commodities SET current_price = ?, price_history = ?, updated_at = CURRENT_TIMESTAMP WHERE symbol = ?'
      )
        .bind(newPrice, JSON.stringify(priceHistory), commodity.symbol)
        .run()
    }

    // ETF Packs（X-Packs）の価格更新
    const etfs = await db.prepare('SELECT * FROM etf_packs').all()

    for (const etf of etfs.results as any[]) {
      const volatility = etf.volatility || 0.025
      const change = (Math.random() - 0.5) * 2 * volatility
      const newPrice = etf.current_price * (1 + change)

      const priceHistory = JSON.parse(etf.price_history || '[]')
      priceHistory.push({
        price: newPrice,
        timestamp: new Date().toISOString()
      })

      if (priceHistory.length > 100) {
        priceHistory.shift()
      }

      await db.prepare(
        'UPDATE etf_packs SET current_price = ?, price_history = ?, updated_at = CURRENT_TIMESTAMP WHERE symbol = ?'
      )
        .bind(newPrice, JSON.stringify(priceHistory), etf.symbol)
        .run()
    }

    return c.json({ success: true, message: 'Market prices updated' })
  } catch (error) {
    console.error('Market tick error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ===== トレードAPI =====

// 保有銘柄取得
app.get('/api/holdings/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const db = c.env.DB

    const holdings = await db.prepare(`
      SELECT h.*, m.company_name, m.current_price, m.sector
      FROM holdings h
      JOIN market_data m ON h.stock_symbol = m.symbol
      WHERE h.user_id = ?
    `)
      .bind(userId)
      .all()

    return c.json({
      holdings: holdings.results
    })
  } catch (error) {
    console.error('Get holdings error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 株式購入
app.post('/api/trade/buy', async (c) => {
  try {
    const { userId, symbol, quantity } = await c.req.json()
    const db = c.env.DB

    // 市場データ取得（株式、商品、ETFの順にチェック）
    let market = await db.prepare('SELECT current_price FROM market_data WHERE symbol = ?')
      .bind(symbol)
      .first() as { current_price: number } | null

    if (!market) {
      // Commoditiesをチェック
      market = await db.prepare('SELECT current_price FROM commodities WHERE symbol = ?')
        .bind(symbol)
        .first() as { current_price: number } | null
    }

    if (!market) {
      // ETF Packsをチェック
      market = await db.prepare('SELECT current_price FROM etf_packs WHERE symbol = ?')
        .bind(symbol)
        .first() as { current_price: number } | null
    }

    if (!market) {
      return c.json({ error: 'Asset not found' }, 404)
    }

    const totalCost = market.current_price * quantity

    // 資産情報取得
    const asset = await db.prepare('SELECT cash_balance FROM assets WHERE user_id = ?')
      .bind(userId)
      .first() as { cash_balance: number } | null

    if (!asset) {
      return c.json({ error: 'User not found' }, 404)
    }

    if (asset.cash_balance < totalCost) {
      return c.json({ error: 'Insufficient funds' }, 400)
    }

    // 保有銘柄確認
    const holding = await db.prepare('SELECT * FROM holdings WHERE user_id = ? AND stock_symbol = ?')
      .bind(userId, symbol)
      .first() as Holding | null

    if (holding) {
      // 既存保有銘柄の平均取得価格更新
      const newQuantity = holding.quantity + quantity
      const newAvgPrice = (holding.average_price * holding.quantity + market.current_price * quantity) / newQuantity

      await db.prepare('UPDATE holdings SET quantity = ?, average_price = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND stock_symbol = ?')
        .bind(newQuantity, newAvgPrice, userId, symbol)
        .run()
    } else {
      // 新規保有銘柄追加
      await db.prepare('INSERT INTO holdings (user_id, stock_symbol, quantity, average_price) VALUES (?, ?, ?, ?)')
        .bind(userId, symbol, quantity, market.current_price)
        .run()
    }

    // 資産更新
    const newCashBalance = asset.cash_balance - totalCost
    await db.prepare('UPDATE assets SET cash_balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
      .bind(newCashBalance, userId)
      .run()

    // 取引履歴記録
    await db.prepare(
      'INSERT INTO transactions (user_id, stock_symbol, transaction_type, quantity, price, total_amount) VALUES (?, ?, "buy", ?, ?, ?)'
    )
      .bind(userId, symbol, quantity, market.current_price, totalCost)
      .run()

    return c.json({
      success: true,
      message: '🎉 購入完了！',
      cash_balance: newCashBalance
    })
  } catch (error) {
    console.error('Buy error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 株式売却
app.post('/api/trade/sell', async (c) => {
  try {
    const { userId, symbol, quantity } = await c.req.json()
    const db = c.env.DB

    // 保有銘柄確認
    const holding = await db.prepare('SELECT * FROM holdings WHERE user_id = ? AND stock_symbol = ?')
      .bind(userId, symbol)
      .first() as Holding | null

    if (!holding || holding.quantity < quantity) {
      return c.json({ error: 'Insufficient holdings' }, 400)
    }

    // 市場データ取得
    const market = await db.prepare('SELECT current_price FROM market_data WHERE symbol = ?')
      .bind(symbol)
      .first() as { current_price: number } | null

    if (!market) {
      return c.json({ error: 'Stock not found' }, 404)
    }

    const totalRevenue = market.current_price * quantity

    // 保有数更新または削除
    if (holding.quantity === quantity) {
      await db.prepare('DELETE FROM holdings WHERE user_id = ? AND stock_symbol = ?')
        .bind(userId, symbol)
        .run()
    } else {
      const newQuantity = holding.quantity - quantity
      await db.prepare('UPDATE holdings SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND stock_symbol = ?')
        .bind(newQuantity, userId, symbol)
        .run()
    }

    // 資産更新
    const asset = await db.prepare('SELECT cash_balance FROM assets WHERE user_id = ?')
      .bind(userId)
      .first() as { cash_balance: number } | null

    if (!asset) {
      return c.json({ error: 'User not found' }, 404)
    }

    const newCashBalance = asset.cash_balance + totalRevenue
    await db.prepare('UPDATE assets SET cash_balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
      .bind(newCashBalance, userId)
      .run()

    // 取引履歴記録
    await db.prepare(
      'INSERT INTO transactions (user_id, stock_symbol, transaction_type, quantity, price, total_amount) VALUES (?, ?, "sell", ?, ?, ?)'
    )
      .bind(userId, symbol, quantity, market.current_price, totalRevenue)
      .run()

    // 損益計算
    const profit = (market.current_price - holding.average_price) * quantity

    return c.json({
      success: true,
      message: profit > 0 ? '🎉 利益確定！' : '売却完了',
      cash_balance: newCashBalance,
      profit
    })
  } catch (error) {
    console.error('Sell error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ===== クイズAPI =====

// クイズデータ（静的）
const quizzes = [
  {
    id: 'q1',
    question: 'PER（株価収益率）とは何を示す指標ですか？',
    options: [
      '株価が1株あたり利益の何倍かを示す',
      '企業の売上高を示す',
      '配当金の額を示す'
    ],
    correctIndex: 0,
    explanation: 'PERは株価が1株あたり利益の何倍になっているかを示す指標で、割安・割高を判断する目安になります。',
    xpReward: 100,
    cashReward: 5000
  },
  {
    id: 'q2',
    question: '分散投資の主な目的は何ですか？',
    options: [
      '利益を最大化する',
      'リスクを分散させる',
      '手数料を節約する'
    ],
    correctIndex: 1,
    explanation: '分散投資は複数の銘柄や資産に投資することで、リスクを分散させることが主な目的です。',
    xpReward: 100,
    cashReward: 5000
  },
  {
    id: 'q3',
    question: '配当利回りとは何ですか？',
    options: [
      '株価の年間上昇率',
      '1株あたりの配当金を株価で割った割合',
      '企業の利益率'
    ],
    correctIndex: 1,
    explanation: '配当利回りは、1株あたりの年間配当金を株価で割ったもので、投資額に対する配当の割合を示します。',
    xpReward: 100,
    cashReward: 5000
  },
  {
    id: 'q4',
    question: '長期投資の利点は何ですか？',
    options: [
      '短期的な価格変動の影響を受けにくい',
      '必ず利益が出る',
      '手数料がかからない'
    ],
    correctIndex: 0,
    explanation: '長期投資は短期的な価格変動に左右されにくく、複利効果も期待できるため、安定した資産形成に適しています。',
    xpReward: 100,
    cashReward: 5000
  },
  {
    id: 'q5',
    question: '「損切り」とは何ですか？',
    options: [
      '利益を確定させること',
      '損失を最小限に抑えるために保有株を売却すること',
      '配当金を受け取ること'
    ],
    correctIndex: 1,
    explanation: '損切りは、株価が下落した際に損失を最小限に抑えるため、早めに売却することです。リスク管理の重要な手法です。',
    xpReward: 100,
    cashReward: 5000
  }
]

// クイズリスト取得
app.get('/api/quiz', async (c) => {
  return c.json({
    quizzes: quizzes.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }))
  })
})

// クイズ回答送信
app.post('/api/quiz/:quizId/answer', async (c) => {
  try {
    const quizId = c.req.param('quizId')
    const { userId, answerIndex } = await c.req.json()
    const db = c.env.DB

    const quiz = quizzes.find(q => q.id === quizId)
    if (!quiz) {
      return c.json({ error: 'Quiz not found' }, 404)
    }

    const isCorrect = answerIndex === quiz.correctIndex

    // クイズ結果記録
    await db.prepare(
      'INSERT INTO quiz_results (user_id, quiz_id, correct, xp_earned) VALUES (?, ?, ?, ?)'
    )
      .bind(userId, quizId, isCorrect ? 1 : 0, isCorrect ? quiz.xpReward : 0)
      .run()

    if (isCorrect) {
      // XP追加
      const user = await db.prepare('SELECT xp, level FROM users WHERE id = ?')
        .bind(userId)
        .first() as { xp: number, level: number } | null

      if (user) {
        const newXp = user.xp + quiz.xpReward
        const xpPerLevel = 1000
        const newLevel = Math.floor(newXp / xpPerLevel) + 1

        await db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?')
          .bind(newXp, newLevel, userId)
          .run()

        // キャッシュ追加
        await db.prepare('UPDATE assets SET cash_balance = cash_balance + ? WHERE user_id = ?')
          .bind(quiz.cashReward, userId)
          .run()
      }
    }

    return c.json({
      correct: isCorrect,
      explanation: quiz.explanation,
      xpReward: isCorrect ? quiz.xpReward : 0,
      cashReward: isCorrect ? quiz.cashReward : 0
    })
  } catch (error) {
    console.error('Quiz answer error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ===== 取引履歴API =====

// 取引履歴取得
app.get('/api/transactions/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const db = c.env.DB

    const transactions = await db.prepare(`
      SELECT t.*, m.company_name
      FROM transactions t
      JOIN market_data m ON t.stock_symbol = m.symbol
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
      LIMIT 50
    `)
      .bind(userId)
      .all()

    return c.json({
      transactions: transactions.results
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ===== HTMLルート =====

// メインページ
app.get('/', (c) => {
  c.header('Cache-Control', 'no-cache, no-store, must-revalidate')
  c.header('Pragma', 'no-cache')
  c.header('Expires', '0')
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>XESTA - Invest in the Unknown</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'xesta-green': '#10B981',
              'xesta-red': '#F43F5E',
              'xesta-blue': '#3B82F6',
              'xesta-slate': '#0F172A',
              'xesta-dark': '#1E293B',
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Quicksand:wght@400;500;600;700&display=swap');
        
        :root {
            --color-primary: #10B981;
            --color-secondary: #3B82F6;
            --color-danger: #F43F5E;
            --color-background: #0F172A;
            --color-surface: #1E293B;
            --color-text: #F1F5F9;
            --color-textSecondary: #94A3B8;
            --font-primary: 'Inter', sans-serif;
            --font-heading: 'Inter', sans-serif;
            --border-radius: 0.5rem;
        }
        
        body {
            font-family: var(--font-primary);
            background: linear-gradient(135deg, var(--color-background) 0%, #020617 100%);
            min-height: 100vh;
            color: var(--color-text);
            transition: background 0.3s ease, color 0.3s ease;
        }

        .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
        }

        * {
            -webkit-tap-highlight-color: transparent;
        }

        .card-shadow {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .btn-bounce {
            transition: transform 0.1s ease;
        }

        .btn-bounce:active {
            transform: scale(0.95);
        }

        .spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 3px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background-color: #f0f;
            animation: confetti-fall 3s linear;
            pointer-events: none;
            z-index: 9999;
        }

        @keyframes confetti-fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes heart-float {
            0% {
                transform: translateY(0) scale(0);
                opacity: 0;
            }
            20% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(50px) scale(1.5);
                opacity: 0;
            }
        }
        
        /* Pop X Theme Overrides */
        body.theme-pop {
            background: linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%);
        }
        
        body.theme-pop .text-white {
            color: #1F2937 !important;
        }
        
        body.theme-pop .bg-gray-800,
        body.theme-pop .bg-gray-900 {
            background: #FFFFFF !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body class="min-h-screen">
    <div id="root"></div>

    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@11/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel" src="/static/app.js?v=${Date.now()}"></script>
</body>
</html>
  `)
})

export default app
