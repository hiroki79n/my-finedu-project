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
// ===== Bottom Navigation Component =====
const BottomNav = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'ホーム' },
    { id: 'news', icon: '📰', label: 'ニュース' },
    { id: 'portfolio', icon: '💼', label: '資産' },
    { id: 'history', icon: '📜', label: '履歴' },
    { id: 'settings', icon: '⚙️', label: '設定' }
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
    >
      <div className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 px-2 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                soundSystem.playClick();
                onNavigate(item.id);
              }}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${
                currentScreen === item.id 
                  ? 'text-emerald-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {currentScreen === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ===== News Hero Component =====
const NewsHero = ({ onOpenChat }) => {
  const [currentNews, setCurrentNews] = useState(null);

  useEffect(() => {
    // Fetch latest news
    const newsItems = [
      {
        id: 1,
        title: '日本の半導体メーカーが大型投資を発表',
        summary: '国内大手半導体メーカーが次世代チップ工場建設のため1兆円規模の投資を発表。AI需要の拡大に対応。',
        category: 'tech',
        impact: 'positive',
        relatedStocks: ['6758', '6920'],
        image: '🏭'
      },
      {
        id: 2,
        title: '電気自動車市場が急拡大',
        summary: '世界のEV販売台数が前年比50%増加。バッテリー技術の進化により航続距離が大幅改善。',
        category: 'auto',
        impact: 'positive',
        relatedStocks: ['7203', '7267'],
        image: '🚗'
      },
      {
        id: 3,
        title: '円安が輸出企業を後押し',
        summary: '為替が1ドル145円台に。自動車メーカーや電機メーカーの業績改善が期待される。',
        category: 'economy',
        impact: 'mixed',
        relatedStocks: ['7203', '6758'],
        image: '💱'
      }
    ];
    
    setCurrentNews(newsItems[Math.floor(Math.random() * newsItems.length)]);
  }, []);

  if (!currentNews) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl h-[280px] cursor-pointer"
      onClick={() => {
        soundSystem.playNotification();
        onOpenChat();
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
      
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-3 py-1 bg-rose-500 rounded-full text-white text-xs font-bold flex items-center gap-1"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            BREAKING
          </motion.div>
          <div className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs font-bold">
            {currentNews.category.toUpperCase()}
          </div>
        </div>

        {/* News Content */}
        <div>
          <div className="text-4xl mb-3">{currentNews.image}</div>
          <h2 className="text-xl font-black text-white mb-2 leading-tight">
            {currentNews.title}
          </h2>
          <p className="text-sm text-white/80 line-clamp-2">
            {currentNews.summary}
          </p>
        </div>

        {/* Finn Character - positioned at bottom right */}
        <div className="absolute bottom-4 right-4">
          <motion.img
            src="/static/finn/finn-chart.png"
            alt="Finn"
            className="w-24 h-24 drop-shadow-2xl"
            animate={{ 
              y: [0, -5, 0],
              rotate: [-2, 2, -2]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />
    </motion.div>
  );
};

// ===== Action Nudge Component =====
const ActionNudge = ({ onOpenChat }) => {
  return (
    <motion.button
      onClick={() => {
        soundSystem.playClick();
        onOpenChat();
      }}
      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-4 relative overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Pulse Animation Background */}
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
        className="absolute inset-0 bg-emerald-400 rounded-2xl"
      />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🤝</div>
          <div className="text-left">
            <div className="text-white font-black text-lg">フィンと作戦会議</div>
            <div className="text-emerald-100 text-xs">このニュースをどう活かす？</div>
          </div>
        </div>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white text-2xl"
        >
          →
        </motion.div>
      </div>
    </motion.button>
  );
};

// ===== Quest Rail Component =====
const QuestRail = ({ onNavigate, cash }) => {
  const quests = [
    { id: 101, title: '物々交換の限界', icon: '🐟', reward: 300, difficulty: 'easy' },
    { id: 102, title: '貝殻からコインへ', icon: '🐚', reward: 400, difficulty: 'easy' },
    { id: 103, title: '信用の魔法', icon: '📜', reward: 500, difficulty: 'easy' },
    { id: 201, title: '仕事選び', icon: '💼', reward: 600, difficulty: 'medium' },
    { id: 202, title: '生活費サバイバル', icon: '🏠', reward: 700, difficulty: 'medium' }
  ];

  const needsCash = cash < 1000;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>⚔️</span>
          クエストで稼ぐ
        </h3>
        {needsCash && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="px-2 py-1 bg-yellow-500 rounded-full text-xs font-bold text-slate-900"
          >
            おすすめ
          </motion.div>
        )}
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {quests.map((quest, index) => (
          <motion.button
            key={quest.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              soundSystem.playClick();
              onNavigate('map');
            }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-32 bg-slate-900/50 backdrop-blur rounded-xl p-3 border border-slate-700 hover:border-emerald-500 transition-colors"
          >
            <div className="text-3xl mb-2">{quest.icon}</div>
            <div className="text-xs font-bold text-white mb-1 line-clamp-2">
              {quest.title}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold">+¥{quest.reward}</span>
              <span className={`px-1.5 py-0.5 rounded ${
                quest.difficulty === 'easy' 
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {quest.difficulty === 'easy' ? '初級' : '中級'}
              </span>
            </div>
          </motion.button>
        ))}
        
        {/* View All Card */}
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: quests.length * 0.1 }}
          onClick={() => {
            soundSystem.playClick();
            onNavigate('map');
          }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 w-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-3 flex flex-col items-center justify-center gap-2"
        >
          <div className="text-3xl">🗺️</div>
          <div className="text-xs font-bold text-white">すべて見る</div>
        </motion.button>
      </div>
    </div>
  );
};

// ===== Chat Modal (Bottom Sheet) Component =====
const ChatModal = ({ isOpen, onClose, user, newsItem }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && newsItem) {
      // Generate initial AI response based on news content
      setTimeout(() => {
        const initialMessages = generateNewsAnalysis(newsItem);
        setMessages(initialMessages);
      }, 300);
    } else {
      setMessages([]);
      setUserInput('');
    }
  }, [isOpen, newsItem]);

  const generateNewsAnalysis = (news) => {
    const impactText = news.impact === 'positive' ? '良い影響' : 
                       news.impact === 'negative' ? '悪い影響' : '中立的な影響';
    
    return [
      {
        id: 1,
        type: 'finn',
        text: `この「${news.title}」というニュースについて説明するね！🤔`
      },
      {
        id: 2,
        type: 'finn',
        text: news.description
      },
      {
        id: 3,
        type: 'finn',
        text: `このニュースは市場に${impactText}を与えると予想されるよ。${news.stocks.length > 0 ? `特に${news.stocks.join('、')}などの銘柄に注目だね！` : ''}📊`
      }
    ];
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: userInput
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput, newsItem);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (question, news) => {
    const lowerQuestion = question.toLowerCase();
    let response = '';

    if (lowerQuestion.includes('なぜ') || lowerQuestion.includes('理由')) {
      response = `${news.category}分野では、${news.description.substring(0, 50)}...という背景があるからだよ。経済の仕組みを理解すると、ニュースの意味がよく分かるようになるね！💡`;
    } else if (lowerQuestion.includes('いつ') || lowerQuestion.includes('タイミング')) {
      response = `投資のタイミングは難しいけど、${news.impact === 'positive' ? '上昇期待' : news.impact === 'negative' ? '下落懸念' : '中立'}の局面では、慎重に市場を見守るのがいいよ。長期的な視点も大事だね！📈`;
    } else if (lowerQuestion.includes('買') || lowerQuestion.includes('売')) {
      response = `投資判断は最終的に自分で決めることが大切だよ！このニュースを参考に、${news.stocks.length > 0 ? news.stocks[0] : '関連銘柄'}の財務状況や将来性を調べてみるといいね。僕はサポート役として情報提供するよ！🎯`;
    } else if (lowerQuestion.includes('影響') || lowerQuestion.includes('どう')) {
      response = `このニュースは${news.category}セクター全体に影響を与える可能性があるよ。${news.stocks.join('、')}などの企業は特に注目されているんだ。市場の反応を見てみよう！🔍`;
    } else {
      response = `なるほど！${news.title}について、もっと詳しく知りたいんだね。${news.category}分野は今後も注目されるテーマだから、ニュースをチェックし続けるといいよ！何か具体的に知りたいことはある？😊`;
    }

    return {
      id: messages.length + 2,
      type: 'finn',
      text: response
    };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
          >
            <div className="bg-slate-900 rounded-t-3xl border-t-2 border-emerald-500 max-h-[70vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="/static/finn/finn-normal.png" 
                    alt="Finn" 
                    className="w-12 h-12"
                  />
                  <div>
                    <div className="font-bold text-white">フィン</div>
                    <div className="text-xs text-slate-400">AIパートナー</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ x: msg.type === 'finn' ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.type === 'finn' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        F
                      </div>
                    )}
                    <div className={`flex-1 rounded-2xl p-3 ${
                      msg.type === 'finn' 
                        ? 'bg-slate-800 rounded-tl-none' 
                        : 'bg-emerald-600 rounded-tr-none'
                    }`}>
                      <p className="text-white text-sm">{msg.text}</p>
                    </div>
                    {msg.type === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      F
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-2xl rounded-tl-none p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Field */}
              <div className="p-4 border-t border-slate-700">
                {/* Quick Actions */}
                <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setUserInput('このニュースの影響は？')}
                    className="flex-shrink-0 bg-slate-800 text-slate-300 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-slate-700 transition-colors"
                  >
                    💡 影響を知る
                  </button>
                  <button
                    onClick={() => setUserInput('関連銘柄の詳細は？')}
                    className="flex-shrink-0 bg-slate-800 text-slate-300 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-slate-700 transition-colors"
                  >
                    📊 銘柄情報
                  </button>
                  <button
                    onClick={() => setUserInput('投資するタイミングは？')}
                    className="flex-shrink-0 bg-slate-800 text-slate-300 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-slate-700 transition-colors"
                  >
                    ⏰ タイミング
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="フィンに質問してみよう..."
                    className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isTyping}
                    className="bg-emerald-500 text-white rounded-xl px-4 py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
                  >
                    <span>📤</span>
                  </button>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-4 pb-4">
                <motion.button
                  onClick={() => {
                    soundSystem.playClick();
                    onClose();
                    // Navigate to market with related stocks highlighted
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('navigate', { detail: 'market' }));
                    }, 300);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2"
                >
                  <span>🏛️</span>
                  市場で取引する
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ===== New Home Screen =====
const HomeScreen = ({ user, asset, onNavigate }) => {
  const [totalAssets, setTotalAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cash, setCash] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme, currentTheme, toggleTheme } = useTheme();

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

  if (loading) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-slate-950 flex items-center justify-center pb-24">
        <div className="spinner"></div>
      </div>
    );
  }

  const profit = totalAssets ? totalAssets.totalAssets - 1000000 : 0;
  const rank = profit < 10000 ? 'Bronze' : profit < 50000 ? 'Silver' : profit < 100000 ? 'Gold' : 'Platinum';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-950 pb-24">
      {/* Header - Glassmorphism */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Rank Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <div className="text-2xl">
              {rank === 'Bronze' ? '🥉' : rank === 'Silver' ? '🥈' : rank === 'Gold' ? '🥇' : '💎'}
            </div>
            <div>
              <div className="text-xs text-slate-400">Rank</div>
              <div className="text-sm font-bold text-emerald-400">{rank}</div>
            </div>
          </motion.div>

          {/* Total Assets (Simple) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-right"
          >
            <div className="text-xs text-slate-400">Total Assets</div>
            <div className="text-lg font-black text-white">
              <CountUp value={totalAssets?.totalAssets || 0} duration={1.5} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* News Hero Section */}
        <NewsHero onOpenChat={() => setIsChatOpen(true)} />

        {/* Action Nudge */}
        <ActionNudge onOpenChat={() => setIsChatOpen(true)} />

        {/* Quest Rail */}
        <QuestRail onNavigate={onNavigate} cash={cash} />

        {/* City Building (Simplified) */}
        {profit > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🏙️</span>
                あなたの街
              </h3>
              <div className="text-sm text-emerald-400 font-bold">
                成長度: {Math.min(Math.floor(profit / 1000), 100)}%
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {profit >= 1000 && <div className="text-2xl">☕</div>}
              {profit >= 5000 && <div className="text-2xl">🌳</div>}
              {profit >= 10000 && <div className="text-2xl">🗼</div>}
              {profit >= 50000 && <div className="text-2xl">🎡</div>}
              {profit >= 100000 && <div className="text-2xl">🏰</div>}
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Modal */}
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        user={user}
      />
    </div>
  );
};

// ===== ニュース画面 =====
const NewsScreen = ({ user, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  
  // カテゴリーリスト
  const categories = [
    { id: 'all', name: '全て', icon: '📰' },
    { id: 'economy', name: '経済', icon: '💱' },
    { id: 'tech', name: 'テクノロジー', icon: '🤖' },
    { id: 'pharma', name: '製薬', icon: '💊' },
    { id: 'retail', name: '小売', icon: '🛒' },
    { id: 'commodity', name: 'コモディティ', icon: '⚡' },
    { id: 'finance', name: '金融', icon: '🏦' },
    { id: 'energy', name: 'エネルギー', icon: '⚡' }
  ];

  // ニュースデータ（拡張版）
  const allNewsItems = [
    // 経済カテゴリー
    {
      id: 1,
      category: '経済',
      categoryId: 'economy',
      icon: '💱',
      title: '円安進行で輸出関連株に注目',
      description: '1ドル=150円台に突入。自動車メーカーや電機メーカーの業績改善が期待されています。為替の変動により、輸出企業の収益が大幅に改善する見込みです。',
      impact: 'positive',
      stocks: ['トヨタ自動車', '任天堂', 'ソニーグループ'],
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-400',
      date: '2026-02-01'
    },
    {
      id: 2,
      category: '経済',
      categoryId: 'economy',
      icon: '💱',
      title: '日銀が金融政策の見直しを検討',
      description: 'インフレ目標達成により、日本銀行が金融緩和政策の修正を検討中。金利上昇の可能性が高まっています。',
      impact: 'neutral',
      stocks: ['三菱UFJ', '三井住友FG'],
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-400',
      date: '2026-02-01'
    },
    {
      id: 3,
      category: '経済',
      categoryId: 'economy',
      icon: '💰',
      title: 'GDP成長率が予想を上回る',
      description: '2025年Q4のGDP成長率が年率2.5%を記録。個人消費の回復が牽引役となっています。',
      impact: 'positive',
      stocks: ['イオン', 'セブン&アイ'],
      color: 'from-emerald-500 to-green-600',
      borderColor: 'border-emerald-400',
      date: '2026-01-31'
    },
    
    // テクノロジーカテゴリー
    {
      id: 4,
      category: 'テクノロジー',
      categoryId: 'tech',
      icon: '🤖',
      title: 'AI関連企業の株価が急騰',
      description: '生成AIの普及により、関連企業への投資が加速。今後の成長が期待されています。特にクラウドサービスとAIチップメーカーに注目が集まっています。',
      impact: 'positive',
      stocks: ['ソフトバンクグループ', 'LINEヤフー'],
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-400',
      date: '2026-02-01'
    },
    {
      id: 5,
      category: 'テクノロジー',
      categoryId: 'tech',
      icon: '📱',
      title: '半導体不足が解消へ',
      description: '世界的な半導体供給が正常化。自動車産業や家電メーカーの生産が回復基調に。',
      impact: 'positive',
      stocks: ['ソニーグループ', '東京エレクトロン'],
      color: 'from-purple-500 to-blue-600',
      borderColor: 'border-purple-400',
      date: '2026-01-31'
    },
    {
      id: 6,
      category: 'テクノロジー',
      categoryId: 'tech',
      icon: '🔐',
      title: 'サイバーセキュリティ需要が急増',
      description: 'ランサムウェア攻撃の増加により、セキュリティ対策への投資が拡大。関連企業の受注が好調です。',
      impact: 'positive',
      stocks: ['トレンドマイクロ', 'ラック'],
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-400',
      date: '2026-01-30'
    },
    
    // 製薬カテゴリー
    {
      id: 7,
      category: '製薬',
      categoryId: 'pharma',
      icon: '💊',
      title: '新薬開発で製薬株に期待',
      description: '武田薬品や第一三共の新薬治験が順調に進行。承認されれば大きな収益が見込まれます。がん治療薬の臨床試験で良好な結果が報告されています。',
      impact: 'positive',
      stocks: ['武田薬品', '第一三共'],
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-400',
      date: '2026-02-01'
    },
    {
      id: 8,
      category: '製薬',
      categoryId: 'pharma',
      icon: '🧬',
      title: '再生医療分野に注目集まる',
      description: 'iPS細胞を使った治療法の実用化が進展。バイオベンチャーへの投資が活発化しています。',
      impact: 'positive',
      stocks: ['武田薬品', 'アステラス製薬'],
      color: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-400',
      date: '2026-01-30'
    },
    
    // 小売カテゴリー
    {
      id: 9,
      category: '小売',
      categoryId: 'retail',
      icon: '🛒',
      title: 'インフレ懸念で消費関連株が軟調',
      description: '物価上昇により消費者の購買力が低下。小売・アパレル業界に逆風が吹いています。',
      impact: 'negative',
      stocks: ['ファーストリテイリング', '楽天グループ'],
      color: 'from-red-500 to-rose-600',
      borderColor: 'border-red-400',
      date: '2026-02-01'
    },
    {
      id: 10,
      category: '小売',
      categoryId: 'retail',
      icon: '🏪',
      title: 'コンビニ各社が値上げを実施',
      description: '原材料費の高騰により、大手コンビニチェーンが商品価格を引き上げ。消費者の反応が注目されます。',
      impact: 'negative',
      stocks: ['セブン&アイ', 'ローソン'],
      color: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-400',
      date: '2026-01-31'
    },
    
    // コモディティカテゴリー
    {
      id: 11,
      category: 'コモディティ',
      categoryId: 'commodity',
      icon: '⚡',
      title: '金価格が過去最高値を更新',
      description: '世界的な不安定要因により、安全資産としての金への需要が高まっています。中央銀行の金購入も増加傾向です。',
      impact: 'neutral',
      stocks: ['田中貴金属', '住友金属鉱山'],
      color: 'from-yellow-500 to-amber-600',
      borderColor: 'border-yellow-400',
      date: '2026-02-01'
    },
    {
      id: 12,
      category: 'コモディティ',
      categoryId: 'commodity',
      icon: '🛢️',
      title: '原油価格が上昇トレンド',
      description: 'OPEC+の減産決定により、原油価格が1バレル90ドルを突破。エネルギー関連株に追い風です。',
      impact: 'positive',
      stocks: ['INPEX', '出光興産'],
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400',
      date: '2026-01-30'
    },
    
    // 金融カテゴリー
    {
      id: 13,
      category: '金融',
      categoryId: 'finance',
      icon: '🏦',
      title: '銀行株が金利上昇で上昇',
      description: '政策金利の引き上げ期待により、メガバンクの株価が堅調に推移しています。',
      impact: 'positive',
      stocks: ['三菱UFJ', 'みずほFG'],
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-400',
      date: '2026-02-01'
    },
    {
      id: 14,
      category: '金融',
      categoryId: 'finance',
      icon: '💳',
      title: 'キャッシュレス決済がさらに拡大',
      description: 'QR決済の利用者が5000万人を突破。決済関連企業の業績が好調です。',
      impact: 'positive',
      stocks: ['楽天グループ', 'PayPay'],
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-400',
      date: '2026-01-29'
    },
    
    // エネルギーカテゴリー
    {
      id: 15,
      category: 'エネルギー',
      categoryId: 'energy',
      icon: '⚡',
      title: '再生可能エネルギー投資が加速',
      description: '政府の脱炭素政策により、太陽光・風力発電への投資が急増。関連企業に注目が集まっています。',
      impact: 'positive',
      stocks: ['東京電力', 'エネオス'],
      color: 'from-green-500 to-teal-600',
      borderColor: 'border-green-400',
      date: '2026-02-01'
    },
    {
      id: 16,
      category: 'エネルギー',
      categoryId: 'energy',
      icon: '🔋',
      title: 'EV用バッテリー需要が急増',
      description: '電気自動車の普及により、リチウムイオン電池の需要が拡大。材料メーカーの受注が好調です。',
      impact: 'positive',
      stocks: ['パナソニック', 'GSユアサ'],
      color: 'from-teal-500 to-green-600',
      borderColor: 'border-teal-400',
      date: '2026-01-31'
    }
  ];

  // カテゴリーでフィルタリング
  const filteredNews = selectedCategory === '全て' 
    ? allNewsItems 
    : allNewsItems.filter(news => news.category === selectedCategory);

  const getImpactBadge = (impact) => {
    if (impact === 'positive') return { text: '📈 上昇期待', color: 'bg-green-500' };
    if (impact === 'negative') return { text: '📉 下落懸念', color: 'bg-red-500' };
    return { text: '➡️ 中立', color: 'bg-gray-500' };
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-950 pb-24">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-xl px-6 py-4 z-20 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              📰 今日のニュース
            </h1>
            <p className="text-xs text-slate-400">市場を動かすトピックス</p>
          </div>
          <button
            onClick={() => {
              soundSystem.playClick();
              onNavigate('home');
            }}
            className="text-white hover:text-slate-300"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        {/* カテゴリータブ */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                soundSystem.playClick();
                setSelectedCategory(category.name);
              }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === category.name
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ニュース一覧 */}
      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <div className="text-slate-400">このカテゴリーにはニュースがありません</div>
              </div>
            ) : (
              filteredNews.map((news, index) => {
                const badge = getImpactBadge(news.impact);
                
                return (
                  <motion.div
                    key={news.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-gradient-to-br ${news.color} rounded-2xl p-5 border-2 ${news.borderColor}`}
                  >
                    {/* カテゴリと影響度 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{news.icon}</span>
                        <span className="text-xs font-bold text-white/80">{news.category}</span>
                        <span className="text-xs text-white/60">• {news.date}</span>
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
                    <div className="bg-black/20 rounded-xl p-3 mb-3">
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

                    {/* フィンに聞くボタン */}
                    <motion.button
                      onClick={() => {
                        soundSystem.playClick();
                        setSelectedNews(news);
                        setIsChatOpen(true);
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-colors border border-white/20"
                    >
                      <img 
                        src="/static/finn/finn-normal.png" 
                        alt="Finn" 
                        className="w-5 h-5"
                      />
                      <span>フィンに聞く</span>
                      <span className="text-xs">💬</span>
                    </motion.button>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
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

      {/* フィンとのチャットモーダル */}
      <ChatModal 
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedNews(null);
        }}
        user={user}
        newsItem={selectedNews}
      />
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
const QuizScreen = ({ user, onNavigate, onXpEarned, questId, chapterId }) => {
  console.log('=== QuizScreen Mounted ===');
  console.log('Props:', { userId: user?.id, questId, chapterId });
  
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, [chapterId, questId]); // chapterIdとquestIdが変更されたら再取得

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz');
      const data = await response.json();
      
      console.log('Fetched quizzes:', data.quizzes.length);
      console.log('chapterId:', chapterId, 'questId:', questId);
      
      // chapterIdが指定されている場合は、そのチャプターのクイズをフィルタ
      if (chapterId) {
        const filteredQuizzes = data.quizzes.filter(q => q.chapter_id === chapterId);
        console.log('Filtered quizzes for chapter', chapterId, ':', filteredQuizzes.length);
        setQuizzes(filteredQuizzes);
        if (filteredQuizzes.length > 0) {
          setCurrentQuiz(filteredQuizzes[0]);
        } else {
          console.warn('No quizzes found for chapter', chapterId);
        }
      } else if (questId) {
        // 後方互換性のため、questIdのみの場合も対応
        const filteredQuiz = data.quizzes.find(q => q.id === questId);
        console.log('Filtered quiz for questId', questId, ':', filteredQuiz);
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
    const currentIndex = quizzes.findIndex(q => q.id === currentQuiz.id);
    if (currentIndex < quizzes.length - 1) {
      // 次のクイズへ
      setCurrentQuiz(quizzes[currentIndex + 1]);
      setSelectedAnswer(null);
      setResult(null);
    } else {
      // 全問完了、マップに戻る
      onNavigate('map');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">クイズを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // クイズが見つからない場合のエラー表示
  if (!loading && quizzes.length === 0) {
    return (
      <div className="min-h-screen max-w-md mx-auto p-6 bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 card-shadow text-center"
          >
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              クイズが見つかりません
            </h2>
            <p className="text-gray-600 mb-6">
              {chapterId ? `Chapter ${chapterId} のクイズがまだ準備されていません。` : 'クイズデータの読み込みに失敗しました。'}
            </p>
            <Button onClick={() => onNavigate('map')}>
              マップに戻る
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    return (
      <div className="min-h-screen max-w-md mx-auto p-6 bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 card-shadow text-gray-800"
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
                          : 'border-gray-300 hover:border-purple-300 text-gray-800 bg-white'
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
                  {quizzes.findIndex(q => q.id === currentQuiz.id) < quizzes.length - 1 ? '次のクイズへ' : 'マップに戻る'}
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

        {/* Finn Navigator removed - using FinnGlobalOverlay instead */}
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto p-6 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-800">🧠 クイズチャレンジ</h1>
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

      {/* Finn Navigator removed - using FinnGlobalOverlay instead */}
    </div>
  );
};

// ===== Finnナビゲーターコンポーネント =====
// ===== Global Finn Overlay with Drag & Snap =====
const FinnGlobalOverlay = ({ currentScreen }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isReacting, setIsReacting] = useState(false); // リアクション中フラグ
  
  // ウィンドウサイズ取得
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ルートに応じたメッセージとキャラクター画像を変更
  useEffect(() => {
    let newMessage = '';
    
    // 画面遷移時のリアクション（ジャンプアニメーション）
    setIsReacting(true);
    const reactionTimer = setTimeout(() => setIsReacting(false), 600);
    
    switch (currentScreen) {
      case 'home':
        newMessage = 'こんにちは！投資の冒険を始めましょう！🎯';
        break;
      case 'map':
        newMessage = 'クエストを選んで冒険しよう！💪';
        break;
      case 'quiz':
        newMessage = '落ち着いて考えてみよう！🤔';
        break;
      case 'market':
        newMessage = '良い投資先を見つけたかな？💰';
        break;
      case 'portfolio':
        newMessage = 'ポートフォリオをバランス良く！📊';
        break;
      case 'news':
        newMessage = '最新ニュースをチェック！📰';
        break;
      default:
        newMessage = '';
    }
    
    if (newMessage) {
      setMessage(newMessage);
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(reactionTimer);
      };
    }
    
    return () => clearTimeout(reactionTimer);
  }, [currentScreen]);

  // ドラッグ終了時に四隅にスナップ
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    const { x, y } = info.point;
    const { width, height } = windowSize;
    
    // 四隅の座標を計算（マージン考慮）
    const margin = 100;
    let snapX, snapY;
    
    // 横方向の判定
    if (x < width / 2) {
      snapX = margin; // 左
    } else {
      snapX = width - margin; // 右
    }
    
    // 縦方向の判定
    if (y < height / 2) {
      snapY = margin; // 上
    } else {
      snapY = height - margin; // 下
    }
    
    // アニメーションでスナップ
    event.target.style.transform = `translate(${snapX}px, ${snapY}px)`;
  };

  // 画面に応じたキャラクター画像を選択
  const getFinnImage = () => {
    // Market, Portfolio, News画面ではチャート版を使用
    if (['market', 'portfolio', 'news'].includes(currentScreen)) {
      return '/static/finn/finn-chart.png';
    }
    // その他の画面ではノーマル版を使用
    return '/static/finn/finn-normal.png';
  };

  const finnImage = getFinnImage();

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      dragConstraints={{
        left: 50,
        right: windowSize.width - 150,
        top: 50,
        bottom: windowSize.height - 150
      }}
      initial={{ x: windowSize.width - 150, y: windowSize.height - 150, scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed z-[9999] cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* メッセージ吹き出し（ドラッグ中は非表示） */}
      {showMessage && message && !isDragging && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full right-0 mb-4 max-w-xs pointer-events-none"
        >
          <div className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-teal-400 relative">
            <div className="text-gray-800 text-sm font-medium">{message}</div>
            {/* 吹き出しの三角 */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-teal-400 transform rotate-45"></div>
          </div>
        </motion.div>
      )}

      {/* Finnキャラクター */}
      <motion.div
        whileHover={!isDragging && !isReacting ? { scale: 1.15, y: -5 } : {}}
        whileTap={{ scale: 0.9 }}
        animate={
          isDragging ? { 
            rotate: [0, -8, 8, -8, 0],
            y: [0, -3, 0, -3, 0]
          } : isReacting ? {
            // 画面遷移時のジャンプリアクション
            y: [0, -30, 0],
            rotate: [0, -10, 10, 0],
            scale: [1, 1.2, 1]
          } : {
            // 通常時の浮遊アニメーション
            y: [0, -10, 0],
            rotate: [0, -2, 2, -2, 0]
          }
        }
        transition={
          isDragging ? 
            { repeat: Infinity, duration: 0.4 } : 
          isReacting ?
            { duration: 0.6, ease: "easeOut" } :
            { 
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }
        }
        className="pointer-events-auto relative"
      >
        {/* 影 */}
        <motion.div
          animate={{ scale: [1, 0.95, 1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-md"
        />
        
        {/* キャラクター本体（背景透過PNG） */}
        <motion.img 
          key={finnImage}
          src={finnImage} 
          alt="Finn Navigator" 
          className="relative w-32 h-32 object-contain drop-shadow-2xl"
          draggable="false"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        />
        
        {/* アクティブインジケーター（キャラクターの右上） */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-2 right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-green-400 rounded-full"
          />
        </motion.div>
        
        {/* クリック可能なヒントエリア */}
        {!isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-teal-600 font-bold whitespace-nowrap pointer-events-none"
          >
            ドラッグして移動 🖱️
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ===== 冒険マップ画面 (MapScreen) =====
const MapScreen = ({ user, onNavigate, onXpEarned, setSelectedQuestId, setSelectedChapterId }) => {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([101]); // デモで最初のクエストを完了扱い

  // Chapter構造データ（新カリキュラム対応）
  const chapters = [
    {
      id: 1,
      title: 'お金と経済の概念',
      subtitle: 'Basics',
      stage: 'インフレの島',
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-400',
      difficulty: 1,
      type: 'main',
      quests: [
        { id: 101, title: 'インフレと預金', type: 'quiz', icon: '🏦', reward: 300, xp: 30, description: '実質価値を理解する' },
        { id: 105, title: '72の法則', type: 'quiz', icon: '🔢', reward: 300, xp: 30, description: '複利の威力を知る' },
        { id: 110, title: '投資の3要素', type: 'quiz', icon: '⏰', reward: 300, xp: 30, description: '時間の重要性' }
      ]
    },
    {
      id: 2,
      title: '給与明細・税・社会保険',
      subtitle: 'Tax & Insurance',
      stage: '税務の街',
      icon: '📋',
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-400',
      difficulty: 2,
      type: 'main',
      quests: [
        { id: 201, title: '給与天引き', type: 'quiz', icon: '💼', reward: 400, xp: 40, description: '社会保険料を知る' },
        { id: 202, title: '住民税', type: 'quiz', icon: '🏘️', reward: 400, xp: 40, description: '後払いの仕組み' },
        { id: 209, title: '所得税制度', type: 'quiz', icon: '📊', reward: 400, xp: 40, description: '累進課税を理解' }
      ]
    },
    {
      id: 3,
      title: 'キャッシュフロー設計',
      subtitle: 'Life Defense',
      stage: '生活防衛の砦',
      icon: '🛡️',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-400',
      difficulty: 3,
      type: 'main',
      quests: [
        { id: 301, title: '生活防衛資金', type: 'quiz', icon: '💵', reward: 500, xp: 50, description: '備えあれば憂いなし' },
        { id: 303, title: 'リボ払い金利', type: 'quiz', icon: '💳', reward: 500, xp: 50, description: '高金利の罠' },
        { id: 308, title: '貯蓄率', type: 'quiz', icon: '🐷', reward: 500, xp: 50, description: '先取り貯蓄' }
      ]
    },
    {
      id: 4,
      title: '保険の最適化',
      subtitle: 'Risk Management',
      stage: '保障の城',
      icon: '🏰',
      color: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-400',
      difficulty: 4,
      type: 'main',
      quests: [
        { id: 401, title: '公的保障', type: 'quiz', icon: '🏥', reward: 600, xp: 60, description: '日本の手厚い制度' },
        { id: 402, title: '高額療養費', type: 'quiz', icon: '💊', reward: 600, xp: 60, description: '医療費の上限' },
        { id: 404, title: '貯蓄型保険', type: 'quiz', icon: '📉', reward: 600, xp: 60, description: '投資効率の真実' }
      ]
    },
    {
      id: 5,
      title: '資産運用の入口実践',
      subtitle: 'Investment Start',
      stage: 'NISA の塔',
      icon: '📈',
      color: 'from-yellow-500 to-amber-600',
      borderColor: 'border-yellow-400',
      difficulty: 5,
      type: 'main',
      quests: [
        { id: 501, title: 'NISAメリット', type: 'quiz', icon: '✨', reward: 700, xp: 70, description: '非課税の力' },
        { id: 502, title: 'インデックスファンド', type: 'quiz', icon: '🌍', reward: 700, xp: 70, description: '長期投資の王道' },
        { id: 504, title: '分散投資', type: 'quiz', icon: '🥚', reward: 700, xp: 70, description: '卵とカゴの格言' }
      ]
    },
    {
      id: 6,
      title: '長期ライフプラン設計',
      subtitle: 'Retirement',
      stage: '老後資金の山',
      icon: '⛰️',
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-400',
      difficulty: 6,
      type: 'main',
      quests: [
        { id: 601, title: '三大資金', type: 'quiz', icon: '💼', reward: 800, xp: 80, description: '人生の大きな支出' },
        { id: 602, title: 'iDeCo節税', type: 'quiz', icon: '📜', reward: 800, xp: 80, description: '最強の税制優遇' },
        { id: 603, title: 'iDeCo受給年齢', type: 'quiz', icon: '🔒', reward: 800, xp: 80, description: '60歳まで引き出せない' }
      ]
    },
    {
      id: 7,
      title: 'ストック系報酬の管理',
      subtitle: 'SO/RSU',
      stage: 'ストックの渓谷',
      icon: '📊',
      color: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-400',
      difficulty: 7,
      type: 'main',
      quests: [
        { id: 701, title: 'ベスティング', type: 'quiz', icon: '⏳', reward: 900, xp: 90, description: '権利確定の仕組み' },
        { id: 702, title: '集中リスク', type: 'quiz', icon: '⚠️', reward: 900, xp: 90, description: '卵を一つのカゴに' },
        { id: 707, title: '自社株売却', type: 'quiz', icon: '💱', reward: 900, xp: 90, description: '分散の重要性' }
      ]
    },
    {
      id: 8,
      title: '住宅選びの意思決定',
      subtitle: 'Housing',
      stage: '住居選択の岐路',
      icon: '🏠',
      color: 'from-teal-500 to-cyan-600',
      borderColor: 'border-teal-400',
      difficulty: 8,
      type: 'main',
      quests: [
        { id: 801, title: '流動性', type: 'quiz', icon: '🔄', reward: 1000, xp: 100, description: '売りやすさが重要' },
        { id: 802, title: '住居費比率', type: 'quiz', icon: '📊', reward: 1000, xp: 100, description: '手取りの20-25%' },
        { id: 808, title: '賃貸メリット', type: 'quiz', icon: '🚚', reward: 1000, xp: 100, description: '移動の自由' }
      ]
    },
    {
      id: 9,
      title: '金融トラブル・情報リテラシー',
      subtitle: 'Defense',
      stage: '詐欺の迷宮',
      icon: '🛡️',
      color: 'from-red-500 to-orange-600',
      borderColor: 'border-red-400',
      difficulty: 9,
      type: 'main',
      quests: [
        { id: 901, title: '詐欺見抜き', type: 'quiz', icon: '🚨', reward: 1100, xp: 110, description: '高利回りの罠' },
        { id: 902, title: 'ポンジスキーム', type: 'quiz', icon: '💸', reward: 1100, xp: 110, description: '自転車操業の破綻' },
        { id: 908, title: '防衛策', type: 'quiz', icon: '🔐', reward: 1100, xp: 110, description: '理解できないものに投資しない' }
      ]
    },
    {
      id: 10,
      title: '行動設計と習慣化',
      subtitle: 'Action',
      stage: '習慣の聖域',
      icon: '🎯',
      color: 'from-emerald-500 to-green-600',
      borderColor: 'border-emerald-400',
      difficulty: 10,
      type: 'main',
      quests: [
        { id: 1001, title: '自動積立', type: 'quiz', icon: '🤖', reward: 1200, xp: 120, description: '意志力に頼らない' },
        { id: 1002, title: '投資開始方法', type: 'quiz', icon: '🏃', reward: 1200, xp: 120, description: '少額で走りながら学ぶ' },
        { id: 1010, title: '即実行', type: 'quiz', icon: '⚡', reward: 1200, xp: 120, description: '今日から行動を変える' }
      ]
    }
  ];

  // サブクエストは削除（メインクエストのみに集中）
  const subQuests = [];

  // クエストクリック処理
  const handleQuestClick = (quest, chapter) => {
    // テスト用：全クエストクリック可能
    soundSystem.playNotification();
    setSelectedQuest({ ...quest, chapter });
  };

  const handleStartQuest = () => {
    soundSystem.playClick();
    
    if (!selectedQuest) {
      console.error('No quest selected');
      return;
    }
    
    // チャプターIDをセット
    let targetChapterId = null;
    
    // メインクエストの場合: chapter.idを使用
    if (selectedQuest.chapter && selectedQuest.chapter.id) {
      targetChapterId = selectedQuest.chapter.id;
    } 
    // サブクエストの場合: chapter.chapter_idを使用
    else if (selectedQuest.chapter && selectedQuest.chapter.chapter_id) {
      targetChapterId = selectedQuest.chapter.chapter_id;
    }
    
    console.log('=== Starting Quest ===');
    console.log('Quest ID:', selectedQuest.id);
    console.log('Quest Title:', selectedQuest.title);
    console.log('Chapter:', selectedQuest.chapter);
    console.log('Target Chapter ID:', targetChapterId);
    
    if (setSelectedQuestId) {
      setSelectedQuestId(selectedQuest.id);
      console.log('Set questId:', selectedQuest.id);
    }
    
    if (setSelectedChapterId && targetChapterId) {
      setSelectedChapterId(targetChapterId);
      console.log('Set chapterId:', targetChapterId);
    } else {
      console.warn('No chapter ID found or setter missing');
    }
    
    // モーダルを閉じる
    setSelectedQuest(null);
    
    // クイズ画面に遷移
    console.log('Navigating to quiz screen...');
    onNavigate('quiz');
  };

  // Chapterが完了しているかチェック
  const isChapterCompleted = (chapter) => {
    const chapterQuests = chapter.quests || [];
    return chapterQuests.every(q => completedQuests.includes(q.id));
  };

  // Chapterの進捗を計算
  const getChapterProgress = (chapter) => {
    const chapterQuests = chapter.quests || [];
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
          const allQuests = chapter.quests || [];
          
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
  const [selectedChapterId, setSelectedChapterId] = useState(null);

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
    console.log('=== handleNavigate called ===');
    console.log('Current screen:', currentScreen);
    console.log('Target screen:', screen);
    soundSystem.playClick(); // ナビゲーション音を再生
    setCurrentScreen(screen);
    console.log('setCurrentScreen executed');
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

  // デバッグログ: レンダリング時の状態を出力
  console.log('=== App Render ===');
  console.log('currentScreen:', currentScreen);
  console.log('user:', user ? user.username : 'null');
  console.log('selectedQuestId:', selectedQuestId);
  console.log('selectedChapterId:', selectedChapterId);

  return (
    <>
      {/* Global Finn Overlay - 全画面で常駐 */}
      {user && currentScreen !== 'auth' && (
        <FinnGlobalOverlay currentScreen={currentScreen} />
      )}
      
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
            <MapScreen user={user} onNavigate={handleNavigate} onXpEarned={handleXpEarned} setSelectedQuestId={setSelectedQuestId} setSelectedChapterId={setSelectedChapterId} />
          </motion.div>
        )}

        {currentScreen === 'quiz' && user && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <QuizScreen user={user} onNavigate={handleNavigate} onXpEarned={handleXpEarned} questId={selectedQuestId} chapterId={selectedChapterId} />
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
            <HistoryScreen user={user} />
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
      </AnimatePresence>

      {/* Bottom Navigation - Hide on auth screen */}
      {user && currentScreen !== 'auth' && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}

      {/* 音声トグルボタン */}
      {user && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSound}
          className="fixed top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-xl rounded-full p-3 border border-slate-700"
        >
          <div className="text-2xl">
            {soundEnabled ? '🔊' : '🔇'}
          </div>
        </motion.button>
      )}
    </AppContext.Provider>
    </>
  );
};

// アプリケーションのマウント
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
