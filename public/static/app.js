// グローバル変数でReact、ReactDOM、Framer Motionを利用可能にする
const { useState, useEffect, useRef, createContext, useContext } = React;
const { motion, AnimatePresence } = Motion;

// ===== コンテキスト =====
const AppContext = createContext();

const useApp = () => useContext(AppContext);

// ===== サウンドシステム =====
class SoundSystem {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // ボタンクリック音（短いポップ音）
  playClick() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // 成功音（上昇音階）
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.4);
  }

  // エラー音（下降音）
  playError() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // レベルアップ音（祝福の音階）
  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    const notes = [523, 659, 784, 1047]; // C5-E5-G5-C6
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = this.audioContext.currentTime + index * 0.15;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  // コイン獲得音（キラキラ音）
  playCoin() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // 通知音（ポロン）
  playNotification() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // 購入音（レジの音）
  playPurchase() {
    if (!this.enabled) return;
    this.init();
    // チーン！という音
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 1200;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // ストリーク音（炎の音）
  playStreak() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// グローバルサウンドインスタンス
const soundSystem = new SoundSystem();

// ===== ユーティリティ関数 =====

// 数値フォーマット
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ja-JP', { 
    style: 'currency', 
    currency: 'JPY',
    maximumFractionDigits: 0 
  }).format(value);
};

// 紙吹雪エフェクト
const createConfetti = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const confettiCount = 50;
  
  soundSystem.playSuccess(); // 成功音を再生
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 3500);
  }
};

