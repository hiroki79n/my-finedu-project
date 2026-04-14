// Duolingo風 金融教育アプリ - FINEDU
// React & Framer Motion
const { useState, useEffect, useRef, createContext, useContext } = React;
const { motion, AnimatePresence } = Motion;

// ===== サウンドシステム (既存から再利用) =====
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
  playClick() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      const startTime = this.audioContext.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  }
  playError() {
    if (!this.enabled) return;
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.25);
  }
}
const soundSystem = new SoundSystem();

// ===== データ構造 =====
const CROWN_LEVELS = {
  LOCKED: { level: 0, name: 'ロック中', icon: '🔒', color: 'gray', displayName: 'ロック' },
  CROWN_1: { level: 1, name: 'Crown 1', icon: '👑', color: 'bronze', displayName: 'ブロンズ', minScore: 60 },
  CROWN_2: { level: 2, name: 'Crown 2', icon: '👑👑', color: 'silver', displayName: 'シルバー', minScore: 80 },
  CROWN_3: { level: 3, name: 'Crown 3', icon: '👑👑👑', color: 'gold', displayName: 'ゴールド', minScore: 95 },
  LEGENDARY: { level: 4, name: 'Legendary', icon: '⭐', color: 'legendary', displayName: '伝説', minScore: 100 }
};

