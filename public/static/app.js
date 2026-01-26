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
  const [username, setUsername] = useState('demo'); // 自動入力
  const [password, setPassword] = useState('demo123'); // 自動入力
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  // 自動ログイン
  useEffect(() => {
    if (!autoLoginAttempted) {
      setAutoLoginAttempted(true);
      // 0.5秒後に自動ログイン実行
      setTimeout(() => {
        handleAutoLogin();
      }, 500);
    }
  }, []);

  const handleAutoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'demo', password: 'demo123' })
      });

      const data = await response.json();

      if (response.ok) {
        soundSystem.playSuccess();
        onLogin(data.user, data.asset);
      } else {
        soundSystem.playError();
        setError('自動ログインに失敗しました。手動でログインしてください。');
      }
    } catch (err) {
      soundSystem.playError();
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

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
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-2">🌱</div>
          <h1 className="text-4xl font-bold text-purple-600">EcoMate</h1>
          <p className="text-gray-600 mt-2">楽しく学ぶ株式投資</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600 font-bold">
              デモアカウントで自動ログイン中...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ユーザー名: demo
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-center">
              <p className="text-red-600 font-bold">{error}</p>
            </div>
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

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-shadow"
              >
                手動ログイン
              </button>
            </form>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};
// ===== スマートボタンフック =====
const useSmartButton = (cash) => {
  const threshold = 1000;
  const needsToEarn = cash < threshold;
  
  return {
    needsToEarn,
    color: needsToEarn ? 'bg-blue-500' : 'bg-orange-500',
    hoverColor: needsToEarn ? 'hover:bg-blue-600' : 'hover:bg-orange-600',
    icon: needsToEarn ? '⚔️' : '📈',
    text: needsToEarn ? '冒険に出かけて稼ぐ！' : 'マーケットで投資する！',
    action: needsToEarn ? 'map' : 'market',
    animation: needsToEarn ? 'pulse' : 'sparkle'
  };
};

