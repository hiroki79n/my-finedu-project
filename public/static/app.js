// グローバル変数でReact、ReactDOM、Framer Motionを利用可能にする
const { useState, useEffect, useRef, createContext, useContext } = React;
const { motion, AnimatePresence } = Motion;

// ===== コンテキスト =====
const AppContext = createContext();
const ThemeContext = createContext();

const useApp = () => useContext(AppContext);
const useTheme = () => useContext(ThemeContext);

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

// ===== テーマシステム =====
const themes = {
  cyber: {
    name: 'Cyber X',
    colors: {
      primary: '#10B981',      // Neon Green
      secondary: '#3B82F6',    // Electric Blue
      danger: '#F43F5E',       // Neon Red
      background: '#0F172A',   // Deep Space
      surface: '#1E293B',      // Dark Slate
      text: '#F1F5F9',         // Light Gray
      textSecondary: '#94A3B8' // Muted Gray
    },
    fonts: {
      primary: 'Inter, sans-serif',
      heading: 'Inter, sans-serif'
    },
    borderRadius: '0.5rem',
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      glow: '0 0 20px rgba(16, 185, 129, 0.5)'
    }
  },
  pop: {
    name: 'Pop X',
    colors: {
      primary: '#EC4899',      // Pink
      secondary: '#8B5CF6',    // Purple
      danger: '#F97316',       // Orange
      background: '#FFF7ED',   // Cream
      surface: '#FFFFFF',      // White
      text: '#1F2937',         // Dark Gray
      textSecondary: '#6B7280' // Medium Gray
    },
    fonts: {
      primary: 'Quicksand, Inter, sans-serif',
      heading: 'Quicksand, Inter, sans-serif'
    },
    borderRadius: '1.5rem',
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 8px -2px rgb(0 0 0 / 0.15)',
      lg: '0 12px 20px -4px rgb(0 0 0 / 0.2)',
      glow: '0 0 25px rgba(236, 72, 153, 0.4)'
    }
  }
};