// Level 1 のチャプター定義
const LEVEL_1_CHAPTERS = [
  {
    id: 101,
    levelId: 1,
    chapterNumber: 1,
    title: '交換の不便さ',
    titleEn: 'Inconvenience of Exchange',
    description: '物々交換の限界と問題点を理解する',
    icon: '🤝',
    color: 'from-amber-500 to-orange-600',
    difficulty: 1,
    totalQuestions: 22,
    estimatedMinutes: 15,
    tags: ['基礎', '歴史', '物々交換'],
    unlockCondition: null,
    lessons: [
      { id: 10101, order: 1, title: '物々交換とは', type: 'intro', icon: '📖', questionCount: 4 },
      { id: 10102, order: 2, title: '二重の一致の問題', type: 'mechanism', icon: '⚙️', questionCount: 5 },
      { id: 10103, order: 3, title: '古代の交換', type: 'history', icon: '📜', questionCount: 4 },
      { id: 10104, order: 4, title: '現代の物々交換', type: 'application', icon: '💡', questionCount: 5 },
      { id: 10105, order: 5, title: 'Boss Quiz', type: 'boss', icon: '👾', questionCount: 4, isBoss: true }
    ]
  },
  {
    id: 102,
    levelId: 1,
    chapterNumber: 2,
    title: '価値の基準',
    titleEn: 'Standards of Value',
    description: '価値をどう測るか、交換比率の決定',
    icon: '⚖️',
    color: 'from-yellow-500 to-amber-600',
    difficulty: 1,
    totalQuestions: 22,
    estimatedMinutes: 18,
    tags: ['基礎', '価値', '交換'],
    unlockCondition: { chapterId: 101, minCrown: 1 },
    lessons: [
      { id: 10201, order: 1, title: '価値とは何か', type: 'intro', icon: '📖', questionCount: 5 },
      { id: 10202, order: 2, title: '交換比率の決定', type: 'mechanism', icon: '⚙️', questionCount: 4 },
      { id: 10203, order: 3, title: '価値基準の変遷', type: 'history', icon: '📜', questionCount: 4 },
      { id: 10204, order: 4, title: '現代の価値評価', type: 'application', icon: '💡', questionCount: 5 },
      { id: 10205, order: 5, title: 'Boss Quiz', type: 'boss', icon: '👾', questionCount: 4, isBoss: true }
    ]
  },
  {
    id: 103,
    levelId: 1,
    chapterNumber: 3,
    title: '貝殻とビーズ',
    titleEn: 'Shells & Beads',
    description: '最初の「お金」的なものの誕生',
    icon: '🐚',
    color: 'from-green-500 to-emerald-600',
    difficulty: 1,
    totalQuestions: 22,
    estimatedMinutes: 16,
    tags: ['歴史', '原始貨幣', '文化'],
    unlockCondition: { chapterId: 102, minCrown: 1 },
    lessons: [
      { id: 10301, order: 1, title: '原始貨幣とは', type: 'intro', icon: '📖', questionCount: 4 },
      { id: 10302, order: 2, title: 'なぜ貝殻が使われたか', type: 'mechanism', icon: '⚙️', questionCount: 5 },
      { id: 10303, order: 3, title: '世界の原始貨幣', type: 'history', icon: '📜', questionCount: 4 },
      { id: 10304, order: 4, title: '貨幣の条件', type: 'application', icon: '💡', questionCount: 5 },
      { id: 10305, order: 5, title: 'Boss Quiz', type: 'boss', icon: '👾', questionCount: 4, isBoss: true }
    ]
  },
  {
    id: 104,
    levelId: 1,
    chapterNumber: 4,
    title: '金属の登場',
    titleEn: 'Emergence of Metals',
    description: '金や銀が貨幣になるまで',
    icon: '🪙',
    color: 'from-blue-500 to-cyan-600',
    difficulty: 2,
    totalQuestions: 22,
    estimatedMinutes: 20,
    tags: ['歴史', '金属貨幣', '貴金属'],
    unlockCondition: { chapterId: 103, minCrown: 1 },
    lessons: [
      { id: 10401, order: 1, title: '金属の特性', type: 'intro', icon: '📖', questionCount: 5 },
      { id: 10402, order: 2, title: '金本位制の仕組み', type: 'mechanism', icon: '⚙️', questionCount: 5 },
      { id: 10403, order: 3, title: '古代の金貨', type: 'history', icon: '📜', questionCount: 4 },
      { id: 10404, order: 4, title: '現代の金の価値', type: 'application', icon: '💡', questionCount: 4 },
      { id: 10405, order: 5, title: 'Boss Quiz', type: 'boss', icon: '👾', questionCount: 4, isBoss: true }
    ]
  },
  {
    id: 105,
    levelId: 1,
    chapterNumber: 5,
    title: '信用の誕生',
    titleEn: 'Birth of Credit',
    description: '紙幣と信用経済の始まり',
    icon: '📜',
    color: 'from-purple-500 to-indigo-600',
    difficulty: 2,
    totalQuestions: 22,
    estimatedMinutes: 22,
    tags: ['信用', '紙幣', '金融'],
    unlockCondition: { chapterId: 104, minCrown: 1 },
    lessons: [
      { id: 10501, order: 1, title: '紙幣の誕生', type: 'intro', icon: '📖', questionCount: 5 },
      { id: 10502, order: 2, title: '信用創造とは', type: 'mechanism', icon: '⚙️', questionCount: 5 },
      { id: 10503, order: 3, title: '世界初の紙幣', type: 'history', icon: '📜', questionCount: 4 },
      { id: 10504, order: 4, title: '現代の信用システム', type: 'application', icon: '💡', questionCount: 4 },
      { id: 10505, order: 5, title: 'Boss Quiz', type: 'boss', icon: '👾', questionCount: 4, isBoss: true }
    ]
  },
  {
    id: 106,
    levelId: 1,
    chapterNumber: 6,
    title: 'デジタル通貨',
    titleEn: 'Digital Currency',
    description: '電子マネーと仮想通貨の時代',
    icon: '💳',
    color: 'from-pink-500 to-rose-600',
    difficulty: 2,
    totalQuestions: 23,
    estimatedMinutes: 24,
    tags: ['デジタル', '電子決済', '仮想通貨'],
    unlockCondition: { chapterId: 105, minCrown: 1 },
    lessons: [
      { id: 10601, order: 1, title: '電子マネーとは', type: 'intro', icon: '📖', questionCount: 5 },
      { id: 10602, order: 2, title: 'ブロックチェーン基礎', type: 'mechanism', icon: '⚙️', questionCount: 5 },
      { id: 10603, order: 3, title: 'デジタル通貨の歴史', type: 'history', icon: '📜', questionCount: 4 },
      { id: 10604, order: 4, title: '未来の通貨', type: 'application', icon: '💡', questionCount: 5 },
      { id: 10605, order: 5, title: 'Boss Quiz', type: 'boss', icon: '👾', questionCount: 4, isBoss: true }
    ]
  }
];

// ダミーユーザーデータ
const createDefaultUserProgress = () => ({
  userId: 'demo_user_001',
  currentLevel: 1,
  currentChapter: 101,
  totalXp: 0,
  streakDays: 0,
  lastStudyDate: null,
  completedChapters: {}, // { chapterId: { crownLevel, score, completedAt, lessonProgress: {} } }
  weakSpots: [], // [{ questionId, tagId, errorCount, lastReview }]
  reviewQueue: []
});

