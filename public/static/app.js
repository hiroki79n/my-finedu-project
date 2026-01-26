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

  // ボタンクリック音（剣を振る音）
  playClick() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'square';
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.08);
  }

  // 成功音（勝利のファンファーレ）
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const notes = [
      { freq: 523, time: 0, duration: 0.15 },      // C5
      { freq: 659, time: 0.15, duration: 0.15 },   // E5
      { freq: 784, time: 0.3, duration: 0.15 },    // G5
      { freq: 1047, time: 0.45, duration: 0.3 }    // C6
    ];
    
    notes.forEach(note => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.value = note.freq;
      
      const startTime = this.audioContext.currentTime + note.time;
      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);
    });
  }

  // エラー音（ダメージ音）
  playError() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.25);
  }

  // レベルアップ音（壮大なファンファーレ）
  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    const melody = [
      { freq: 392, time: 0 },      // G4
      { freq: 523, time: 0.1 },    // C5
      { freq: 659, time: 0.2 },    // E5
      { freq: 784, time: 0.3 },    // G5
      { freq: 1047, time: 0.4 },   // C6
      { freq: 1319, time: 0.5 }    // E6
    ];
    
    melody.forEach((note, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'triangle';
      
      const startTime = this.audioContext.currentTime + note.time;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  // コイン獲得音（宝箱を開ける音）
  playCoin() {
    if (!this.enabled) return;
    this.init();
    // キラキラ音のシーケンス
    const notes = [1000, 1200, 1500, 2000];
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      const startTime = this.audioContext.currentTime + index * 0.05;
      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  }

  // 通知音（クエスト発見音）
  playNotification() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'triangle';
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.25);
  }

  // 購入音（アイテムゲット音）
  playPurchase() {
    if (!this.enabled) return;
    this.init();
    // "タララン♪"というRPG風の音
    const notes = [659, 784, 1047]; // E5-G5-C6
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.value = freq;
      
      const startTime = this.audioContext.currentTime + index * 0.12;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
    });
  }

  // ストリーク音（炎の魔法音）
  playStreak() {
    if (!this.enabled) return;
    this.init();
    // 低音から高音へのスウィープ
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.35);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.35);
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
    <div className="min-h-screen max-w-md mx-auto flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 card-shadow max-w-md w-full border border-slate-700"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-4 font-black text-transparent bg-clip-text bg-gradient-to-r from-xesta-green via-xesta-blue to-xesta-green">
            ✕
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">XESTA</h1>
          <p className="text-xesta-green mt-2 font-semibold tracking-wide">Invest in the Unknown</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-300 font-bold">
              デモアカウントで自動ログイン中...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              ユーザー名: demo
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-xesta-red/10 border-2 border-xesta-red rounded-xl p-4 text-center">
              <p className="text-xesta-red font-bold">{error}</p>
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
const HomeScreen = ({ user, asset, onNavigate }) => {
  const [totalAssets, setTotalAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cash, setCash] = useState(0);

  useEffect(() => {
    fetchTotalAssets();
    
    // 画面表示時のサウンド
    if (user.streak_count > 0) {
      soundSystem.playStreak();
    }
  }, []);

  const fetchTotalAssets = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}/total-assets`);
      const data = await response.json();
      setTotalAssets(data);
      setCash(data.cash || 0);
    } catch (err) {
      console.error('Failed to fetch total assets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Context-Aware FAB の状態
  const needsToEarn = cash < 50000; // 5万円未満なら「稼ぐ」を推奨
  const fabColor = needsToEarn ? 'bg-blue-500' : 'bg-gradient-to-r from-orange-500 to-red-500';
  const fabIcon = needsToEarn ? '⚔️' : '📈';
  const fabText = needsToEarn ? 'クエストで稼ぐ' : 'XESTA市場へ';
  const fabAction = needsToEarn ? 'map' : 'market';

  const handleFabClick = () => {
    soundSystem.playClick();
    onNavigate(fabAction);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto pb-32">
      {/* XESTA ヘッダー */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center"
      >
        <div>
          <div className="text-3xl font-black text-white">
            ✕ XESTA
          </div>
          <div className="text-xs text-gray-400 italic">Invest in the Unknown</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400">🔥</span>
            <span className="text-sm font-bold text-yellow-300">{user.streak_count}日</span>
          </div>
          <div className="text-sm text-gray-300">
            Lv.<span className="text-white font-bold">{user.level}</span>
          </div>
        </div>
      </motion.div>

      {/* The Dual Engine: 3パネルレイアウト */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
          </div>
        ) : (
          <>
            {/* 資産タンク (Wallet) - 最上部 */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border-2 border-emerald-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">💰</span>
                  <div>
                    <div className="text-xs text-gray-400">資産タンク</div>
                    <div className="text-sm font-bold text-white">Total Wallet</div>
                  </div>
                </div>
                <button
                  onClick={fetchTotalAssets}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="text-xl">🔄</span>
                </button>
              </div>
              
              {/* 総資産 */}
              <div className="bg-gray-700/50 rounded-2xl p-4 mb-3">
                <div className="text-xs text-gray-400 mb-1">総資産 Total Assets</div>
                <div className="text-3xl font-black text-emerald-400">
                  <CountUp value={totalAssets?.totalAssets || 0} duration={1.5} />
                </div>
              </div>

              {/* 現金 / 株式 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/30 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">現金</div>
                  <div className="text-xl font-bold text-white">
                    <CountUp value={cash} duration={1} />
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">株式評価額</div>
                  <div className="text-xl font-bold text-blue-400">
                    <CountUp value={totalAssets?.stockValue || 0} duration={1} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* クエスト森 (Work) & 市場の城 (Invest) */}
            <div className="grid grid-cols-2 gap-3">
              {/* クエスト森 (Work) */}
              <motion.button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('map');
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  scale: needsToEarn ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  x: { delay: 0.2 },
                  scale: { duration: 1, repeat: Infinity, repeatDelay: 0.5 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${needsToEarn ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400' : 'bg-gradient-to-br from-blue-500/30 to-blue-600/30 border-blue-500/50'} rounded-2xl p-6 border-2 relative overflow-hidden`}
              >
                <div className="text-5xl mb-3">⚔️</div>
                <div className="text-sm font-bold text-white mb-1">クエストの森</div>
                <div className="text-xs text-blue-200">Quest Forest</div>
                <div className="text-xs text-white/80 mt-2">労働で稼ぐ</div>
                {needsToEarn && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold text-gray-900"
                  >
                    おすすめ
                  </motion.div>
                )}
              </motion.button>

              {/* 市場の城 (Invest) */}
              <motion.button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('market');
                }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  scale: !needsToEarn ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  x: { delay: 0.3 },
                  scale: { duration: 1, repeat: Infinity, repeatDelay: 0.5 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${!needsToEarn ? 'bg-gradient-to-br from-orange-600 to-red-600 border-red-400' : 'bg-gradient-to-br from-orange-500/30 to-red-600/30 border-red-500/50'} rounded-2xl p-6 border-2 relative overflow-hidden`}
              >
                <div className="text-5xl mb-3">🏛️</div>
                <div className="text-sm font-bold text-white mb-1">市場の城</div>
                <div className="text-xs text-orange-200">XESTA Market</div>
                <div className="text-xs text-white/80 mt-2">投資で増やす</div>
                {!needsToEarn && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold text-gray-900"
                  >
                    おすすめ
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* クイックアクション */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-2"
            >
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('portfolio');
                }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-2xl mb-1">💼</div>
                <div className="text-xs font-bold text-white">資産</div>
              </button>
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('history');
                }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xs font-bold text-white">履歴</div>
              </button>
              <button
                onClick={() => {
                  soundSystem.playClick();
                  onNavigate('settings');
                }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-2xl mb-1">⚙️</div>
                <div className="text-xs font-bold text-white">設定</div>
              </button>
            </motion.div>
          </>
        )}
      </div>

      {/* Context-Aware FAB */}
      <motion.div
        initial={{ y: 100, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-20 left-0 right-0 flex justify-center z-40"
      >
        <motion.button
          onClick={handleFabClick}
          animate={{ 
            boxShadow: needsToEarn 
              ? ['0 0 0 0 rgba(59,130,246,0.7)', '0 0 0 15px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0)']
              : ['0 0 0 0 rgba(249,115,22,0.7)', '0 0 0 15px rgba(249,115,22,0)', '0 0 0 0 rgba(249,115,22,0)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${fabColor} text-white px-8 py-4 rounded-full font-bold text-base shadow-2xl flex items-center gap-3`}
        >
          <span className="text-3xl">{fabIcon}</span>
          <span>{fabText}</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

