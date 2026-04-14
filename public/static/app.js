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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        {currentScreen === 'market' && (
          <MarketScreen key="market" onNavigate={navigate} />
        )}
        {currentScreen === 'news' && (
          <NewsScreen key="news" onNavigate={navigate} />
        )}
        {currentScreen === 'portfolio' && (
          <PortfolioScreen key="portfolio" userProgress={userProgress} onNavigate={navigate} />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen key="profile" userProgress={userProgress} onNavigate={navigate} />
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

// ===== ホーム画面 (山登りデザイン) =====
function HomeScreen({ userProgress, chapters, onSelectChapter, isChapterUnlocked, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20"
    >
      {/* ダークモードヘッダー */}
      <div className="bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-teal-500/20 sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-3 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              FinGo
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-amber-500/30">
                <span className="text-amber-400">🔥</span>
                <span className="text-sm font-bold text-amber-300">{userProgress.streakDays}</span>
              </div>
              <div className="flex items-center gap-1 bg-teal-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-teal-500/30">
                <span className="text-teal-400">⭐</span>
                <span className="text-sm font-bold text-teal-300">{userProgress.totalXp}</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-teal-400/80 text-center font-medium">Level 1: 交換の始まり 🏔️</div>
        </div>
      </div>

      {/* 冒険パス */}
      <div className="max-w-sm mx-auto px-3 py-6 relative">
        {/* 背景の装飾要素 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          {/* 星の装飾 */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-teal-400"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                fontSize: `${Math.random() * 10 + 15}px`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              ✦
            </div>
          ))}
        </div>

        <div className="relative">
          {/* シンプルな冒険パス */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 1200" preserveAspectRatio="xMidYMid meet" style={{ height: `${chapters.length * 200}px` }}>
            <defs>
              {/* モダンなグラデーション */}
              <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#0891b2', stopOpacity: 0.3 }} />
                <stop offset="50%" style={{ stopColor: '#14b8a6', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#2dd4bf', stopOpacity: 0.8 }} />
              </linearGradient>
              
              {/* ソフトグロー */}
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* クリーンなパスライン */}
            {chapters.map((chapter, index) => {
              if (index === chapters.length - 1) return null;
              
              const baseY = (chapters.length - index) * 200;
              const nextBaseY = (chapters.length - index - 1) * 200;
              const isEven = index % 2 === 0;
              const x1 = isEven ? 100 : 300;
              const x2 = !isEven ? 100 : 300;
              
              const progress = userProgress.completedChapters[chapter.id];
              const isCompleted = progress?.crownLevel > 0;
              
              return (
                <g key={`path-${index}`}>
                  {/* メインパス - シンプルな実線 */}
                  <path
                    d={`M ${x1} ${baseY} Q 200 ${(baseY + nextBaseY) / 2 - 20} ${x2} ${nextBaseY}`}
                    stroke={isCompleted ? 'url(#pathGradient)' : '#334155'}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={isCompleted ? '0' : '8 4'}
                    opacity={isCompleted ? 1 : 0.3}
                    style={{ transition: 'all 0.5s ease' }}
                  />
                  
                  {/* 完了したパスのグロー効果 */}
                  {isCompleted && (
                    <path
                      d={`M ${x1} ${baseY} Q 200 ${(baseY + nextBaseY) / 2 - 20} ${x2} ${nextBaseY}`}
                      stroke="url(#pathGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      filter="url(#softGlow)"
                      opacity="0.4"
                    />
                  )}
                </g>
              );
            })}
            
            {/* マイルストーンマーカー */}
            {chapters.map((chapter, index) => {
              const baseY = (chapters.length - index) * 200;
              const isEven = index % 2 === 0;
              const x = isEven ? 100 : 300;
              const progress = userProgress.completedChapters[chapter.id];
              const isCompleted = progress?.crownLevel > 0;
              
              return (
                <g key={`marker-${index}`}>
                  {/* チェックポイントの円 */}
                  <circle
                    cx={x}
                    cy={baseY}
                    r="4"
                    fill={isCompleted ? '#14b8a6' : '#475569'}
                    opacity={isCompleted ? 1 : 0.5}
                  />
                </g>
              );
            })}
          </svg>

          {/* チャプターノード - 山を登るように配置 (センター寄り、段階的サイズ) */}
          <div className="relative" style={{ paddingTop: `${chapters.length * 200 - 200}px` }}>
            {chapters.map((chapter, index) => {
              const isUnlocked = isChapterUnlocked(chapter);
              const progress = userProgress.completedChapters[chapter.id];
              const crownLevel = progress?.crownLevel || 0;
              
              // 現在の進捗に基づいて「現在位置」を決定
              const currentChapterIndex = chapters.findIndex(ch => !userProgress.completedChapters[ch.id]?.crownLevel);
              const targetIndex = currentChapterIndex === -1 ? chapters.length - 1 : currentChapterIndex;
              
              // 現在位置からの距離に基づいてサイズを計算
              const distance = Math.abs(index - targetIndex);
              let scale = 1.0;
              if (distance === 0) scale = 1.2; // 現在位置: 最大
              else if (distance === 1) scale = 1.0; // 1つ離れた位置
              else if (distance === 2) scale = 0.85; // 2つ離れた位置
              else scale = 0.7; // それ以上離れた位置
              
              return (
                <div
                  key={chapter.id}
                  className="absolute"
                  style={{ 
                    top: `${(chapters.length - index - 1) * 200}px`,
                    left: 0,
                    right: 0
                  }}
                >
                  <ChapterNode
                    chapter={chapter}
                    index={index}
                    isUnlocked={isUnlocked}
                    crownLevel={crownLevel}
                    isCurrent={index === targetIndex}
                    scale={scale}
                    onClick={() => onSelectChapter(chapter)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ゴール - 次のレベルプレビュー */}
        <div className="mt-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="inline-block bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md border border-teal-400/20 rounded-3xl shadow-2xl p-6 max-w-xs relative overflow-hidden"
          >
            {/* 背景の装飾 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="text-4xl mb-3">🏁</div>
              <div className="text-teal-300 font-bold text-base mb-1">Level 2</div>
              <div className="text-teal-400/70 text-sm mb-3">お金の誕生</div>
              <div className="inline-flex items-center gap-1.5 bg-slate-700/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-400 border border-slate-600/50">
                <span>🔒</span>
                <span>Level 1を完了</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ボトムナビゲーション */}
      <BottomNavigation currentTab="home" onNavigate={onNavigate} />
    </motion.div>
  );
}

// ===== チャプターノード (モダンでシンプル、冒険的デザイン) =====
function ChapterNode({ chapter, index, isUnlocked, crownLevel, isCurrent = false, scale = 1.0, onClick }) {
  const isEven = index % 2 === 0;
  const getCrownDisplay = () => {
    if (crownLevel === 0) return null;
    if (crownLevel === 4) return <span className="text-sm">⭐</span>;
    return <span className="text-xs">{'👑'.repeat(crownLevel)}</span>;
  };

  // スケールに基づいてサイズを計算
  const baseSize = 70;
  const nodeSize = Math.round(baseSize * scale);
  const iconSize = Math.round(28 * scale);
  const fontSize = `${iconSize}px`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-center justify-center gap-2"
      style={{
        marginLeft: isEven ? '8%' : '0',
        marginRight: isEven ? '0' : '8%'
      }}
    >
      <motion.button
        onClick={onClick}
        disabled={!isUnlocked}
        whileHover={isUnlocked ? { scale: 1.1 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
        className="relative group"
        style={{ touchAction: 'manipulation' }}
      >
        {/* 現在位置のパルスエフェクト */}
        {isCurrent && isUnlocked && (
          <>
            <motion.div 
              className="absolute inset-0 rounded-full bg-teal-400/30"
              style={{
                width: `${nodeSize + 20}px`,
                height: `${nodeSize + 20}px`,
                left: '-10px',
                top: '-10px'
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-0 rounded-full bg-teal-400/20"
              style={{
                width: `${nodeSize + 10}px`,
                height: `${nodeSize + 10}px`,
                left: '-5px',
                top: '-5px'
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* メインノード - クリーンで現代的 */}
        <div 
          className={`
            relative rounded-full shadow-lg flex items-center justify-center
            transition-all duration-300 border-2
            ${isUnlocked 
              ? `bg-gradient-to-br ${chapter.color} border-teal-400/60 cursor-pointer 
                 hover:shadow-2xl hover:shadow-teal-500/30 hover:border-teal-300` 
              : 'bg-slate-800/50 border-slate-600/50 cursor-not-allowed backdrop-blur-sm'
            }
            ${isCurrent && isUnlocked ? 'ring-2 ring-teal-400/50 ring-offset-2 ring-offset-slate-900' : ''}
          `}
          style={{
            width: `${nodeSize}px`,
            height: `${nodeSize}px`,
            fontSize: fontSize
          }}
        >
          {isUnlocked ? chapter.icon : '🔒'}
        </div>

        {/* Crown バッジ - モダンなデザイン */}
        {crownLevel > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, delay: index * 0.08 + 0.3 }}
            className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-md px-1 py-0.5 border border-amber-200"
            style={{
              fontSize: `${Math.round(12 * scale)}px`
            }}
          >
            {getCrownDisplay()}
          </motion.div>
        )}

        {/* 進捗リング - シンプルなデザイン */}
        {isUnlocked && crownLevel > 0 && (
          <svg 
            className="absolute inset-0" 
            style={{ 
              transform: 'rotate(-90deg)',
              width: `${nodeSize}px`,
              height: `${nodeSize}px`
            }}
          >
            <circle
              cx="50%"
              cy="50%"
              r={nodeSize / 2 - 6}
              stroke="#14B8A6"
              strokeWidth={Math.max(2, Math.round(3 * scale))}
              fill="none"
              strokeDasharray={`${(crownLevel / 4) * 240 * scale} ${240 * scale}`}
              strokeLinecap="round"
              opacity="0.8"
              filter="url(#glow)"
            />
          </svg>
        )}

      </motion.button>

      {/* チャプター情報 - クリーンでモダン */}
      <div className="text-center">
        <div 
          className={`font-semibold leading-tight transition-colors duration-300 ${
            isUnlocked ? 'text-teal-300' : 'text-slate-600'
          } ${isCurrent ? 'text-teal-200' : ''}`}
          style={{ fontSize: `${Math.round(11 * scale)}px` }}
        >
          {chapter.title}
        </div>
        {isUnlocked && (
          <div 
            className="mt-0.5 text-teal-500/60 font-medium"
            style={{ fontSize: `${Math.round(9 * scale)}px` }}
          >
            {chapter.totalQuestions}問
          </div>
        )}

        {/* タップフィードバック領域拡大 */}
        <div className="absolute inset-0 -m-4" />
      </motion.button>
    </motion.div>
  );
}

// ===== ボトムナビゲーション (ダークモード - 5タブ) =====
function BottomNavigation({ currentTab, onNavigate }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'ホーム' },
    { id: 'market', icon: '📈', label: '市場' },
    { id: 'news', icon: '📰', label: 'ニュース' },
    { id: 'portfolio', icon: '💼', label: '資産' },
    { id: 'profile', icon: '👤', label: 'プロフィール' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-teal-500/20 shadow-2xl z-20">
      <div className="max-w-sm mx-auto px-2 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onNavigate && onNavigate(tab.id)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all ${
                currentTab === tab.id 
                  ? 'text-teal-400 bg-teal-500/10' 
                  : 'text-gray-500 hover:text-gray-400'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 市場画面 (Market Screen) =====
function MarketScreen({ onNavigate }) {
  const [selectedIndex, setSelectedIndex] = useState('NIKKEI');
  
  const indices = [
    { id: 'NIKKEI', name: '日経平均', value: '¥38,915', change: '+2.3%', trend: 'up' },
    { id: 'TOPIX', name: 'TOPIX', value: '2,715', change: '+1.8%', trend: 'up' },
    { id: 'SP500', name: 'S&P 500', value: '$5,815', change: '-0.5%', trend: 'down' },
    { id: 'NASDAQ', name: 'NASDAQ', value: '18,342', change: '+1.2%', trend: 'up' }
  ];

  const stocks = [
    { symbol: 'AAPL', name: 'Apple', price: '$189.95', change: '+1.2%', trend: 'up' },
    { symbol: 'GOOGL', name: 'Google', price: '$139.87', change: '-0.8%', trend: 'down' },
    { symbol: 'TSLA', name: 'Tesla', price: '$248.42', change: '+3.5%', trend: 'up' },
    { symbol: 'MSFT', name: 'Microsoft', price: '$415.26', change: '+0.7%', trend: 'up' },
    { symbol: 'AMZN', name: 'Amazon', price: '$178.35', change: '+2.1%', trend: 'up' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24"
    >
      {/* ヘッダー */}
      <div className="bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-teal-500/20 sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-3 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            📈 市場
          </h1>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-3 py-4">
        {/* 主要指数 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-300 mb-3">主要指数</h2>
          <div className="grid grid-cols-2 gap-3">
            {indices.map(index => (
              <button
                key={index.id}
                onClick={() => setSelectedIndex(index.id)}
                className={`p-4 rounded-xl transition-all ${
                  selectedIndex === index.id
                    ? 'bg-teal-500/20 border-2 border-teal-400/50 shadow-lg'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                <div className="text-left">
                  <div className="text-xs text-gray-400 mb-1">{index.name}</div>
                  <div className="text-lg font-bold text-white mb-1">{index.value}</div>
                  <div className={`text-sm font-semibold ${
                    index.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {index.trend === 'up' ? '▲' : '▼'} {index.change}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 簡易チャート表示エリア */}
        <div className="mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="text-center text-gray-400 py-12">
              <div className="text-4xl mb-3">📊</div>
              <div className="text-sm">チャート表示エリア</div>
              <div className="text-xs text-gray-500 mt-2">今後のアップデートで実装予定</div>
            </div>
          </div>
        </div>

        {/* 注目銘柄 */}
        <div>
          <h2 className="text-lg font-bold text-teal-300 mb-3">注目銘柄</h2>
          <div className="space-y-3">
            {stocks.map(stock => (
              <div
                key={stock.symbol}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/70 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{stock.symbol}</div>
                    <div className="text-xs text-gray-400">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{stock.price}</div>
                    <div className={`text-xs font-semibold ${
                      stock.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.trend === 'up' ? '▲' : '▼'} {stock.change}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation currentTab="market" onNavigate={onNavigate} />
    </motion.div>
  );
}

// ===== ニュース画面 (News Screen) =====
function NewsScreen({ onNavigate }) {
  const newsItems = [
    {
      id: 1,
      title: '日銀、金融政策据え置き決定',
      summary: '日本銀行は政策金利を現行水準に据え置くことを決定。市場は...',
      category: '金融政策',
      time: '2時間前',
      image: '🏦',
      importance: 'high'
    },
    {
      id: 2,
      title: 'テスラ、第3四半期決算を発表',
      summary: '電気自動車大手テスラが好調な決算を発表。売上高は前年同期比...',
      category: '企業',
      time: '5時間前',
      image: '🚗',
      importance: 'medium'
    },
    {
      id: 3,
      title: '円相場、一時149円台まで下落',
      summary: '外国為替市場で円安が進行。米ドルに対して一時149円台まで...',
      category: '為替',
      time: '1日前',
      image: '💱',
      importance: 'high'
    },
    {
      id: 4,
      title: 'ビットコイン、4万ドル突破',
      summary: '暗号資産ビットコインが節目の4万ドルを突破。機関投資家の...',
      category: '暗号資産',
      time: '1日前',
      image: '₿',
      importance: 'medium'
    },
    {
      id: 5,
      title: '新NISA、利用者が急増',
      summary: '2024年から始まった新NISAの利用者が急増。若年層を中心に...',
      category: '投資',
      time: '2日前',
      image: '📊',
      importance: 'low'
    }
  ];

  const categories = ['すべて', '金融政策', '企業', '為替', '暗号資産', '投資'];
  const [selectedCategory, setSelectedCategory] = useState('すべて');

  const filteredNews = selectedCategory === 'すべて' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24"
    >
      {/* ヘッダー */}
      <div className="bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-teal-500/20 sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-3 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            📰 ニュース
          </h1>
          
          {/* カテゴリタブ */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800/50 text-gray-400 border border-slate-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-3 py-4">
        <div className="space-y-3">
          {filteredNews.map(news => (
            <div
              key={news.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{news.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        news.importance === 'high' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : news.importance === 'medium'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {news.category}
                      </span>
                      <span className="text-xs text-gray-500">{news.time}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {news.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation currentTab="news" onNavigate={onNavigate} />
    </motion.div>
  );
}

// ===== 資産画面 (Portfolio Screen) =====
function PortfolioScreen({ userProgress, onNavigate }) {
  // ユーザーの仮想資産データ（学習進捗に基づいて生成）
  const totalValue = 1000000 + (userProgress.totalXp * 100);
  const cash = 300000 + (userProgress.totalXp * 30);
  const investedValue = totalValue - cash;
  
  const holdings = [
    { 
      symbol: 'AAPL', 
      name: 'Apple', 
      quantity: 10,
      avgPrice: 180.50,
      currentPrice: 189.95,
      change: '+5.2%',
      trend: 'up'
    },
    { 
      symbol: 'GOOGL', 
      name: 'Google', 
      quantity: 5,
      avgPrice: 142.30,
      currentPrice: 139.87,
      change: '-1.7%',
      trend: 'down'
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla', 
      quantity: 8,
      avgPrice: 235.00,
      currentPrice: 248.42,
      change: '+5.7%',
      trend: 'up'
    }
  ];

  const formatCurrency = (value) => {
    return `¥${value.toLocaleString()}`;
  };

  const calculateGainLoss = (holding) => {
    const costBasis = holding.quantity * holding.avgPrice * 150; // USD to JPY
    const currentValue = holding.quantity * holding.currentPrice * 150;
    const gain = currentValue - costBasis;
    const percentage = ((gain / costBasis) * 100).toFixed(2);
    return { gain, percentage, isPositive: gain >= 0 };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24"
    >
      {/* ヘッダー */}
      <div className="bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-teal-500/20 sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-3 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            💼 資産
          </h1>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-3 py-4">
        {/* 総資産カード */}
        <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="text-sm text-teal-300 mb-2">総資産評価額</div>
          <div className="text-3xl font-bold text-white mb-4">
            {formatCurrency(totalValue)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">投資額</div>
              <div className="text-lg font-semibold text-white">{formatCurrency(investedValue)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">現金</div>
              <div className="text-lg font-semibold text-white">{formatCurrency(cash)}</div>
            </div>
          </div>
        </div>

        {/* 学習で獲得した仮想資金 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🎓</span>
            <span className="text-sm font-semibold text-amber-300">学習報酬</span>
          </div>
          <div className="text-xs text-gray-300">
            学習で獲得したXP: <span className="font-bold text-amber-400">{userProgress.totalXp}</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            報酬総額: <span className="font-bold text-teal-400">{formatCurrency(userProgress.totalXp * 100)}</span>
          </div>
        </div>

        {/* 保有銘柄 */}
        <div>
          <h2 className="text-lg font-bold text-teal-300 mb-3">保有銘柄</h2>
          <div className="space-y-3">
            {holdings.map(holding => {
              const { gain, percentage, isPositive } = calculateGainLoss(holding);
              return (
                <div
                  key={holding.symbol}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-white">{holding.symbol}</div>
                      <div className="text-xs text-gray-400">{holding.name}</div>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded ${
                      isPositive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isPositive ? '+' : ''}{percentage}%
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">保有数</div>
                      <div className="text-white font-semibold">{holding.quantity}株</div>
                    </div>
                    <div>
                      <div className="text-gray-500">平均取得</div>
                      <div className="text-white font-semibold">${holding.avgPrice}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">現在値</div>
                      <div className="text-white font-semibold">${holding.currentPrice}</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">評価損益</span>
                      <span className={`font-semibold ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {isPositive ? '+' : ''}{formatCurrency(gain)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* プレースホルダー：今後の機能 */}
        <div className="mt-6 bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center">
          <div className="text-3xl mb-2">🚀</div>
          <div className="text-sm text-gray-400 mb-1">今後の機能</div>
          <div className="text-xs text-gray-500">
            取引履歴・パフォーマンス分析・リバランス提案など
          </div>
        </div>
      </div>

      <BottomNavigation currentTab="portfolio" onNavigate={onNavigate} />
    </motion.div>
  );
}

// ===== プロフィール画面 (Profile Screen) =====
function ProfileScreen({ userProgress, onNavigate }) {
  const level = Math.floor(userProgress.totalXp / 1000) + 1;
  const xpForNextLevel = 1000;
  const currentLevelXp = userProgress.totalXp % 1000;
  const progressPercentage = (currentLevelXp / xpForNextLevel) * 100;

  const stats = [
    { label: '総XP', value: userProgress.totalXp, icon: '⭐' },
    { label: 'レベル', value: level, icon: '🎖️' },
    { label: '連続日数', value: userProgress.streakDays, icon: '🔥' },
    { label: 'クリア章', value: Object.keys(userProgress.completedChapters).length, icon: '✅' }
  ];

  const achievements = [
    { id: 1, name: '初めの一歩', desc: '最初のレッスンをクリア', earned: true, icon: '🎯' },
    { id: 2, name: '連続学習', desc: '3日連続で学習', earned: userProgress.streakDays >= 3, icon: '🔥' },
    { id: 3, name: 'XPマスター', desc: '1000XPを獲得', earned: userProgress.totalXp >= 1000, icon: '⭐' },
    { id: 4, name: 'パーフェクト', desc: '全問正解でクリア', earned: false, icon: '💯' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24"
    >
      {/* ヘッダー */}
      <div className="bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-teal-500/20 sticky top-0 z-10">
        <div className="max-w-sm mx-auto px-3 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            👤 プロフィール
          </h1>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-3 py-4">
        {/* プロフィールカード */}
        <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <div className="text-xl font-bold text-white">学習者</div>
              <div className="text-sm text-teal-300">Level {level}</div>
            </div>
          </div>
          
          {/* レベル進捗 */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>次のレベルまで</span>
              <span>{currentLevelXp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-400 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-teal-300 mb-3">統計</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 実績 */}
        <div>
          <h2 className="text-lg font-bold text-teal-300 mb-3">実績</h2>
          <div className="space-y-3">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`rounded-xl p-4 transition-all ${
                  achievement.earned
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-slate-800/30 border border-slate-700/30 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-3xl ${achievement.earned ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-bold mb-1 ${
                      achievement.earned ? 'text-amber-300' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-400">{achievement.desc}</div>
                  </div>
                  {achievement.earned && (
                    <div className="text-amber-400 text-xl">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation currentTab="profile" onNavigate={onNavigate} />
    </motion.div>
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
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-6"
    >
      {/* モバイルヘッダー */}
      <div className={`bg-gradient-to-br ${chapter.color} text-white rounded-b-3xl shadow-xl`}>
        <div className="max-w-sm mx-auto px-3 py-4">
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
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400/50 shadow-purple-500/30' 
            : 'bg-slate-800/80 backdrop-blur-sm active:bg-slate-700/80 border-2 border-teal-500/30 text-teal-100 shadow-teal-500/20'
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
            <div className={`font-bold text-base ${isBoss ? 'text-white' : 'text-teal-200'}`}>
              {lesson.title}
            </div>
            <div className={`text-xs ${isBoss ? 'text-white/90' : 'text-teal-400/80'} mt-0.5`}>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* モバイル最適化プログレスバー */}
      <div className="bg-slate-900/95 backdrop-blur-sm shadow-lg border-b border-teal-500/20">
        <div className="h-1.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-4 py-2 flex justify-between items-center">
          <div className="text-xs text-teal-400/80 font-medium">
            {quizState.currentIndex + 1} / {quizState.questions.length}
          </div>
          <div className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
            +{quizState.score} XP
          </div>
        </div>
      </div>

      {/* 問題エリア - モバイル最適化 */}
      <div className="flex-1 flex items-start justify-center p-3 pt-4 overflow-y-auto">
        <div className="max-w-sm w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800/90 backdrop-blur-md border border-teal-500/20 rounded-3xl shadow-2xl p-5"
            >
              {/* 問題文 - モバイル用フォントサイズ */}
              <h2 className="text-lg font-bold text-teal-100 mb-6 leading-relaxed">
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
                  className="mt-5 p-4 rounded-2xl bg-slate-700/50 backdrop-blur-sm border border-teal-500/30"
                >
                  <div className={`font-bold mb-2 text-base flex items-center gap-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                    <span>{isCorrect ? '正解！' : '不正解'}</span>
                  </div>
                  <div className="text-sm text-teal-200/90 leading-relaxed">
                    {currentQuestion.explanation}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* モバイル最適化アクションボタン */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-t border-teal-500/20 p-4 safe-area-bottom">
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
  let bgClass = 'bg-slate-700/50 border-2 border-slate-600 active:bg-slate-600/50';
  let textClass = 'text-teal-100';
  
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
          ${selected ? 'bg-teal-500 text-white' : 'bg-slate-600 text-teal-300'}
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
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4"
    >
      <div className="max-w-sm w-full bg-slate-800/90 backdrop-blur-md border border-teal-500/20 rounded-3xl shadow-2xl p-6 text-center">
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
          <h2 className="text-xl font-bold text-teal-100 mb-3">
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
              className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-900/40 to-teal-800/40 rounded-2xl border border-teal-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="text-sm text-teal-300/90 font-medium">正解率</span>
              </div>
              <span className="text-2xl font-bold text-teal-600">{Math.round(score)}%</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/40 to-cyan-800/40 rounded-2xl border border-cyan-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="text-sm text-cyan-300/90 font-medium">獲得XP</span>
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