// ===== 相棒キャラクターコンポーネント =====
const BuddyCharacter = ({ mood = 'happy', message }) => {
  const buddyEmojis = {
    happy: '😊',
    excited: '🎉',
    surprised: '😲',
    sad: '😢',
    thinking: '🤔',
    celebrate: '🥳'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [-5, 5, -5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="bg-white rounded-full p-4 card-shadow cursor-pointer"
      >
        <div className="text-6xl">{buddyEmojis[mood] || buddyEmojis.happy}</div>
      </motion.div>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute bottom-full right-0 mb-2 bg-white rounded-xl p-3 card-shadow max-w-xs"
        >
          <p className="text-sm font-medium text-gray-800">{message}</p>
          <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ===== カウントアップアニメーションコンポーネント =====
const CountUp = ({ value, duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{formatCurrency(displayValue)}</span>;
};

// ===== ボタンコンポーネント =====
const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-blue-500 hover:bg-blue-600 text-white',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-purple-600'
  };

  const handleClick = (e) => {
    soundSystem.playClick(); // クリック音を再生
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      disabled={disabled}
      className={`${variants[variant]} px-6 py-3 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-bounce ${className}`}
    >
      {children}
    </motion.button>
  );
};

// ===== 認証画面 =====
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        soundSystem.playSuccess(); // 成功音を再生
        if (!isLogin) {
          createConfetti();
        }
        onLogin(data.user, data.asset);
      } else {
        soundSystem.playError(); // エラー音を再生
        setError(data.error || 'エラーが発生しました');
      }
    } catch (err) {
      soundSystem.playError(); // エラー音を再生
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 card-shadow max-w-md w-full"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-2">🌱</div>
          <h1 className="text-4xl font-bold text-purple-600">EcoMate</h1>
          <p className="text-gray-600 mt-2">楽しく学ぶ株式投資</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ユーザー名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-100 border-2 border-rose-500 text-rose-700 px-4 py-2 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="spinner mx-auto"></div>
            ) : (
              isLogin ? 'ログイン' : 'アカウント作成'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-bold hover:underline"
          >
            {isLogin ? 'アカウントを作成' : 'ログインに戻る'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-purple-100 rounded-xl">
          <p className="text-sm text-purple-800">
            <strong>デモアカウント:</strong><br/>
            ユーザー名: demo<br/>
            パスワード: demo123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ===== ホーム画面 =====
const HomeScreen = ({ user, asset, onNavigate }) => {
  const xpPerLevel = 1000;
  const currentLevelXp = user.xp % xpPerLevel;
  const xpProgress = (currentLevelXp / xpPerLevel) * 100;

  useEffect(() => {
    // ストリーク音を再生（画面表示時に1回だけ）
    if (user.streak_count > 0) {
      soundSystem.playStreak();
    }
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 card-shadow mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                こんにちは、{user.username}さん！
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <span className="text-2xl">🔥</span>
                </motion.div>
                <span className="text-xl font-bold text-orange-500">
                  {user.streak_count}日連続ログイン中！
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">レベル</div>
              <div className="text-5xl font-bold text-purple-600">{user.level}</div>
            </div>
          </div>

          {/* XPプログレスバー */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>XP: {currentLevelXp} / {xpPerLevel}</span>
              <span>次のレベルまであと {xpPerLevel - currentLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* 資産表示 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-400 to-green-600 rounded-3xl p-8 card-shadow mb-6 text-white"
        >
          <div className="text-center">
            <div className="text-xl font-bold mb-2">💰 現金残高</div>
            <div className="text-5xl font-bold">
              <CountUp value={asset?.cash_balance || 0} duration={1.5} />
            </div>
          </div>
        </motion.div>

        {/* アクションボタン */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => onNavigate('market')}
              className="w-full bg-white rounded-2xl p-6 card-shadow hover:shadow-2xl transition-shadow"
            >
              <div className="text-4xl mb-2">📈</div>
              <div className="text-xl font-bold text-gray-800">マーケット</div>
              <div className="text-sm text-gray-600">株を売買する</div>
            </button>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => onNavigate('quiz')}
              className="w-full bg-white rounded-2xl p-6 card-shadow hover:shadow-2xl transition-shadow"
            >
              <div className="text-4xl mb-2">🧠</div>
              <div className="text-xl font-bold text-gray-800">クイズ</div>
              <div className="text-sm text-gray-600">学んで報酬ゲット</div>
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => onNavigate('portfolio')}
              className="w-full bg-white rounded-2xl p-6 card-shadow hover:shadow-2xl transition-shadow"
            >
              <div className="text-4xl mb-2">💼</div>
              <div className="text-xl font-bold text-gray-800">ポートフォリオ</div>
              <div className="text-sm text-gray-600">保有株を確認</div>
            </button>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => onNavigate('history')}
              className="w-full bg-white rounded-2xl p-6 card-shadow hover:shadow-2xl transition-shadow"
            >
              <div className="text-4xl mb-2">📊</div>
              <div className="text-xl font-bold text-gray-800">取引履歴</div>
              <div className="text-sm text-gray-600">過去の取引を確認</div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ===== マーケット画面 =====
const MarketScreen = ({ user, onNavigate }) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market');
      const data = await response.json();
      setMarkets(data.markets);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">📈 マーケット</h1>
          <Button variant="outline" onClick={() => onNavigate('home')}>
            ← ホームに戻る
          </Button>
        </motion.div>

        {/* 銘柄リスト */}
        <div className="grid gap-4">
          {markets.map((market, index) => (
            <motion.div
              key={market.symbol}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                soundSystem.playNotification();
                setSelectedStock(market);
              }}
              className="bg-white rounded-2xl p-6 card-shadow cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{market.symbol}</div>
                  <div className="text-sm text-gray-600">{market.company_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {market.sector}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(market.current_price)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 株式購入モーダル */}
      <AnimatePresence>
        {selectedStock && (
          <TradeModal
            stock={selectedStock}
            userId={user.id}
            onClose={() => setSelectedStock(null)}
            onSuccess={() => {
              setSelectedStock(null);
              onNavigate('home');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== トレードモーダル =====
const TradeModal = ({ stock, userId, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLongPress, setIsLongPress] = useState(false);
  const [loading, setLoading] = useState(false);
  const longPressTimer = useRef(null);

  const totalCost = stock.current_price * quantity;

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      handleBuy();
    }, 1000);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setIsLongPress(false);
  };

  const handleBuy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trade/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          symbol: stock.symbol,
          quantity
        })
      });

      const data = await response.json();

      if (response.ok) {
        soundSystem.playPurchase(); // 購入音を再生
        createConfetti();
        alert(data.message);
        onSuccess();
      } else {
        soundSystem.playError(); // エラー音を再生
        alert(data.error || '購入に失敗しました');
      }
    } catch (err) {
      alert('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full card-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {stock.company_name}
        </h2>

        <div className="bg-purple-100 rounded-xl p-4 mb-6">
          <div className="text-sm text-purple-700 mb-1">現在価格</div>
          <div className="text-4xl font-bold text-purple-900">
            {formatCurrency(stock.current_price)}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            購入数量
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 bg-gray-200 rounded-xl font-bold text-2xl hover:bg-gray-300"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 text-center text-3xl font-bold border-2 border-gray-300 rounded-xl py-2"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 bg-gray-200 rounded-xl font-bold text-2xl hover:bg-gray-300"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-green-100 rounded-xl p-4 mb-6">
          <div className="text-sm text-green-700 mb-1">合計金額</div>
          <div className="text-3xl font-bold text-green-900">
            {formatCurrency(totalCost)}
          </div>
        </div>

        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-xl ${
              isLongPress ? 'bg-green-600' : 'bg-green-500'
            } text-white shadow-lg disabled:opacity-50`}
          >
            {loading ? '購入中...' : '長押しして購入'}
          </motion.button>
          <p className="text-xs text-gray-500 text-center mt-2">
            ボタンを1秒間長押しすると購入されます
          </p>
        </div>

        <Button variant="outline" onClick={onClose} className="w-full border-gray-300 text-gray-700 hover:bg-gray-100">
          キャンセル
        </Button>
      </motion.div>
    </motion.div>
  );
};

// ===== クイズ画面 =====
const QuizScreen = ({ user, onNavigate, onXpEarned }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz');
      const data = await response.json();
      setQuizzes(data.quizzes);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (selectedAnswer === null) return;

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          answerIndex: selectedAnswer
        })
      });

      const data = await response.json();
      setResult(data);

      if (data.correct) {
        soundSystem.playCoin(); // コイン獲得音を再生
        createConfetti();
        if (onXpEarned) {
          onXpEarned(data.xpReward);
        }
      } else {
        soundSystem.playError(); // エラー音を再生
      }
    } catch (err) {
      soundSystem.playError(); // エラー音を再生
      alert('エラーが発生しました');
    }
  };

  const handleNextQuiz = () => {
    setCurrentQuiz(null);
    setSelectedAnswer(null);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (currentQuiz) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 card-shadow"
          >
            {!result ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentQuiz.question}
                </h2>

                <div className="space-y-4 mb-6">
                  {currentQuiz.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full p-4 rounded-xl text-left font-medium border-2 transition-colors ${
                        selectedAnswer === index
                          ? 'border-purple-500 bg-purple-100 text-purple-900'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                <Button
                  onClick={handleAnswer}
                  variant="primary"
                  disabled={selectedAnswer === null}
                  className="w-full"
                >
                  回答する
                </Button>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center mb-6"
                >
                  <div className="text-8xl mb-4">
                    {result.correct ? '🎉' : '😢'}
                  </div>
                  <h2 className={`text-4xl font-bold ${result.correct ? 'text-green-600' : 'text-rose-600'}`}>
                    {result.correct ? '正解！' : '不正解...'}
                  </h2>
                </motion.div>

                <div className="bg-purple-100 rounded-xl p-6 mb-6">
                  <p className="text-gray-800">{result.explanation}</p>
                </div>

                {result.correct && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-100 rounded-xl p-4 text-center">
                      <div className="text-sm text-blue-700">獲得XP</div>
                      <div className="text-3xl font-bold text-blue-900">
                        +{result.xpReward}
                      </div>
                    </div>
                    <div className="bg-green-100 rounded-xl p-4 text-center">
                      <div className="text-sm text-green-700">獲得金額</div>
                      <div className="text-3xl font-bold text-green-900">
                        +{formatCurrency(result.cashReward)}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleNextQuiz}
                  variant="primary"
                  className="w-full"
                >
                  次のクイズへ
                </Button>
              </>
            )}
          </motion.div>

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => onNavigate('home')}>
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">🧠 クイズチャレンジ</h1>
          <Button variant="outline" onClick={() => onNavigate('home')}>
            ← ホームに戻る
          </Button>
        </motion.div>

        <div className="grid gap-4">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                soundSystem.playNotification();
                setCurrentQuiz(quiz);
              }}
              className="bg-white rounded-2xl p-6 card-shadow cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    クイズ {index + 1}
                  </h3>
                  <p className="text-gray-600">{quiz.question}</p>
                </div>
                <div className="text-4xl ml-4">📝</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== ポートフォリオ画面 =====
const PortfolioScreen = ({ user, onNavigate }) => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = async () => {
    try {
      const response = await fetch(`/api/holdings/${user.id}`);
      const data = await response.json();
      setHoldings(data.holdings);
    } catch (err) {
      console.error('Failed to fetch holdings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">💼 ポートフォリオ</h1>
          <Button variant="outline" onClick={() => onNavigate('home')}>
            ← ホームに戻る
          </Button>
        </motion.div>

        {holdings.length === 0 ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-12 card-shadow text-center"
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              まだ株を保有していません
            </h2>
            <p className="text-gray-600 mb-6">
              マーケットから株を購入してみましょう！
            </p>
            <Button onClick={() => onNavigate('market')}>
              マーケットへ
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {holdings.map((holding, index) => {
              const currentValue = holding.current_price * holding.quantity;
              const costBasis = holding.average_price * holding.quantity;
              const profit = currentValue - costBasis;
              const profitPercent = (profit / costBasis) * 100;

              return (
                <motion.div
                  key={holding.stock_symbol}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 card-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {holding.stock_symbol}
                      </div>
                      <div className="text-sm text-gray-600">
                        {holding.company_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {holding.sector}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">保有数</div>
                      <div className="text-3xl font-bold text-gray-800">
                        {holding.quantity}株
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-600">平均取得価格</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(holding.average_price)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">現在価格</div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(holding.current_price)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">評価損益</div>
                      <div className={`text-lg font-bold ${profit >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                        {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        <span className="text-sm ml-1">
                          ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== 取引履歴画面 =====
const HistoryScreen = ({ user, onNavigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions/${user.id}`);
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">📊 取引履歴</h1>
          <Button variant="outline" onClick={() => onNavigate('home')}>
            ← ホームに戻る
          </Button>
        </motion.div>

        {transactions.length === 0 ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-12 card-shadow text-center"
          >
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              取引履歴がありません
            </h2>
            <p className="text-gray-600">
              最初の取引を始めましょう！
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-2xl p-6 card-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl ${transaction.transaction_type === 'buy' ? 'text-green-500' : 'text-rose-500'}`}>
                      {transaction.transaction_type === 'buy' ? '📈' : '📉'}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">
                        {transaction.stock_symbol}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.company_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.created_at).toLocaleString('ja-JP')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${transaction.transaction_type === 'buy' ? 'text-green-600' : 'text-rose-600'}`}>
                      {transaction.transaction_type === 'buy' ? '購入' : '売却'}
                    </div>
                    <div className="text-lg text-gray-800">
                      {transaction.quantity}株 × {formatCurrency(transaction.price)}
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(transaction.total_amount)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== メインアプリケーション =====
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [user, setUser] = useState(null);
  const [asset, setAsset] = useState(null);
  const [buddyMood, setBuddyMood] = useState('happy');
  const [buddyMessage, setBuddyMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLogin = (userData, assetData) => {
    setUser(userData);
    setAsset(assetData);
    setCurrentScreen('home');
    setBuddyMood('excited');
    setBuddyMessage(`ようこそ、${userData.username}さん！`);
    soundSystem.playNotification(); // 通知音を再生
    setTimeout(() => setBuddyMessage(''), 3000);
  };

  const handleNavigate = (screen) => {
    soundSystem.playClick(); // ナビゲーション音を再生
    setCurrentScreen(screen);
  };

  const handleXpEarned = (xp) => {
    const oldLevel = Math.floor(user.xp / 1000) + 1;
    const newXp = user.xp + xp;
    const newLevel = Math.floor(newXp / 1000) + 1;
    
    setUser(prev => ({
      ...prev,
      xp: newXp
    }));

    // レベルアップチェック
    if (newLevel > oldLevel) {
      soundSystem.playLevelUp();
      setBuddyMood('celebrate');
      setBuddyMessage(`🎉 レベルアップ！レベル${newLevel}になりました！`);
      setTimeout(() => {
        setBuddyMood('happy');
        setBuddyMessage('');
      }, 3000);
    }
  };

  const toggleSound = () => {
    const enabled = soundSystem.toggle();
    setSoundEnabled(enabled);
    if (enabled) {
      soundSystem.playClick();
    }
  };

  return (
    <AppContext.Provider value={{ user, asset, buddyMood, setBuddyMood, buddyMessage, setBuddyMessage }}>
      <AnimatePresence mode="wait">
        {currentScreen === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthScreen onLogin={handleLogin} />
          </motion.div>
        )}

        {currentScreen === 'home' && user && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <HomeScreen user={user} asset={asset} onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentScreen === 'market' && user && (
          <motion.div
            key="market"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <MarketScreen user={user} onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentScreen === 'quiz' && user && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <QuizScreen user={user} onNavigate={handleNavigate} onXpEarned={handleXpEarned} />
          </motion.div>
        )}

        {currentScreen === 'portfolio' && user && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <PortfolioScreen user={user} onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentScreen === 'history' && user && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <HistoryScreen user={user} onNavigate={handleNavigate} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 相棒キャラクター */}
      {user && (
        <BuddyCharacter mood={buddyMood} message={buddyMessage} />
      )}

      {/* 音声トグルボタン */}
      {user && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSound}
          className="fixed bottom-4 left-4 z-50 bg-white rounded-full p-4 card-shadow cursor-pointer"
        >
          <div className="text-3xl">
            {soundEnabled ? '🔊' : '🔇'}
          </div>
        </motion.button>
      )}
    </AppContext.Provider>
  );
};

// アプリケーションのマウント
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