// ===== マーケット画面 =====
const MarketScreen = ({ user, onNavigate }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'stocks', 'commodities', 'xpacks'

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market');
      const data = await response.json();
      setStocks(data.markets);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
    } finally {
      setLoading(false);
    }
  };

  // XESTAのカテゴリ分類
  const categories = {
    stocks: {
      name: 'Stocks',
      subtitle: '株式',
      icon: '📈',
      color: 'from-blue-600 to-blue-700',
      items: stocks.filter(s => !s.type || s.type.toUpperCase() === 'STOCK')
    },
    commodities: {
      name: 'Commodities',
      subtitle: '商品',
      icon: '⚡',
      color: 'from-yellow-600 to-orange-600',
      items: stocks.filter(s => s.type && s.type.toUpperCase() === 'COMMODITY')
    },
    xpacks: {
      name: 'X-Packs',
      subtitle: 'ETF',
      icon: '📦',
      color: 'from-purple-600 to-pink-600',
      items: stocks.filter(s => s.type && s.type.toUpperCase() === 'ETF')
    }
  };

  const getIcon = (symbol, sector) => {
    const iconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    return iconMap[symbol] || '🏢';
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto pb-24">
      {/* XESTAヘッダー */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            🏛️ XESTA Market
          </h1>
          <p className="text-xs text-gray-400 italic">未知なる投資の世界へ</p>
        </div>
        <button
          onClick={() => {
            soundSystem.playClick();
            onNavigate('home');
          }}
          className="text-white hover:text-gray-300"
        >
          <span className="text-2xl">✕</span>
        </button>
      </motion.div>

      <div className="p-4">
        {/* Bento Grid: 3つのカテゴリカード */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-6"
        >
          {/* Stocks カード (大きめ) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundSystem.playClick();
              setSelectedCategory('stocks');
            }}
            className={`bg-gradient-to-br ${categories.stocks.color} rounded-3xl p-6 cursor-pointer border-2 border-blue-400`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-5xl mb-2">{categories.stocks.icon}</div>
                <h2 className="text-2xl font-black text-white">{categories.stocks.name}</h2>
                <p className="text-sm text-blue-100">{categories.stocks.subtitle}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1">
                <span className="text-white font-bold">{categories.stocks.items.length}銘柄</span>
              </div>
            </div>
            <p className="text-xs text-white/80">個別企業の成長に投資</p>
          </motion.div>

          {/* Commodities と X-Packs を横並び */}
          <div className="grid grid-cols-2 gap-3">
            {/* Commodities カード */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundSystem.playClick();
                setSelectedCategory('commodities');
              }}
              className={`bg-gradient-to-br ${categories.commodities.color} rounded-2xl p-5 cursor-pointer border-2 border-yellow-400`}
            >
              <div className="text-4xl mb-2">{categories.commodities.icon}</div>
              <h3 className="text-lg font-black text-white">{categories.commodities.name}</h3>
              <p className="text-xs text-yellow-100 mb-2">{categories.commodities.subtitle}</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                <span className="text-xs text-white font-bold">{categories.commodities.items.length}銘柄</span>
              </div>
            </motion.div>

            {/* X-Packs カード */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundSystem.playClick();
                setSelectedCategory('xpacks');
              }}
              className={`bg-gradient-to-br ${categories.xpacks.color} rounded-2xl p-5 cursor-pointer border-2 border-purple-400`}
            >
              <div className="text-4xl mb-2">{categories.xpacks.icon}</div>
              <h3 className="text-lg font-black text-white">{categories.xpacks.name}</h3>
              <p className="text-xs text-purple-100 mb-2">{categories.xpacks.subtitle}</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                <span className="text-xs text-white font-bold">{categories.xpacks.items.length}銘柄</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* カテゴリが選択されたら銘柄リストを表示 */}
        {selectedCategory !== 'all' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {categories[selectedCategory].name}
              </h3>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-sm text-gray-300 hover:text-white"
              >
                ✕ 閉じる
              </button>
            </div>

            <div className="space-y-3">
              {categories[selectedCategory].items.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>このカテゴリにはまだ銘柄がありません</p>
                </div>
              ) : (
                categories[selectedCategory].items.map((item, index) => (
                  <motion.div
                    key={item.symbol}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      soundSystem.playNotification();
                      setSelectedAsset(item);
                    }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 cursor-pointer border border-gray-700 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">
                          {getIcon(item.symbol, item.sector)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{item.company_name}</div>
                          <div className="text-xs text-gray-400">{item.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">
                          {formatCurrency(item.current_price)}
                        </div>
                        <div className="text-xs text-gray-500">リアルタイム</div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* トレードモーダル */}
      <AnimatePresence>
        {selectedAsset && (
          <TradeModal
            stock={selectedAsset}
            userId={user.id}
            onClose={() => setSelectedAsset(null)}
            onSuccess={() => {
              setSelectedAsset(null);
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
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (currentQuiz) {
    return (
      <div className="min-h-screen max-w-md mx-auto p-6">
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
            <Button variant="outline" onClick={() => onNavigate('map')}>
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">🧠 クイズチャレンジ</h1>
          <Button variant="outline" onClick={() => onNavigate('map')}>
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
  const [completedQuests, setCompletedQuests] = useState([1]); // デモで1番目を完了扱い
  const [currentTab, setCurrentTab] = useState('map'); // map, news, settings

  // 学習ノード（Duolingoスタイル）
  const learningNodes = [
    { id: 1, level: 1, title: '株式って何？', type: 'lesson', icon: '📚', reward: 300, xp: 30, completed: true },
    { id: 2, level: 2, title: '株価の見方', type: 'lesson', icon: '📊', reward: 400, xp: 40, completed: false },
    { id: 3, level: 3, title: 'ミニクイズ', type: 'quiz', icon: '❓', reward: 500, xp: 50, completed: false },
    { id: 4, level: 4, title: '売買の基礎', type: 'lesson', icon: '💱', reward: 600, xp: 60, completed: false },
    { id: 5, level: 5, title: '企業分析入門', type: 'lesson', icon: '🔍', reward: 700, xp: 70, completed: false },
    { id: 6, level: 6, title: 'チャレンジ1', type: 'challenge', icon: '⚔️', reward: 1000, xp: 100, completed: false },
    { id: 7, level: 7, title: '配当金とは', type: 'lesson', icon: '💰', reward: 800, xp: 80, completed: false },
    { id: 8, level: 8, title: 'リスク管理', type: 'lesson', icon: '🛡️', reward: 900, xp: 90, completed: false },
    { id: 9, level: 9, title: 'ポートフォリオ', type: 'lesson', icon: '💼', reward: 1000, xp: 100, completed: false },
    { id: 10, level: 10, title: 'ボス戦', type: 'boss', icon: '👹', reward: 3000, xp: 300, completed: false }
  ];

  const handleNodeClick = (node) => {
    if (node.completed) return; // 完了済みは無視
    // 前のノードが完了していないとクリックできない
    const prevNode = learningNodes.find(n => n.id === node.id - 1);
    if (prevNode && !prevNode.completed && node.id > 1) {
      soundSystem.playError();
      return;
    }
    
    soundSystem.playNotification();
    setSelectedQuest(node);
  };

  const handleStartQuest = () => {
    soundSystem.playClick();
    setSelectedQuest(null);
    onNavigate('quiz');
  };

  const getNodeColor = (node) => {
    if (node.completed) return 'bg-green-600';
    if (node.type === 'boss') return 'bg-red-600';
    if (node.type === 'challenge') return 'bg-orange-600';
    return 'bg-blue-600';
  };

  const getNodeSize = (node) => {
    if (node.type === 'boss') return 'w-24 h-24 text-5xl';
    if (node.type === 'challenge') return 'w-20 h-20 text-4xl';
    return 'w-16 h-16 text-3xl';
  };

  // タブコンテンツをレンダリング
  const renderContent = () => {
    if (currentTab === 'news') {
      return (
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">📰 今日のニュース</h2>
          <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-300 mb-2">🚗 円安で自動車メーカーが注目</p>
            <p className="text-xs text-gray-400">トヨタやホンダの株価が上昇中です。</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-300 mb-2">📱 テクノロジー株が人気</p>
            <p className="text-xs text-gray-400">ソフトバンクグループに注目が集まっています。</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-300 mb-2">💊 製薬業界の新展開</p>
            <p className="text-xs text-gray-400">武田薬品の新薬開発が進んでいます。</p>
          </div>
        </div>
      );
    }

    if (currentTab === 'settings') {
      return (
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">⚙️ 設定</h2>
          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('settings');
            }}
            className="w-full bg-gray-800 text-gray-200 rounded-xl p-4 hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">マーケット更新設定</p>
                <p className="text-xs text-gray-400">更新間隔を調整する</p>
              </div>
              <span className="text-xl">→</span>
            </div>
          </button>
          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('portfolio');
            }}
            className="w-full bg-gray-800 text-gray-200 rounded-xl p-4 hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">ポートフォリオ</p>
                <p className="text-xs text-gray-400">資産状況を確認</p>
              </div>
              <span className="text-xl">→</span>
            </div>
          </button>
        </div>
      );
    }

    // デフォルトは冒険マップ
    return (
      <div className="flex-1 overflow-y-auto pb-24">
        {/* トップヘッダー */}
        <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-transparent z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="text-sm font-bold text-gray-200">{user.username}</p>
                <p className="text-xs text-gray-400">Lv.{user.level} | 🔥 {user.streak_count}日</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">総XP</p>
              <p className="text-lg font-bold text-yellow-400">{user.xp}</p>
            </div>
          </div>
        </div>

        {/* 学習パス（蛇行する道） */}
        <div className="relative px-6 py-8 max-w-md mx-auto min-h-[1200px]">
          {/* SVGで曲線の道を描画 */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} viewBox="0 0 400 1200">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4B5563', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#374151', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {learningNodes.map((node, index) => {
              if (index === learningNodes.length - 1) return null;
              
              const nextNode = learningNodes[index + 1];
              
              // 現在のノードと次のノードの位置を計算（絶対座標）
              const currentX = index % 3 === 0 ? 200 : (index % 3 === 1 ? 100 : 300);
              const nextX = (index + 1) % 3 === 0 ? 200 : ((index + 1) % 3 === 1 ? 100 : 300);
              
              const currentY = 80 + index * 110;
              const nextY = 80 + (index + 1) * 110;
              
              // ベジェ曲線で道を描画
              const midY = (currentY + nextY) / 2;
              const controlX = (currentX + nextX) / 2;
              
              return (
                <path
                  key={`path-${node.id}`}
                  d={`M ${currentX} ${currentY} Q ${controlX} ${midY}, ${nextX} ${nextY}`}
                  stroke="url(#pathGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={node.completed ? "none" : "10,5"}
                  opacity={node.completed ? "1" : "0.4"}
                />
              );
            })}
          </svg>

          {/* 学習ノード */}
          {learningNodes.map((node, index) => {
            const isLocked = !node.completed && index > 0 && !learningNodes[index - 1].completed;
            
            // 蛇行パターン: 中央(50%) → 左(25%) → 右(75%) → 中央(50%) → 左(25%) ...
            const xPosition = index % 3 === 0 ? 50 : (index % 3 === 1 ? 25 : 75);
            const yPosition = 80 + index * 110;
            
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                className="absolute"
                style={{ 
                  left: `${xPosition}%`,
                  top: `${yPosition}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  {/* ノードアイコン */}
                  <div 
                    onClick={() => !isLocked && handleNodeClick(node)}
                    className={`
                      ${getNodeSize(node)} 
                      ${getNodeColor(node)} 
                      ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:scale-125 active:scale-95'}
                      rounded-full flex items-center justify-center
                      transition-all shadow-2xl relative border-4 border-gray-900
                    `}
                    style={{
                      boxShadow: isLocked ? 'none' : '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {isLocked ? '🔒' : node.icon}
                    
                    {/* 完了チェック */}
                    {node.completed && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-green-500 rounded-full w-7 h-7 flex items-center justify-center text-white text-sm border-3 border-gray-900 shadow-lg"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>

                  {/* ノード情報カード */}
                  {!isLocked && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 shadow-2xl border border-gray-700 min-w-[140px] backdrop-blur-sm"
                    >
                      <p className="text-xs font-bold text-gray-100 mb-1.5 text-center">{node.title}</p>
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-yellow-300 font-semibold">+{node.xp}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-green-400">💰</span>
                          <span className="text-green-300 font-semibold">¥{node.reward}</span>
                        </span>
                      </div>
                      {node.type === 'boss' && (
                        <div className="mt-1 text-center">
                          <span className="text-xs text-red-400 font-bold">👹 BOSS</span>
                        </div>
                      )}
                      {node.type === 'challenge' && (
                        <div className="mt-1 text-center">
                          <span className="text-xs text-orange-400 font-bold">⚔️ 挑戦</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* ロック中の情報 */}
                  {isLocked && (
                    <div className="bg-gray-900 rounded-lg p-2 shadow-xl border border-gray-800 min-w-[100px]">
                      <p className="text-xs text-gray-500 text-center">ロック中</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* クエスト詳細モーダル */}
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedQuest(null)}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-3xl p-6 max-w-sm w-full"
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{selectedQuest.icon}</div>
                <h2 className="text-2xl font-bold text-gray-100 mb-2">{selectedQuest.title}</h2>
                <p className="text-sm text-gray-400">レベル {selectedQuest.level}</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">報酬</span>
                  <span className="text-green-400 font-bold">¥{selectedQuest.reward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">経験値</span>
                  <span className="text-yellow-400 font-bold">+{selectedQuest.xp} XP</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedQuest(null)}
                  className="flex-1 py-3 bg-gray-700 text-gray-200 rounded-xl font-bold hover:bg-gray-600"
                >
                  閉じる
                </button>
                <button
                  onClick={handleStartQuest}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg"
                >
                  開始！
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col max-w-md mx-auto">
      {/* メインコンテンツ */}
      {renderContent()}

      {/* ボトムナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
          <button
            onClick={() => {
              soundSystem.playClick();
              setCurrentTab('news');
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentTab === 'news' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-2xl">📰</span>
            <span className="text-xs font-medium">ニュース</span>
          </button>

          <button
            onClick={() => {
              soundSystem.playClick();
              setCurrentTab('map');
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentTab === 'map' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-2xl">🗺️</span>
            <span className="text-xs font-medium">マップ</span>
          </button>

          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('market');
            }}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
          >
            <span className="text-2xl">🏪</span>
            <span className="text-xs font-medium">マーケット</span>
          </button>

          <button
            onClick={() => {
              soundSystem.playClick();
              setCurrentTab('settings');
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentTab === 'settings' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-2xl">⚙️</span>
            <span className="text-xs font-medium">設定</span>
          </button>
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
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">💼 ポートフォリオ</h1>
          <Button variant="outline" onClick={() => onNavigate('map')}>
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
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto p-6">
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
              onNavigate('map');
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
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">📊 取引履歴</h1>
          <Button variant="outline" onClick={() => onNavigate('map')}>
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
    setCurrentScreen('home'); // XESTA The Dual Engine ホーム画面へ
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