const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('cyber');
  
  useEffect(() => {
    // ローカルストレージからテーマを読み込む
    const savedTheme = localStorage.getItem('xesta_theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'cyber' ? 'pop' : 'cyber';
    setCurrentTheme(newTheme);
    localStorage.setItem('xesta_theme', newTheme);
    soundSystem.playClick();
  };

  const theme = themes[currentTheme];

  // CSS変数を設定
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // body classの更新
    body.className = `theme-${currentTheme}`;
    
    // CSS変数の更新
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    root.style.setProperty('--font-primary', theme.fonts.primary);
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--border-radius', theme.borderRadius);
  }, [theme, currentTheme]);

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, currentTheme, toggleTheme, themes } },
    children
  );
};

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
  const [cityItems, setCityItems] = useState([]);
  const { theme, currentTheme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchTotalAssets();
    
    // 画面表示時のサウンド
    if (user.streak_count > 0) {
      soundSystem.playStreak();
    }
  }, []);

  useEffect(() => {
    if (totalAssets) {
      fetchCityItems();
    }
  }, [totalAssets]);

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

  const fetchCityItems = async () => {
    try {
      // 利益に応じてアンロックされたアイテムを計算
      const profit = totalAssets ? totalAssets.totalAssets - 1000000 : 0;
      const unlockedItems = [];
      
      // シンプルなアンロック条件（プロトタイプ）
      if (profit >= 1000) unlockedItems.push({ id: 'cafe_001', icon: '☕', name: 'カフェ' });
      if (profit >= 5000) unlockedItems.push({ id: 'park_001', icon: '🌳', name: '公園' });
      if (profit >= 10000) unlockedItems.push({ id: 'tower_001', icon: '🗼', name: 'タワー' });
      if (profit >= 50000) unlockedItems.push({ id: 'ferris_001', icon: '🎡', name: '観覧車' });
      if (profit >= 100000) unlockedItems.push({ id: 'castle_001', icon: '🏰', name: '城' });
      
      setCityItems(unlockedItems);
    } catch (err) {
      console.error('Failed to fetch city items:', err);
    }
  };

  // needsToEarnの計算（閾値: 1000円）
  const needsToEarn = cash < 1000;

  // FAB: 今日のニュース（常に表示）
  const fabColor = 'bg-gradient-to-r from-blue-600 to-cyan-600';
  const fabIcon = '📰';
  const fabText = '今日のニュース';

  const handleFabClick = () => {
    soundSystem.playClick();
    onNavigate('news');
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
        <div className="flex items-center gap-4">
          {/* テーマ切り替えボタン */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.95 }}
            className="text-2xl hover:scale-110 transition-transform"
            title={`Switch to ${currentTheme === 'cyber' ? 'Pop X' : 'Cyber X'}`}
          >
            {currentTheme === 'cyber' ? '🌸' : '⚡'}
          </motion.button>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400">🔥</span>
              <span className="text-sm font-bold text-yellow-300">{user.streak_count}日</span>
            </div>
            <div className="text-sm text-gray-300">
              Lv.<span className="text-white font-bold">{user.level}</span>
            </div>
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

      {/* My City (Sanctuary) セクション */}
      {cityItems.length > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-24 right-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl max-w-xs z-30"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏙️</span>
            <div>
              <div className="text-xs text-white/80">あなたの街</div>
              <div className="text-sm font-bold text-white">My City</div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2">
              {cityItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white/20 rounded-lg p-2 text-center"
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs text-white font-medium">{item.name}</div>
                </motion.div>
              ))}
            </div>
            {cityItems.length < 5 && (
              <div className="text-xs text-white/70 mt-2 text-center">
                💰 利益を出してもっと建物を集めよう！
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 今日のニュース FAB */}
      <motion.div
        initial={{ y: 100, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-20 left-0 right-0 flex justify-center z-40"
      >
        <motion.button
          onClick={handleFabClick}
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(37,99,235,0.7)', '0 0 0 15px rgba(37,99,235,0)', '0 0 0 0 rgba(37,99,235,0)']
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

// ===== ニュース画面 =====
const NewsScreen = ({ user, onNavigate }) => {
  // 今日のニュース（サンプルデータ）
  const newsItems = [
    {
      id: 1,
      category: '為替',
      icon: '💱',
      title: '円安進行で輸出関連株に注目',
      description: '1ドル=150円台に突入。自動車メーカーや電機メーカーの業績改善が期待されています。',
      impact: 'positive',
      stocks: ['トヨタ自動車', '任天堂', 'ソニーグループ'],
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-400'
    },
    {
      id: 2,
      category: 'コモディティ',
      icon: '⚡',
      title: '金価格が過去最高値を更新',
      description: '世界的な不安定要因により、安全資産としての金への需要が高まっています。',
      impact: 'neutral',
      stocks: ['金', '銀'],
      color: 'from-yellow-500 to-amber-600',
      borderColor: 'border-yellow-400'
    },
    {
      id: 3,
      category: 'テクノロジー',
      icon: '🤖',
      title: 'AI関連企業の株価が急騰',
      description: '生成AIの普及により、関連企業への投資が加速。今後の成長が期待されています。',
      impact: 'positive',
      stocks: ['ソフトバンクグループ', 'LINEヤフー'],
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-400'
    },
    {
      id: 4,
      category: '製薬',
      icon: '💊',
      title: '新薬開発で製薬株に期待',
      description: '武田薬品や第一三共の新薬治験が順調に進行。承認されれば大きな収益が見込まれます。',
      impact: 'positive',
      stocks: ['武田薬品', '第一三共'],
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-400'
    },
    {
      id: 5,
      category: '小売',
      icon: '🛒',
      title: 'インフレ懸念で消費関連株が軟調',
      description: '物価上昇により消費者の購買力が低下。小売・アパレル業界に逆風が吹いています。',
      impact: 'negative',
      stocks: ['ファーストリテイリング', '楽天グループ'],
      color: 'from-red-500 to-rose-600',
      borderColor: 'border-red-400'
    }
  ];

  const getImpactBadge = (impact) => {
    if (impact === 'positive') return { text: '📈 上昇期待', color: 'bg-green-500' };
    if (impact === 'negative') return { text: '📉 下落懸念', color: 'bg-red-500' };
    return { text: '➡️ 中立', color: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-24">
      {/* ヘッダー */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 z-20 border-b border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              📰 今日のニュース
            </h1>
            <p className="text-xs text-gray-400 italic">市場を動かすトピックス</p>
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
        </div>
      </motion.div>

      {/* ニュース一覧 */}
      <div className="p-4 space-y-4">
        {newsItems.map((news, index) => {
          const badge = getImpactBadge(news.impact);
          
          return (
            <motion.div
              key={news.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${news.color} rounded-2xl p-5 border-2 ${news.borderColor}`}
            >
              {/* カテゴリと影響度 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{news.icon}</span>
                  <span className="text-xs font-bold text-white/80">{news.category}</span>
                </div>
                <div className={`${badge.color} text-white text-xs px-3 py-1 rounded-full font-bold`}>
                  {badge.text}
                </div>
              </div>

              {/* タイトル */}
              <h2 className="text-lg font-bold text-white mb-2">
                {news.title}
              </h2>

              {/* 説明 */}
              <p className="text-sm text-white/80 mb-3 leading-relaxed">
                {news.description}
              </p>

              {/* 関連銘柄 */}
              <div className="bg-black/20 rounded-xl p-3">
                <p className="text-xs text-white/70 mb-2">🔍 関連銘柄</p>
                <div className="flex flex-wrap gap-2">
                  {news.stocks.map((stock, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-lg"
                    >
                      {stock}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* マーケットへのCTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-20 left-0 right-0 px-4 max-w-md mx-auto"
      >
        <button
          onClick={() => {
            soundSystem.playClick();
            onNavigate('market');
          }}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-full font-bold text-base shadow-2xl hover:shadow-orange-500/50 transition-shadow"
        >
          🏛️ XESTA市場で取引する
        </button>
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

  const getIcon = (symbol, sector, type) => {
    // 株式アイコン
    const stockIconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    
    // Commoditiesアイコン
    const commodityIconMap = {
      'GOLD': '🥇',
      'SILVER': '🥈',
      'CRUDE': '🛢️',
      'PLATINUM': '⚪',
      'COPPER': '🟤'
    };
    
    // ETF Packsアイコン
    const etfIconMap = {
      'AI-PACK': '🤖',
      'GREEN-PACK': '🌾',
      'GAME-PACK': '🎮',
      'HEALTH-PACK': '💊',
      'AUTO-PACK': '🚗'
    };
    
    if (type === 'COMMODITY') {
      return commodityIconMap[symbol] || '⚡';
    }
    
    if (type === 'ETF') {
      return etfIconMap[symbol] || '📦';
    }
    
    return stockIconMap[symbol] || '🏢';
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
                          {getIcon(item.symbol, item.sector, item.type)}
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
  const [supportMode, setSupportMode] = useState(false); // 応援モード
  const longPressTimer = useRef(null);

  const totalCost = stock.current_price * quantity;

  // 企業アイコンマッピング
  const getCompanyIcon = (symbol, type = 'STOCK') => {
    // 株式アイコン
    const stockIconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    
    // Commoditiesアイコン
    const commodityIconMap = {
      'GOLD': '🥇',
      'SILVER': '🥈',
      'CRUDE': '🛢️',
      'PLATINUM': '⚪',
      'COPPER': '🟤'
    };
    
    // ETF Packsアイコン
    const etfIconMap = {
      'AI-PACK': '🤖',
      'GREEN-PACK': '🌾',
      'GAME-PACK': '🎮',
      'HEALTH-PACK': '💊',
      'AUTO-PACK': '🚗'
    };
    
    if (type === 'COMMODITY') {
      return commodityIconMap[symbol] || '⚡';
    }
    
    if (type === 'ETF') {
      return etfIconMap[symbol] || '📦';
    }
    
    return stockIconMap[symbol] || '🏢';
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
        if (supportMode) {
          // 応援モード: ハートエフェクト
          createHearts();
          soundSystem.playSuccess();
        } else {
          // 通常モード: コンフェッティと購入音
          soundSystem.playPurchase();
          createConfetti();
        }
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

  // ハートエフェクト関数
  const createHearts = () => {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = '100vh';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.animation = 'heart-float 3s ease-out forwards';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        document.body.appendChild(heart);
        
        setTimeout(() => {
          heart.remove();
        }, 3000);
      }, i * 50);
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
            {getCompanyIcon(stock.symbol, stock.type)}
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

        {/* ETFパックの説明（descriptionがある場合） */}
        {stock.description && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
            <div className="text-sm font-bold text-blue-800 mb-2">📦 パック内容</div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {stock.description.replace(/【/g, '\n【').trim()}
            </div>
          </div>
        )}

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

        {/* 応援モード切り替え */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={() => setSupportMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              !supportMode 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <span>💰</span>
            <span>通常購入</span>
          </button>
          <button
            onClick={() => setSupportMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              supportMode 
                ? 'bg-pink-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <span>💖</span>
            <span>応援投資</span>
          </button>
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
              supportMode
                ? isLongPress ? 'bg-pink-600' : 'bg-pink-500'
                : isLongPress ? 'bg-green-600' : 'bg-green-500'
            } text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (
              '処理中...'
            ) : (
              <>
                <span className="text-2xl">{supportMode ? '💖' : '💰'}</span>
                <span>{supportMode ? '応援購入' : '長押しして購入'}</span>
              </>
            )}
          </motion.button>
          <p className="text-xs text-gray-500 text-center mt-2">
            {supportMode 
              ? 'ボタンを1秒間長押しして応援！ハートエフェクトで祝福します✨' 
              : 'ボタンを1秒間長押しすると購入されます'}
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
const QuizScreen = ({ user, onNavigate, onXpEarned, questId }) => {
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
      // questIdが指定されている場合は、そのクイズだけをフィルタ
      if (questId) {
        const filteredQuiz = data.quizzes.find(q => q.id === questId);
        setQuizzes(filteredQuiz ? [filteredQuiz] : []);
        if (filteredQuiz) {
          setCurrentQuiz(filteredQuiz);
        }
      } else {
        setQuizzes(data.quizzes);
      }
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
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-purple-600 mb-2">
                    {currentQuiz.title || `クイズ ${currentQuiz.id}`}
                  </h3>
                </div>
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
                  onClick={() => onNavigate('map')}
                  variant="primary"
                  className="w-full"
                >
                  マップに戻る
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
const MapScreen = ({ user, onNavigate, onXpEarned, setSelectedQuestId }) => {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([101]); // デモで最初のクエストを完了扱い

  // Chapter構造データ（後から変更可能）
  const chapters = [
    {
      id: 1,
      title: '価値の誕生と交換',
      subtitle: 'Origin',
      stage: 'はじまりの孤島',
      icon: '🏝️',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-400',
      difficulty: 1,
      type: 'main', // メインクエスト
      quests: [
        { id: 101, title: '物々交換の限界', type: 'simulation', icon: '🐟', reward: 300, xp: 30, description: '魚と肉を交換せよ' },
        { id: 102, title: '貝殻からコインへ', type: 'lesson', icon: '🐚', reward: 400, xp: 40, description: 'なぜ腐らないものがお金に？' },
        { id: 103, title: '信用の魔法', type: 'quiz', icon: '📜', reward: 500, xp: 50, description: '紙幣が便利な理由' }
      ],
      boss: { id: 199, name: 'インフレ・スライム', icon: '🫧', reward: 1000, xp: 100, description: 'お金が増えすぎると価値が下がる！' }
    },
    {
      id: 2,
      title: '労働と社会の歯車',
      subtitle: 'Society',
      stage: 'ギルドの街',
      icon: '🏛️',
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-400',
      difficulty: 2,
      type: 'main',
      quests: [
        { id: 201, title: '仕事選び', type: 'lesson', icon: '💼', reward: 600, xp: 60, description: '会社員、公務員、起業家…' },
        { id: 202, title: '生活費サバイバル', type: 'simulation', icon: '🏠', reward: 700, xp: 70, description: '可処分所得を計算せよ' },
        { id: 203, title: '銀行の金庫', type: 'lesson', icon: '🏦', reward: 800, xp: 80, description: '金利でお金が増える仕組み' }
      ],
      boss: { id: 299, name: '浪費モンスター', icon: '💳', reward: 1500, xp: 150, description: 'クレジットカードの罠！' }
    },
    {
      id: 3,
      title: '企業の森と株式会社',
      subtitle: 'Enterprise',
      stage: 'カンパニー・フォレスト',
      icon: '🌲',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-400',
      difficulty: 3,
      type: 'main',
      quests: [
        { id: 301, title: 'ピザ屋を創業せよ', type: 'simulation', icon: '🍕', reward: 900, xp: 90, description: '株券を発行して仲間を集める' },
        { id: 302, title: '株価の変動', type: 'lesson', icon: '📈', reward: 1000, xp: 100, description: '需要と業績で値段が変わる' },
        { id: 303, title: '配当の果実', type: 'quiz', icon: '💰', reward: 1100, xp: 110, description: 'インカムゲインの喜び' }
      ],
      boss: { id: 399, name: '赤字ドラゴン', icon: '🐉', reward: 2000, xp: 200, description: '倒産すると株が紙切れに！' }
    },
    {
      id: 4,
      title: '世界市場とリスク',
      subtitle: 'Global Market',
      stage: '為替の海',
      icon: '🌊',
      color: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-400',
      difficulty: 4,
      type: 'main',
      quests: [
        { id: 401, title: 'ハンバーガーの値段', type: 'lesson', icon: '🍔', reward: 1200, xp: 120, description: '海外に行くと値段が違う？' },
        { id: 402, title: '円安の波', type: 'simulation', icon: '💱', reward: 1300, xp: 130, description: 'iPhoneが高くなる理由' },
        { id: 403, title: '貿易の船', type: 'quiz', icon: '🚢', reward: 1400, xp: 140, description: '日本の輸出と輸入' }
      ],
      boss: { id: 499, name: 'カントリー・リスク', icon: '⚡', reward: 2500, xp: 250, description: '戦争や政治で市場が大荒れ！' }
    },
    {
      id: 5,
      title: '未来への投資',
      subtitle: 'Future X',
      stage: '天空都市ゼスタ',
      icon: '🏙️',
      color: 'from-yellow-500 to-amber-600',
      borderColor: 'border-yellow-400',
      difficulty: 5,
      type: 'main',
      quests: [
        { id: 501, title: 'タマゴを分けるカゴ', type: 'lesson', icon: '🥚', reward: 1500, xp: 150, description: '分散投資の魔法' },
        { id: 502, title: '複利のタイムマシン', type: 'simulation', icon: '⏰', reward: 1600, xp: 160, description: '雪だるま式に増やす' },
        { id: 503, title: '未来のお金', type: 'quiz', icon: '🤖', reward: 1700, xp: 170, description: 'AI時代にどう稼ぐ？' }
      ],
      boss: { id: 599, name: '未知数X', icon: '❌', reward: 5000, xp: 500, description: '正解のない未来で生き残れ！' }
    }
  ];

  // サブクエスト（並列エリア・いつでもアクセス可能）
  const subQuests = [
    {
      id: 'crypto',
      title: '仮想通貨の洞窟',
      icon: '₿',
      color: 'from-amber-500 to-yellow-600',
      borderColor: 'border-amber-400',
      description: 'ビットコインとブロックチェーンの世界',
      quests: [
        { id: 601, title: 'ビットコイン入門', type: 'lesson', icon: '₿', reward: 800, xp: 80, description: 'デジタル通貨とは？' },
        { id: 602, title: 'マイニングの仕組み', type: 'simulation', icon: '⛏️', reward: 900, xp: 90, description: '採掘で報酬を得る' }
      ]
    },
    {
      id: 'history',
      title: '歴史の図書館',
      icon: '📚',
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-400',
      description: '金融の歴史を学ぶ',
      quests: [
        { id: 701, title: 'バブル経済', type: 'lesson', icon: '🫧', reward: 700, xp: 70, description: '1980年代の日本経済' },
        { id: 702, title: 'リーマンショック', type: 'quiz', icon: '📉', reward: 800, xp: 80, description: '2008年の金融危機' }
      ]
    },
    {
      id: 'tax',
      title: '税金の役所',
      icon: '🏢',
      color: 'from-gray-500 to-slate-600',
      borderColor: 'border-gray-400',
      description: '税金と社会保障を理解',
      quests: [
        { id: 801, title: '所得税の仕組み', type: 'lesson', icon: '💴', reward: 600, xp: 60, description: '累進課税とは？' },
        { id: 802, title: '確定申告', type: 'simulation', icon: '📝', reward: 700, xp: 70, description: '税金を申告してみよう' }
      ]
    }
  ];

  // クエストクリック処理
  const handleQuestClick = (quest, chapter) => {
    // テスト用：全クエストクリック可能
    soundSystem.playNotification();
    setSelectedQuest({ ...quest, chapter });
  };

  const handleStartQuest = () => {
    soundSystem.playClick();
    if (selectedQuest && setSelectedQuestId) {
      setSelectedQuestId(selectedQuest.id);
    }
    setSelectedQuest(null);
    onNavigate('quiz');
  };

  // Chapterが完了しているかチェック
  const isChapterCompleted = (chapter) => {
    const chapterQuests = [...chapter.quests, chapter.boss];
    return chapterQuests.every(q => completedQuests.includes(q.id));
  };

  // Chapterの進捗を計算
  const getChapterProgress = (chapter) => {
    const chapterQuests = [...chapter.quests, chapter.boss];
    const completed = chapterQuests.filter(q => completedQuests.includes(q.id)).length;
    return { completed, total: chapterQuests.length };
  };

  // クエストがロックされているか
  const isQuestLocked = (quest) => {
    // テスト用：全クエストアンロック
    return false;
  };

  // クエストの色を取得
  const getQuestColor = (quest) => {
    if (completedQuests.includes(quest.id)) return 'bg-green-600';
    if (quest.id.toString().endsWith('99')) return 'bg-red-600'; // ボス
    return 'bg-blue-600';
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-24">
      {/* XESTAヘッダー */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 z-20 border-b border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              ⚔️ Quest Forest
            </h1>
            <p className="text-xs text-gray-400 italic">冒険の森で学び、稼ぐ</p>
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
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🔥</span>
            <span className="text-gray-300">{user.streak_count}日連続</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Lv.{user.level}</span>
            <span className="text-gray-500">|</span>
            <span className="text-yellow-400 font-bold">{user.xp} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Chapters（上から下へスクロール：通常順序で表示） */}
      <div className="p-4 space-y-8">
        {chapters.map((chapter, index) => {
          const progress = getChapterProgress(chapter);
          const isCompleted = isChapterCompleted(chapter);
          const allQuests = [...chapter.quests, chapter.boss];
          
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              {/* Chapter ヘッダー */}
              <div className={`bg-gradient-to-br ${chapter.color} rounded-2xl p-5 border-2 ${chapter.borderColor}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{chapter.icon}</div>
                    <div>
                      <h2 className="text-lg font-black text-white">
                        Chapter {chapter.id}: {chapter.title}
                      </h2>
                      <p className="text-xs text-white/80">{chapter.subtitle}</p>
                      <p className="text-xs text-white/60 mt-1">📍 {chapter.stage}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-bold text-white">✓ 完了</span>
                    </div>
                  )}
                </div>
                
                {/* 進捗バー */}
                <div className="bg-black/20 rounded-full h-2 overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
                    className="h-full bg-white/40"
                  />
                </div>
                <p className="text-xs text-white/70 text-right">
                  {progress.completed}/{progress.total} クエスト完了
                </p>
              </div>

              {/* Chapter内のクエスト */}
              <div className="space-y-3 pl-4">
                {allQuests.map((quest, questIndex) => {
                  const isLocked = isQuestLocked(quest);
                  const isQuestCompleted = completedQuests.includes(quest.id);
                  const isBoss = quest.id.toString().endsWith('99');
                  
                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + questIndex * 0.05 }}
                      whileHover={!isLocked ? { scale: 1.02 } : {}}
                      whileTap={!isLocked ? { scale: 0.98 } : {}}
                      onClick={() => !isLocked && handleQuestClick(quest, chapter)}
                      className={`
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${isBoss ? 'bg-gradient-to-br from-red-900 to-red-800 border-red-500' : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'}
                        rounded-xl p-4 border-2 relative
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`
                            ${isBoss ? 'text-5xl' : 'text-4xl'}
                            ${isLocked ? 'grayscale' : ''}
                          `}>
                            {isLocked ? '🔒' : quest.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-sm">
                              {quest.title || quest.name}
                            </h3>
                            {quest.description && (
                              <p className="text-xs text-gray-400 mt-1">{quest.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className="flex items-center gap-1">
                                <span className="text-green-400">💰</span>
                                <span className="text-green-300">¥{quest.reward}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-400">⭐</span>
                                <span className="text-yellow-300">+{quest.xp}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 完了チェック */}
                        {isQuestCompleted && (
                          <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm">
                            ✓
                          </div>
                        )}
                        
                        {/* ボスバッジ */}
                        {isBoss && !isLocked && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            BOSS
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* サブクエスト（並列エリア） */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 mt-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white mb-2">📖 The Library</h2>
          <p className="text-sm text-gray-400">いつでも学べる特別エリア</p>
        </div>

        <div className="space-y-4">
          {subQuests.map((area) => (
            <motion.div
              key={area.id}
              initial={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${area.color} rounded-2xl p-4 border-2 ${area.borderColor}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{area.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{area.title}</h3>
                  <p className="text-xs text-white/80">{area.description}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {area.quests.map((quest) => {
                  const isCompleted = completedQuests.includes(quest.id);
                  
                  return (
                    <motion.div
                      key={quest.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuestClick(quest, { ...area, type: 'sub' })}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{quest.icon}</span>
                          <div>
                            <div className="text-sm font-bold text-white">{quest.title}</div>
                            <div className="text-xs text-white/70">{quest.description}</div>
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="text-green-300">💰 ¥{quest.reward}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-300">⭐ +{quest.xp}</span>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* クエスト詳細モーダル */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQuest(null)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                ${selectedQuest.id.toString().endsWith('99') 
                  ? 'bg-gradient-to-br from-red-900 to-red-800' 
                  : 'bg-gradient-to-br from-gray-800 to-gray-900'}
                rounded-3xl p-6 max-w-sm w-full border-2
                ${selectedQuest.chapter?.borderColor || 'border-gray-700'}
              `}
            >
              {/* Chapterバッジ */}
              <div className="text-center mb-2">
                <span className="text-xs text-gray-400">
                  {selectedQuest.chapter?.icon} Chapter {selectedQuest.chapter?.id}: {selectedQuest.chapter?.subtitle}
                </span>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{selectedQuest.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedQuest.title || selectedQuest.name}
                </h2>
                {selectedQuest.description && (
                  <p className="text-sm text-gray-300">{selectedQuest.description}</p>
                )}
              </div>

              <div className="bg-black/30 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">報酬</span>
                  <span className="text-green-400 font-bold">¥{selectedQuest.reward}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">経験値</span>
                  <span className="text-yellow-400 font-bold">+{selectedQuest.xp} XP</span>
                </div>
                {selectedQuest.id.toString().endsWith('99') && (
                  <div className="pt-2 border-t border-white/10 text-center">
                    <span className="text-red-400 font-bold text-sm">👹 BOSS BATTLE</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedQuest(null)}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600"
                >
                  閉じる
                </button>
                <button
                  onClick={handleStartQuest}
                  className={`
                    flex-1 py-3 rounded-xl font-bold text-white
                    ${selectedQuest.id.toString().endsWith('99')
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-red-500/50'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600'}
                    hover:shadow-lg
                  `}
                >
                  {selectedQuest.id.toString().endsWith('99') ? '挑戦！' : '開始！'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
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
  const getCompanyIcon = (symbol, type = 'STOCK') => {
    // 株式アイコン
    const stockIconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    
    // Commoditiesアイコン
    const commodityIconMap = {
      'GOLD': '🥇',
      'SILVER': '🥈',
      'CRUDE': '🛢️',
      'PLATINUM': '⚪',
      'COPPER': '🟤'
    };
    
    // ETF Packsアイコン
    const etfIconMap = {
      'AI-PACK': '🤖',
      'GREEN-PACK': '🌾',
      'GAME-PACK': '🎮',
      'HEALTH-PACK': '💊',
      'AUTO-PACK': '🚗'
    };
    
    if (type === 'COMMODITY') {
      return commodityIconMap[symbol] || '⚡';
    }
    
    if (type === 'ETF') {
      return etfIconMap[symbol] || '📦';
    }
    
    return stockIconMap[symbol] || '🏢';
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
  const getCompanyIcon = (symbol, type = 'STOCK') => {
    // 株式アイコン
    const stockIconMap = {
      '7974': '🎮', '7203': '🚗', '9983': '👕', '4704': '🛡️',
      '4689': '💬', '4755': '🛒', '6758': '🎵', '9984': '📱',
      '4502': '💊', '2914': '🍃', '4568': '⚕️', '6098': '💼',
    };
    
    // Commoditiesアイコン
    const commodityIconMap = {
      'GOLD': '🥇',
      'SILVER': '🥈',
      'CRUDE': '🛢️',
      'PLATINUM': '⚪',
      'COPPER': '🟤'
    };
    
    // ETF Packsアイコン
    const etfIconMap = {
      'AI-PACK': '🤖',
      'GREEN-PACK': '🌾',
      'GAME-PACK': '🎮',
      'HEALTH-PACK': '💊',
      'AUTO-PACK': '🚗'
    };
    
    if (type === 'COMMODITY') {
      return commodityIconMap[symbol] || '⚡';
    }
    
    if (type === 'ETF') {
      return etfIconMap[symbol] || '📦';
    }
    
    return stockIconMap[symbol] || '🏢';
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
  const [selectedQuestId, setSelectedQuestId] = useState(null);

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

        {currentScreen === 'news' && user && (
          <motion.div
            key="news"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <NewsScreen user={user} onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentScreen === 'map' && user && (
          <motion.div
            key="map"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <MapScreen user={user} onNavigate={handleNavigate} onXpEarned={handleXpEarned} setSelectedQuestId={setSelectedQuestId} />
          </motion.div>
        )}

        {currentScreen === 'quiz' && user && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <QuizScreen user={user} onNavigate={handleNavigate} onXpEarned={handleXpEarned} questId={selectedQuestId} />
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
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