const HomeScreen = ({ user, asset, onNavigate }) => {
  const xpPerLevel = 1000;
  const currentLevelXp = user.xp % xpPerLevel;
  const xpProgress = (currentLevelXp / xpPerLevel) * 100;
  const [totalAssets, setTotalAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  useEffect(() => {
    // ストリーク音を再生（画面表示時に1回だけ）
    if (user.streak_count > 0) {
      soundSystem.playStreak();
    }
    
    // 総資産を取得
    fetchTotalAssets();
    
    // ログイン時のコインアニメーション
    setTimeout(() => setShowCoinAnimation(true), 500);
  }, []);

  const fetchTotalAssets = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}/total-assets`);
      const data = await response.json();
      setTotalAssets(data);
    } catch (err) {
      console.error('Failed to fetch total assets:', err);
    } finally {
      setLoading(false);
    }
  };

  // スマートボタンの状態
  const smartButton = useSmartButton(totalAssets?.cash || 0);

  const handleSmartAction = () => {
    soundSystem.playClick();
    if (smartButton.action === 'map') {
      onNavigate('map');
    } else {
      onNavigate('market');
    }
  };

  return (
    <div className="min-h-screen p-4 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* コンパクトヘッダー */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">
              {user.username}さん
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-bold text-yellow-300">
                {user.streak_count}日連続
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-300">レベル</div>
            <div className="text-4xl font-bold text-white">{user.level}</div>
          </div>
        </motion.div>

        {/* ダイナミック・ヒーローセクション: Cycle Visualizer */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 card-shadow mb-6"
        >
          <h3 className="text-center text-lg font-bold text-gray-800 mb-4">
            💼 キャッシュフローの循環
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner mx-auto"></div>
            </div>
          ) : (
            <div className="relative">
              {/* 循環フロー */}
              <div className="flex items-center justify-between mb-6">
                {/* 左: 冒険（稼ぐ） */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 text-center"
                >
                  <motion.div
                    animate={{ 
                      rotate: smartButton.needsToEarn ? [0, -10, 10, 0] : 0,
                      scale: smartButton.needsToEarn ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    className="text-6xl mb-2"
                  >
                    ⚔️
                  </motion.div>
                  <div className="text-sm font-bold text-blue-600">冒険で稼ぐ</div>
                </motion.div>

                {/* コイン飛翔アニメーション */}
                {showCoinAnimation && (
                  <motion.div
                    initial={{ x: -50, y: 0, opacity: 1, scale: 0.5 }}
                    animate={{ x: 0, y: -10, opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="absolute left-1/4 top-1/2 text-3xl"
                  >
                    💰
                  </motion.div>
                )}

                {/* 中央: お財布（現金） */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="flex-1 text-center relative z-10"
                >
                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 text-white">
                    <div className="text-4xl mb-1">💰</div>
                    <div className="text-xs opacity-90">現金</div>
                    <div className="text-2xl font-bold">
                      <CountUp value={totalAssets?.cash || 0} duration={1} />
                    </div>
                  </div>
                </motion.div>

                {/* コイン飛翔アニメーション（右向き） */}
                {showCoinAnimation && !smartButton.needsToEarn && (
                  <motion.div
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                    animate={{ x: 50, y: -10, opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="absolute right-1/4 top-1/2 text-3xl"
                  >
                    💰
                  </motion.div>
                )}

                {/* 右: 市場（投資） */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 text-center"
                >
                  <motion.div
                    animate={{ 
                      y: !smartButton.needsToEarn ? [0, -5, 0] : 0,
                      scale: !smartButton.needsToEarn ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    className="text-6xl mb-2"
                  >
                    🏛️
                  </motion.div>
                  <div className="text-sm font-bold text-orange-600">市場で投資</div>
                </motion.div>
              </div>

              {/* 矢印表示 */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-2xl text-blue-500">→</div>
                <div className="text-sm text-gray-600">お金の流れ</div>
                <div className="text-2xl text-orange-500">→</div>
              </div>

              {/* 総資産表示 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">総資産</div>
                <div className="text-3xl font-bold text-purple-600">
                  <CountUp value={totalAssets?.totalAssets || 0} duration={1.5} />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  株式評価額: <CountUp value={totalAssets?.stockValue || 0} duration={1} />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* クエスト＆ニュース・カード */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 gap-3 mb-6"
        >
          {/* 今日のニュース */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📰</span>
              <span className="text-sm font-bold text-blue-700">今日のニュース</span>
            </div>
            <p className="text-sm text-gray-700">
              円安で自動車メーカーが注目されています 🚗
            </p>
          </div>

          {/* デイリーミッション */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎯</span>
              <span className="text-sm font-bold text-green-700">デイリーミッション</span>
            </div>
            <p className="text-sm text-gray-700">
              あと1回クイズをクリアでボーナス！ ✨
            </p>
          </div>
        </motion.div>

        {/* サブアクション（小さめ） */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-2 mb-6"
        >
          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('portfolio');
            }}
            className="bg-white rounded-xl p-3 card-shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl mb-1">💼</div>
            <div className="text-xs font-bold text-gray-800">資産</div>
          </button>
          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('history');
            }}
            className="bg-white rounded-xl p-3 card-shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs font-bold text-gray-800">履歴</div>
          </button>
          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('settings');
            }}
            className="bg-white rounded-xl p-3 card-shadow hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl mb-1">⚙️</div>
            <div className="text-xs font-bold text-gray-800">設定</div>
          </button>
        </motion.div>
      </div>

      {/* スマート・アクションボタン (Context-Aware FAB) */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="fixed bottom-6 left-0 right-0 flex justify-center z-40"
      >
        <motion.button
          onClick={handleSmartAction}
          animate={
            smartButton.animation === 'pulse'
              ? { scale: [1, 1.05, 1] }
              : { boxShadow: ['0 0 0 0 rgba(255,165,0,0.7)', '0 0 0 10px rgba(255,165,0,0)', '0 0 0 0 rgba(255,165,0,0)'] }
          }
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${smartButton.color} ${smartButton.hoverColor} text-white px-8 py-5 rounded-full font-bold text-lg shadow-2xl flex items-center gap-3 transform hover:scale-105 transition-transform`}
        >
          <span className="text-3xl">{smartButton.icon}</span>
          <span>{smartButton.text}</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