// ===== メインアプリ =====
function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userProgress, setUserProgress] = useState(createDefaultUserProgress());
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizState, setQuizState] = useState(null);

  // ローカルストレージから進捗を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('finedu_progress');
    if (saved) {
      try {
        setUserProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }, []);

  // 進捗を保存
  useEffect(() => {
    localStorage.setItem('finedu_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // チャプターがアンロックされているかチェック
  const isChapterUnlocked = (chapter) => {
    if (!chapter.unlockCondition) return true;
    const { chapterId, minCrown } = chapter.unlockCondition;
    const prevChapter = userProgress.completedChapters[chapterId];
    return prevChapter && prevChapter.crownLevel >= minCrown;
  };

  // チャプター選択
  const selectChapter = (chapter) => {
    if (!isChapterUnlocked(chapter)) {
      soundSystem.playError();
      return;
    }
    soundSystem.playClick();
    setSelectedChapter(chapter);
    setCurrentScreen('chapterDetail');
  };

  // レッスン開始
  const startLesson = async (lesson) => {
    soundSystem.playClick();
    setSelectedLesson(lesson);
    setCurrentScreen('quiz');
    
    // クイズデータを取得
    try {
      const response = await fetch(`/api/quiz/chapter/${selectedChapter.id}/lesson/${lesson.id}`);
      const questions = await response.json();
      
      setQuizState({
        questions,
        currentIndex: 0,
        answers: [],
        score: 0,
        isCompleted: false
      });
      setCurrentQuestion(questions[0]);
    } catch (error) {
      console.error('Failed to load quiz:', error);
      // フォールバック: ダミーデータ
      loadDummyQuiz(lesson);
    }
  };

  // ダミークイズデータ (API未実装時のフォールバック)
  const loadDummyQuiz = (lesson) => {
    const dummyQuestions = generateDummyQuestions(lesson);
    setQuizState({
      questions: dummyQuestions,
      currentIndex: 0,
      answers: [],
      score: 0,
      isCompleted: false
    });
    setCurrentQuestion(dummyQuestions[0]);
  };

  // 画面遷移
  const navigate = (screen, data = {}) => {
    soundSystem.playClick();
    setCurrentScreen(screen);
    if (data.chapter) setSelectedChapter(data.chapter);
    if (data.lesson) setSelectedLesson(data.lesson);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <HomeScreen 
            key="home"
            userProgress={userProgress}
            chapters={LEVEL_1_CHAPTERS}
            onSelectChapter={selectChapter}
            isChapterUnlocked={isChapterUnlocked}
            onNavigate={navigate}
          />
        )}
        {currentScreen === 'chapterDetail' && selectedChapter && (
          <ChapterDetailScreen
            key="chapterDetail"
            chapter={selectedChapter}
            userProgress={userProgress}
            onStartLesson={startLesson}
            onBack={() => navigate('home')}
          />
        )}
        {currentScreen === 'quiz' && quizState && (
          <QuizScreen
            key="quiz"
            quizState={quizState}
            setQuizState={setQuizState}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            selectedChapter={selectedChapter}
            selectedLesson={selectedLesson}
            onComplete={() => navigate('home')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== ホーム画面 (学習ロード) =====
function HomeScreen({ userProgress, chapters, onSelectChapter, isChapterUnlocked, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 pb-20"
    >
      {/* モバイル最適化ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-teal-600">FinGo</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                <span className="text-amber-600">🔥</span>
                <span className="text-sm font-bold text-amber-800">{userProgress.streakDays}</span>
              </div>
              <div className="flex items-center gap-1 bg-teal-100 px-2 py-1 rounded-full">
                <span className="text-teal-600">⭐</span>
                <span className="text-sm font-bold text-teal-800">{userProgress.totalXp}</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center">Level 1: 交換の始まり</div>
        </div>
      </div>

      {/* Duolingo風 学習パス (道つながり) */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="relative">
          {/* SVGパス背景 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: `${chapters.length * 180}px` }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#5EEAD4', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            {chapters.map((chapter, index) => {
              if (index === chapters.length - 1) return null;
              const y1 = index * 180 + 90;
              const y2 = (index + 1) * 180 + 90;
              const isEven = index % 2 === 0;
              const x1 = isEven ? '30%' : '70%';
              const x2 = !isEven ? '30%' : '70%';
              const cx = isEven ? '50%' : '50%';
              
              return (
                <path
                  key={`path-${index}`}
                  d={`M ${x1} ${y1} Q ${cx} ${(y1 + y2) / 2} ${x2} ${y2}`}
                  stroke="url(#pathGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* チャプターノード */}
          <div className="relative space-y-24">
            {chapters.map((chapter, index) => {
              const isUnlocked = isChapterUnlocked(chapter);
              const progress = userProgress.completedChapters[chapter.id];
              const crownLevel = progress?.crownLevel || 0;
              
              return (
                <ChapterNode
                  key={chapter.id}
                  chapter={chapter}
                  index={index}
                  isUnlocked={isUnlocked}
                  crownLevel={crownLevel}
                  onClick={() => onSelectChapter(chapter)}
                />
              );
            })}
          </div>
        </div>

        {/* 次のレベルプレビュー */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-lg p-6 max-w-xs">
            <div className="text-gray-400 text-5xl mb-3">🔒</div>
            <div className="text-gray-700 font-bold text-lg">Level 2</div>
            <div className="text-gray-600 text-sm">お金の誕生</div>
            <div className="text-xs text-gray-400 mt-2">
              Level 1を完了すると解放
            </div>
          </div>
        </div>
      </div>

      {/* ボトムナビゲーション */}
      <BottomNavigation currentTab="home" />
    </motion.div>
  );
}

// ===== チャプターノード (Duolingo風 モバイル最適化) =====
function ChapterNode({ chapter, index, isUnlocked, crownLevel, onClick }) {
  const isEven = index % 2 === 0;
  const getCrownDisplay = () => {
    if (crownLevel === 0) return null;
    if (crownLevel === 4) return <span className="text-xl">⭐</span>;
    return <span className="text-base">{'👑'.repeat(crownLevel)}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      className={`flex items-center ${isEven ? 'justify-start ml-4' : 'justify-end mr-4'}`}
    >
      <motion.button
        onClick={onClick}
        disabled={!isUnlocked}
        whileTap={isUnlocked ? { scale: 0.9 } : {}}
        className="relative"
        style={{ touchAction: 'manipulation' }}
      >
        {/* メインノード - モバイル最適化サイズ */}
        <div 
          className={`
            w-20 h-20 rounded-full shadow-xl flex items-center justify-center text-3xl
            transition-all duration-200 border-4 border-white
            ${isUnlocked 
              ? `bg-gradient-to-br ${chapter.color} cursor-pointer active:shadow-2xl` 
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {isUnlocked ? chapter.icon : '🔒'}
        </div>

        {/* Crown表示 - モバイル用小型化 */}
        {crownLevel > 0 && (
          <div className="absolute -top-1 -right-1 bg-white rounded-full shadow-lg px-1.5 py-0.5 border-2 border-teal-200">
            {getCrownDisplay()}
          </div>
        )}

        {/* 進捗リング */}
        {isUnlocked && crownLevel > 0 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50%"
              cy="50%"
              r="38"
              stroke="#14B8A6"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${(crownLevel / 4) * 240} 240`}
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        )}

        {/* タイトル - モバイル用配置最適化 */}
        <div className={`absolute top-full mt-3 ${isEven ? 'left-0' : 'right-0'} w-24 text-center`}>
          <div className={`text-xs font-bold leading-tight ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
            {chapter.title}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">
            {chapter.totalQuestions}問
          </div>
        </div>

        {/* タップフィードバック領域拡大 */}
        <div className="absolute inset-0 -m-4" />
      </motion.button>
    </motion.div>
  );
}

// ===== ボトムナビゲーション =====
function BottomNavigation({ currentTab }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'ホーム' },
    { id: 'review', icon: '📚', label: '復習' },
    { id: 'profile', icon: '👤', label: 'プロフィール' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <div className="max-w-md mx-auto px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                currentTab === tab.id ? 'text-teal-600' : 'text-gray-400'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== チャプター詳細画面 (モバイル最適化) =====
function ChapterDetailScreen({ chapter, userProgress, onStartLesson, onBack }) {
  const progress = userProgress.completedChapters[chapter.id] || {};
  const crownLevel = progress.crownLevel || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 pb-6"
    >
      {/* モバイルヘッダー */}
      <div className={`bg-gradient-to-br ${chapter.color} text-white rounded-b-3xl shadow-xl`}>
        <div className="max-w-md mx-auto px-4 py-6">
          <button 
            onClick={onBack} 
            className="text-white mb-4 flex items-center gap-2 active:opacity-70 py-2 px-3 -ml-3 rounded-lg"
            style={{ touchAction: 'manipulation' }}
          >
            <i className="fas fa-arrow-left text-lg"></i>
            <span className="font-medium">戻る</span>
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl bg-white/20 p-3 rounded-2xl">{chapter.icon}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{chapter.title}</h1>
              <p className="text-white/90 text-xs leading-relaxed">{chapter.description}</p>
            </div>
          </div>

          {/* Crown レベル & 統計 */}
          <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-90">あなたのレベル:</span>
              {crownLevel === 0 && <span className="text-sm font-bold">未挑戦</span>}
              {crownLevel > 0 && crownLevel < 4 && <span className="text-xl">{'👑'.repeat(crownLevel)}</span>}
              {crownLevel === 4 && <span className="text-lg">⭐ 伝説</span>}
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80">全{chapter.totalQuestions}問</div>
              <div className="text-xs opacity-80">{chapter.estimatedMinutes}分</div>
            </div>
          </div>
        </div>
      </div>

      {/* レッスンリスト - モバイル最適化 */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-3">
          {chapter.lessons.map((lesson, index) => {
            const lessonProgress = progress.lessonProgress?.[lesson.id];
            const isCompleted = lessonProgress?.completed || false;
            
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                isCompleted={isCompleted}
                onStart={() => onStartLesson(lesson)}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ===== レッスンカード (モバイル最適化) =====
function LessonCard({ lesson, index, isCompleted, onStart }) {
  const isBoss = lesson.isBoss;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <button
        onClick={onStart}
        className={`
          w-full p-4 rounded-2xl shadow-lg active:shadow-xl transition-all
          ${isBoss 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-300' 
            : 'bg-white active:bg-gray-50 border-2 border-teal-100'
          }
          flex items-center justify-between
        `}
        style={{ touchAction: 'manipulation' }}
      >
        <div className="flex items-center gap-3">
          <div className={`text-3xl ${isBoss ? 'animate-bounce' : ''} flex-shrink-0`}>
            {lesson.icon}
          </div>
          <div className="text-left">
            <div className={`font-bold text-base ${isBoss ? 'text-white' : 'text-gray-800'}`}>
              {lesson.title}
            </div>
            <div className={`text-xs ${isBoss ? 'text-white/90' : 'text-gray-500'} mt-0.5`}>
              {lesson.questionCount}問 {isBoss && '• Boss 🏆'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isCompleted && (
            <div className="bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md">
              <i className="fas fa-check text-xs"></i>
            </div>
          )}
          <i className={`fas fa-chevron-right text-sm ${isBoss ? 'text-white' : 'text-gray-400'}`}></i>
        </div>
      </button>
    </motion.div>
  );
}

// ===== クイズ画面 =====
function QuizScreen({ 
  quizState, 
  setQuizState, 
  currentQuestion, 
  setCurrentQuestion,
  userProgress,
  setUserProgress,
  selectedChapter,
  selectedLesson,
  onComplete 
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!quizState || !currentQuestion) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const progress = (quizState.currentIndex / quizState.questions.length) * 100;

  const handleAnswer = (answerIndex) => {
    if (showFeedback) return;
    
    soundSystem.playClick();
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      soundSystem.playSuccess();
    } else {
      soundSystem.playError();
    }

    // 回答を記録
    const newAnswers = [...quizState.answers, {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      correct: currentQuestion.correctAnswer,
      isCorrect: correct
    }];

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      score: prev.score + (correct ? (currentQuestion.xp || 10) : 0)
    }));

    // APIに送信
    try {
      await fetch('/api/quiz/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProgress.userId,
          questionId: currentQuestion.id,
          chapterId: selectedChapter.id,
          lessonId: selectedLesson.id,
          selectedAnswer: selectedAnswer,
          isCorrect: correct
        })
      });
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (quizState.currentIndex + 1 < quizState.questions.length) {
      const nextIndex = quizState.currentIndex + 1;
      setQuizState(prev => ({ ...prev, currentIndex: nextIndex }));
      setCurrentQuestion(quizState.questions[nextIndex]);
    } else {
      // クイズ完了
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const totalQuestions = quizState.questions.length;
    const correctCount = quizState.answers.filter(a => a.isCorrect).length;
    const scorePercentage = (correctCount / totalQuestions) * 100;

    // Crown レベル決定
    let newCrownLevel = 0;
    if (scorePercentage >= 100) newCrownLevel = 4; // Legendary
    else if (scorePercentage >= 95) newCrownLevel = 3;
    else if (scorePercentage >= 80) newCrownLevel = 2;
    else if (scorePercentage >= 60) newCrownLevel = 1;

    // 進捗更新
    const updatedProgress = { ...userProgress };
    if (!updatedProgress.completedChapters[selectedChapter.id]) {
      updatedProgress.completedChapters[selectedChapter.id] = {
        crownLevel: 0,
        lessonProgress: {}
      };
    }

    const chapterProgress = updatedProgress.completedChapters[selectedChapter.id];
    chapterProgress.lessonProgress[selectedLesson.id] = {
      completed: true,
      correctCount,
      totalCount: totalQuestions,
      lastAttempt: new Date().toISOString()
    };

    // Crown レベル更新 (最高記録を保持)
    if (newCrownLevel > chapterProgress.crownLevel) {
      chapterProgress.crownLevel = newCrownLevel;
    }

    // XP更新
    updatedProgress.totalXp += quizState.score;

    setUserProgress(updatedProgress);
    
    // 完了画面表示
    setQuizState(prev => ({
      ...prev,
      isCompleted: true,
      finalScore: scorePercentage,
      crownLevel: newCrownLevel
    }));
  };

  if (quizState.isCompleted) {
    return (
      <ResultScreen
        score={quizState.finalScore}
        crownLevel={quizState.crownLevel}
        totalXp={quizState.score}
        chapter={selectedChapter}
        lesson={selectedLesson}
        onContinue={onComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex flex-col">
      {/* モバイル最適化プログレスバー */}
      <div className="bg-white shadow-sm">
        <div className="h-1.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-4 py-2 flex justify-between items-center">
          <div className="text-xs text-gray-600 font-medium">
            {quizState.currentIndex + 1} / {quizState.questions.length}
          </div>
          <div className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
            +{quizState.score} XP
          </div>
        </div>
      </div>

      {/* 問題エリア - モバイル最適化 */}
      <div className="flex-1 flex items-start justify-center p-4 pt-6 overflow-y-auto">
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-5"
            >
              {/* 問題文 - モバイル用フォントサイズ */}
              <h2 className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* 選択肢 - モバイル最適化 */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, index) => (
                  <AnswerButton
                    key={index}
                    option={option}
                    index={index}
                    selected={selectedAnswer === index}
                    correct={currentQuestion.correctAnswer === index}
                    showFeedback={showFeedback}
                    onClick={() => handleAnswer(index)}
                  />
                ))}
              </div>

              {/* フィードバック - モバイル最適化 */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200"
                >
                  <div className={`font-bold mb-2 text-base flex items-center gap-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                    <span>{isCorrect ? '正解！' : '不正解'}</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* モバイル最適化アクションボタン */}
      <div className="bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <div className="max-w-md mx-auto">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-teal-500 to-cyan-500 
                disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                active:scale-95 shadow-lg transition-all"
              style={{ touchAction: 'manipulation' }}
            >
              回答する
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-teal-600 to-cyan-600
                active:scale-95 shadow-lg transition-all"
              style={{ touchAction: 'manipulation' }}
            >
              {quizState.currentIndex + 1 < quizState.questions.length ? '次へ ➜' : '結果を見る 🎉'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== 回答ボタン (モバイル最適化) =====
function AnswerButton({ option, index, selected, correct, showFeedback, onClick }) {
  let bgClass = 'bg-white border-2 border-gray-200 active:bg-teal-50';
  let textClass = 'text-gray-800';
  
  if (showFeedback) {
    if (correct) {
      bgClass = 'bg-green-100 border-2 border-green-500';
      textClass = 'text-green-900';
    } else if (selected && !correct) {
      bgClass = 'bg-red-100 border-2 border-red-500';
      textClass = 'text-red-900';
    }
  } else if (selected) {
    bgClass = 'bg-teal-100 border-2 border-teal-500';
    textClass = 'text-teal-900';
  }

  return (
    <motion.button
      onClick={onClick}
      whileTap={!showFeedback ? { scale: 0.97 } : {}}
      className={`w-full p-4 rounded-2xl text-left transition-all shadow-sm ${bgClass}`}
      disabled={showFeedback}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
          ${selected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'}
          ${showFeedback && correct ? 'bg-green-500 text-white' : ''}
          ${showFeedback && selected && !correct ? 'bg-red-500 text-white' : ''}
        `}>
          {String.fromCharCode(65 + index)}
        </div>
        <div className={`flex-1 font-medium text-sm leading-relaxed ${textClass}`}>
          {option}
        </div>
        {showFeedback && correct && <span className="text-green-600 text-2xl flex-shrink-0">✓</span>}
        {showFeedback && selected && !correct && <span className="text-red-600 text-2xl flex-shrink-0">✗</span>}
      </div>
    </motion.button>
  );
}

// ===== 結果画面 (モバイル最適化) =====
function ResultScreen({ score, crownLevel, totalXp, chapter, lesson, onContinue }) {
  const getCrownInfo = () => {
    if (crownLevel === 4) return { icon: '⭐', name: '伝説', color: 'from-yellow-400 to-amber-500', emoji: '🎊' };
    if (crownLevel === 3) return { icon: '👑👑👑', name: 'ゴールド', color: 'from-yellow-500 to-orange-500', emoji: '🏆' };
    if (crownLevel === 2) return { icon: '👑👑', name: 'シルバー', color: 'from-gray-400 to-gray-500', emoji: '🥈' };
    if (crownLevel === 1) return { icon: '👑', name: 'ブロンズ', color: 'from-orange-600 to-red-600', emoji: '🥉' };
    return { icon: '📚', name: '完了', color: 'from-teal-500 to-cyan-500', emoji: '✅' };
  };

  const crownInfo = getCrownInfo();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4"
    >
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl p-6 text-center">
        {/* アニメーション付きアイコン */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-4"
        >
          {crownInfo.icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {lesson.title}
          </h2>

          <div className={`inline-block px-5 py-2 rounded-full bg-gradient-to-r ${crownInfo.color} text-white font-bold text-base mb-6 shadow-lg`}>
            {crownInfo.emoji} {crownInfo.name}
          </div>

          {/* 統計カード - モバイル最適化 */}
          <div className="space-y-3 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl border border-teal-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="text-sm text-gray-600 font-medium">正解率</span>
              </div>
              <span className="text-2xl font-bold text-teal-600">{Math.round(score)}%</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-2xl border border-cyan-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-sm text-gray-600 font-medium">獲得XP</span>
              </div>
              <span className="text-2xl font-bold text-cyan-600">+{totalXp}</span>
            </motion.div>
          </div>

          {/* モバイル最適化ボタン */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={onContinue}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-teal-500 to-cyan-500
              active:scale-95 shadow-lg transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            学習を続ける 🚀
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ===== ダミークイズ生成 (API未実装時) =====
function generateDummyQuestions(lesson) {
  // Chapter 101 Lesson 10101 用のダミーデータ
  return [
    {
      id: 101001,
      question: '物々交換とは何ですか?',
      options: [
        'お金を使わずに物と物を直接交換すること',
        'お店で商品を買うこと',
        '銀行でお金を預けること',
        '友達にプレゼントをあげること'
      ],
      correctAnswer: 0,
      explanation: '物々交換とは、お金を使わずに物と物を直接交換する取引方法です。人類最古の交換形態です。',
      xp: 10
    },
    {
      id: 101002,
      question: '物々交換は、お金が発明される前から存在していた。',
      options: ['正しい', '間違い'],
      correctAnswer: 0,
      explanation: '正しいです。物々交換は貨幣が発明される以前から人類が行っていた最も原始的な経済活動です。',
      xp: 10
    },
    {
      id: 101003,
      question: '次のうち、物々交換の例として正しいものはどれですか?',
      options: [
        'りんご3個と魚2匹を交換した',
        '100円でパンを買った',
        'お小遣いを貯金箱に入れた',
        '友達にプレゼントをもらった'
      ],
      correctAnswer: 0,
      explanation: 'りんごと魚を直接交換するのが物々交換です。お金を介さない点が重要です。',
      xp: 10
    },
    {
      id: 101004,
      question: '物々交換の利点は何ですか?',
      options: [
        'お金がなくても取引できる',
        'いつでも好きなものと交換できる',
        '値段を計算しなくてよい',
        '銀行に行かなくてよい'
      ],
      correctAnswer: 0,
      explanation: '物々交換の最大の利点は、お金(貨幣)がなくても物資の交換ができることです。',
      xp: 10
    }
  ];
}

// ===== アプリ起動 =====
ReactDOM.render(<App />, document.getElementById('root'));