// ===== マーケット画面 =====
const MarketScreen = ({ user, onNavigate }) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [updateInterval, setUpdateInterval] = useState(30000); // デフォルト30秒

  useEffect(() => {
    fetchMarketData();
    fetchUserSettings();
  }, []);

  useEffect(() => {
    // 更新間隔が変更されたら、インターバルを再設定
    const interval = setInterval(() => {
      updateMarketPrices();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}/settings`);
      const data = await response.json();
      setUpdateInterval((data.market_update_interval || 30) * 1000); // 秒をミリ秒に変換
    } catch (err) {
      console.error('Failed to fetch user settings:', err);
    }
  };

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

  const updateMarketPrices = async () => {
    try {
      await fetch('/api/market/tick', { method: 'POST' });
      await fetchMarketData();
    } catch (err) {
      console.error('Failed to update market prices:', err);
    }
  };

  // 企業アイコンマッピング（Lucide Reactの絵文字で代用）
  const getCompanyIcon = (symbol, sector) => {
    const iconMap = {
      '7974': '🎮', // 任天堂 - ゲーム
      '7203': '🚗', // トヨタ - 自動車
      '9983': '👕', // ファーストリテイリング - アパレル
      '4704': '🛡️', // トレンドマイクロ - セキュリティ
      '4689': '💬', // LINEヤフー - 通信
      '4755': '🛒', // 楽天 - EC
      '6758': '🎵', // ソニー - エンタメ
      '9984': '📱', // ソフトバンク - 通信
      '4502': '💊', // 武田薬品 - 医薬品
      '2914': '🍃', // JT - 食品
      '4568': '⚕️', // 第一三共 - 医薬品
      '6098': '💼', // リクルート - 人材
    };
    return iconMap[symbol] || '🏢';
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
                <div className="flex items-center gap-4">
                  {/* 企業アイコン */}
                  <div className="text-5xl">
                    {getCompanyIcon(market.symbol, market.sector)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-gray-800">{market.company_name}</div>
                      <div className="text-sm text-gray-500">({market.symbol})</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {market.sector}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">
                    {formatCurrency(market.current_price)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    リアルタイム株価
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

  // 企業アイコンマッピング
  const getCompanyIcon = (symbol) => {
    const iconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    return iconMap[symbol] || '🏢';
  };

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
        <div className="flex items-center gap-4 mb-6">
          <div className="text-6xl">
            {getCompanyIcon(stock.symbol)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {stock.company_name}
            </h2>
            <div className="text-sm text-gray-500">証券コード: {stock.symbol}</div>
          </div>
        </div>

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

// ===== 冒険マップ画面 (MapScreen) =====
const MapScreen = ({ user, onNavigate, onXpEarned }) => {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [totalAssets, setTotalAssets] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchTotalAssets();
  }, []);

  const fetchTotalAssets = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}/total-assets`);
      const data = await response.json();
      setTotalAssets(data);
    } catch (err) {
      console.error('Failed to fetch total assets:', err);
    }
  };

  // 冒険クエストリスト
  const quests = [
    {
      id: 1,
      title: '株式投資の基礎',
      icon: '📚',
      difficulty: 'easy',
      reward: 500,
      xpReward: 50,
      description: 'クイズに挑戦して株式投資の基礎を学ぼう！'
    },
    {
      id: 2,
      title: 'マーケット探検',
      icon: '🗺️',
      difficulty: 'medium',
      reward: 1000,
      xpReward: 100,
      description: '市場を探検してトレンドを見つけよう！'
    },
    {
      id: 3,
      title: 'ボスチャレンジ',
      icon: '👹',
      difficulty: 'hard',
      reward: 2000,
      xpReward: 200,
      description: '最強のクイズに挑戦！大きな報酬が待っている！'
    }
  ];

  const handleQuestClick = (quest) => {
    soundSystem.playNotification();
    setSelectedQuest(quest);
  };

  const handleStartQuest = () => {
    soundSystem.playClick();
    // クイズ画面へ遷移
    onNavigate('quiz');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '初級';
      case 'medium': return '中級';
      case 'hard': return '上級';
      default: return '？？？';
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダーメニュー */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl p-4 card-shadow mb-6"
        >
          <div className="flex justify-between items-center">
            {/* 左側: ユーザー情報 */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌱</div>
              <div>
                <div className="font-bold text-gray-800">{user.username}</div>
                <div className="text-xs text-gray-600">Lv.{user.level} | {user.streak_count}日連続</div>
              </div>
            </div>

            {/* 右側: メニューボタン */}
            <div className="flex items-center gap-2">
              {/* 資産状況 */}
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('portfolio');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold hover:bg-green-100 transition-colors"
              >
                <span>💰</span>
                <div className="text-left">
                  <div className="text-xs opacity-75">資産</div>
                  <div className="text-sm">
                    {totalAssets ? formatCurrency(totalAssets.totalAssets) : '---'}
                  </div>
                </div>
              </button>

              {/* メニュートグル */}
              <button
                onClick={() => {
                  soundSystem.playClick();
                  setShowMenu(!showMenu);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>

          {/* ドロップダウンメニュー */}
          {showMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 space-y-2"
            >
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('market');
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-700 rounded-xl font-bold hover:bg-orange-100 transition-colors text-left"
              >
                <span className="text-2xl">📈</span>
                <div>
                  <div className="font-bold">マーケット</div>
                  <div className="text-xs opacity-75">株式を売買する</div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('portfolio');
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-colors text-left"
              >
                <span className="text-2xl">💼</span>
                <div>
                  <div className="font-bold">ポートフォリオ</div>
                  <div className="text-xs opacity-75">保有株を確認</div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('history');
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-bold hover:bg-purple-100 transition-colors text-left"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <div className="font-bold">取引履歴</div>
                  <div className="text-xs opacity-75">過去の取引を確認</div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('settings');
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors text-left"
              >
                <span className="text-2xl">⚙️</span>
                <div>
                  <div className="font-bold">設定</div>
                  <div className="text-xs opacity-75">アプリ設定を調整</div>
                </div>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* ニュースカード */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-l-4 border-blue-500 mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📰</span>
            <span className="text-sm font-bold text-blue-700">今日のニュース</span>
          </div>
          <p className="text-sm text-gray-700">
            円安で自動車メーカーが注目されています 🚗
          </p>
        </motion.div>

        {/* 冒険タイトル */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
            <span>🗺️</span>
            <span>冒険マップ</span>
          </h1>
          <p className="text-white opacity-75">クエストをクリアして報酬をゲットしよう！</p>
        </motion.div>

        {/* クエストリスト */}
        <div className="space-y-4">
          {quests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => handleQuestClick(quest)}
              className="bg-white rounded-2xl p-6 card-shadow hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{quest.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-800">{quest.title}</h3>
                      <span className={`${getDifficultyColor(quest.difficulty)} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                        {getDifficultyText(quest.difficulty)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span>💰</span>
                        <span className="font-bold text-green-600">{formatCurrency(quest.reward)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span className="font-bold text-blue-600">+{quest.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-2xl text-gray-400">→</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* クエスト詳細モーダル */}
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedQuest(null)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full card-shadow"
            >
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{selectedQuest.icon}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedQuest.title}
                </h2>
                <span className={`${getDifficultyColor(selectedQuest.difficulty)} text-white text-sm px-3 py-1 rounded-full font-bold`}>
                  {getDifficultyText(selectedQuest.difficulty)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="text-gray-700 mb-4">{selectedQuest.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">報酬（現金）</span>
                    <span className="font-bold text-green-600 text-xl">
                      {formatCurrency(selectedQuest.reward)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">経験値</span>
                    <span className="font-bold text-blue-600 text-xl">
                      +{selectedQuest.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedQuest(null)}
                  className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleStartQuest}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl transition-shadow"
                >
                  挑戦する！
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
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

  // 企業アイコンマッピング
  const getCompanyIcon = (symbol) => {
    const iconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    return iconMap[symbol] || '🏢';
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
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">
                        {getCompanyIcon(holding.stock_symbol)}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {holding.company_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          証券コード: {holding.stock_symbol}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {holding.sector}
                          </span>
                        </div>
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

// ===== 設定画面 =====
const SettingsScreen = ({ user, onNavigate }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(30);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}/settings`);
      const data = await response.json();
      setSettings(data);
      setUpdateInterval(data.market_update_interval || 30);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    soundSystem.playClick();
    try {
      const response = await fetch(`/api/user/${user.id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market_update_interval: updateInterval
        })
      });
      
      if (response.ok) {
        soundSystem.playSuccess();
        createConfetti();
        alert('✅ 設定を保存しました！');
      } else {
        soundSystem.playError();
        alert('❌ 設定の保存に失敗しました');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      soundSystem.playError();
      alert('❌ エラーが発生しました');
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-800">
            ⚙️ 設定
          </h1>
          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('home');
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
          >
            ← 戻る
          </button>
        </motion.div>

        {/* マーケット更新設定 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 card-shadow mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📈 マーケット更新設定
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                株価の自動更新間隔（秒）
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="10"
                  value={updateInterval}
                  onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                  className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((updateInterval - 10) / 110) * 100}%, #e5e7eb ${((updateInterval - 10) / 110) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="w-20 text-center">
                  <span className="text-3xl font-bold text-blue-600">{updateInterval}</span>
                  <span className="text-gray-600 ml-1">秒</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {updateInterval <= 20 && '⚡ 超高速更新 - リアルタイムに近い体験'}
                {updateInterval > 20 && updateInterval <= 40 && '🚀 高速更新 - アクティブな取引に最適'}
                {updateInterval > 40 && updateInterval <= 80 && '⏱️ 標準更新 - バランスの取れた設定'}
                {updateInterval > 80 && '🐢 低速更新 - じっくり考えたい方向け'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 資産更新設定 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 card-shadow mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            💰 資産評価設定
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📊</span>
                <div>
                  <div className="font-bold text-gray-800">総資産の計算</div>
                  <div className="text-sm text-gray-600">リアルタイムで自動計算されます</div>
                </div>
              </div>
              <div className="text-gray-700 text-sm leading-relaxed">
                総資産 = 現金残高 + 株式評価額<br/>
                株式評価額 = 各銘柄の（保有数量 × 現在価格）の合計<br/>
                <span className="text-blue-600 font-bold">※ 株価の変動に応じて自動的に更新されます</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 保存ボタン */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-xl hover:shadow-2xl transition-shadow disabled:opacity-50"
          >
            {saving ? '保存中...' : '💾 設定を保存'}
          </button>
        </motion.div>

        {/* 設定情報 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-purple-50 rounded-2xl p-6"
        >
          <h3 className="font-bold text-gray-800 mb-2">💡 ヒント</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 更新間隔を短くすると、より活発な市場体験ができます</li>
            <li>• 総資産は株価の変動に応じて自動的に再計算されます</li>
            <li>• 設定はいつでも変更可能です</li>
          </ul>
        </motion.div>
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

  // 企業アイコンマッピング
  const getCompanyIcon = (symbol) => {
    const iconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    return iconMap[symbol] || '🏢';
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
                    <div className="text-4xl">
                      {getCompanyIcon(transaction.stock_symbol)}
                    </div>
                    <div className={`text-3xl ${transaction.transaction_type === 'buy' ? 'text-green-500' : 'text-rose-500'}`}>
                      {transaction.transaction_type === 'buy' ? '📈' : '📉'}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-800">
                        {transaction.company_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        証券コード: {transaction.stock_symbol}
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
    setCurrentScreen('map'); // トップページを冒険マップに変更
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

        {currentScreen === 'map' && user && (
          <motion.div
            key="map"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <MapScreen user={user} onNavigate={handleNavigate} onXpEarned={handleXpEarned} />
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

        {currentScreen === 'settings' && user && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <SettingsScreen user={user} onNavigate={handleNavigate} />
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
