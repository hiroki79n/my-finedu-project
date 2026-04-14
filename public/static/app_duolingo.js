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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
      className="min-h-screen"
    >
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-indigo-600">FINEDU</div>
            <div className="text-sm text-gray-500">Level 1: 交換の始まり</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full">
              <span className="text-amber-600">🔥</span>
              <span className="font-bold text-amber-800">{userProgress.streakDays}</span>
            </div>
            <div className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-full">
              <span className="text-indigo-600">⭐</span>
              <span className="font-bold text-indigo-800">{userProgress.totalXp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 学習ロード (縦パス) */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="relative">
          {/* パス線 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 to-purple-200 transform -translate-x-1/2" />

          {/* チャプターノード */}
          <div className="relative space-y-12">
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
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-400 text-4xl mb-2">🔒</div>
            <div className="text-gray-600 font-medium">Level 2: お金の誕生</div>
            <div className="text-sm text-gray-400 mt-1">
              Level 1を完了すると解放されます
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== チャプターノード (Duolingo風) =====
function ChapterNode({ chapter, index, isUnlocked, crownLevel, onClick }) {
  const isEven = index % 2 === 0;
  const getCrownDisplay = () => {
    if (crownLevel === 0) return null;
    if (crownLevel === 4) return <span className="text-2xl">⭐</span>;
    return <span className="text-lg">{'👑'.repeat(crownLevel)}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}
    >
      <motion.button
        onClick={onClick}
        disabled={!isUnlocked}
        whileHover={isUnlocked ? { scale: 1.05 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
        className={`relative group ${isEven ? 'ml-8' : 'mr-8'}`}
      >
        {/* メインノード */}
        <div 
          className={`
            w-24 h-24 rounded-full shadow-lg flex items-center justify-center text-4xl
            transition-all duration-300
            ${isUnlocked 
              ? `bg-gradient-to-br ${chapter.color} cursor-pointer group-hover:shadow-xl` 
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {isUnlocked ? chapter.icon : '🔒'}
        </div>

        {/* Crown表示 */}
        {crownLevel > 0 && (
          <div className="absolute -top-2 -right-2 bg-white rounded-full shadow-md px-2 py-1">
            {getCrownDisplay()}
          </div>
        )}

        {/* タイトル */}
        <div className={`absolute top-full mt-2 ${isEven ? 'left-0' : 'right-0'} text-center`}>
          <div className={`text-sm font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
            {chapter.title}
          </div>
          <div className="text-xs text-gray-500">
            {chapter.totalQuestions}問
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ===== チャプター詳細画面 =====
function ChapterDetailScreen({ chapter, userProgress, onStartLesson, onBack }) {
  const progress = userProgress.completedChapters[chapter.id] || {};
  const crownLevel = progress.crownLevel || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-white"
    >
      {/* ヘッダー */}
      <div className={`bg-gradient-to-br ${chapter.color} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button onClick={onBack} className="text-white mb-4 flex items-center gap-2 hover:opacity-80">
            <i className="fas fa-arrow-left"></i>
            <span>戻る</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-6xl">{chapter.icon}</div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{chapter.title}</h1>
              <p className="text-white/90 text-sm">{chapter.description}</p>
            </div>
          </div>

          {/* Crown レベル表示 */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm opacity-80">あなたのレベル:</span>
            {crownLevel === 0 && <span className="text-lg">未挑戦</span>}
            {crownLevel > 0 && crownLevel < 4 && <span className="text-2xl">{'👑'.repeat(crownLevel)}</span>}
            {crownLevel === 4 && <span className="text-2xl">⭐ 伝説</span>}
          </div>
        </div>
      </div>

      {/* レッスンリスト */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4">
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

// ===== レッスンカード =====
function LessonCard({ lesson, index, isCompleted, onStart }) {
  const isBoss = lesson.isBoss;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={onStart}
        className={`
          w-full p-6 rounded-xl shadow-md hover:shadow-lg transition-all
          ${isBoss 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
            : 'bg-white hover:bg-gray-50'
          }
          flex items-center justify-between
        `}
      >
        <div className="flex items-center gap-4">
          <div className={`text-4xl ${isBoss ? 'animate-pulse' : ''}`}>
            {lesson.icon}
          </div>
          <div className="text-left">
            <div className={`font-bold text-lg ${isBoss ? 'text-white' : 'text-gray-800'}`}>
              {lesson.title}
            </div>
            <div className={`text-sm ${isBoss ? 'text-white/80' : 'text-gray-500'}`}>
              {lesson.questionCount}問 {isBoss && '• Boss Challenge'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted && (
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
              <i className="fas fa-check"></i>
            </div>
          )}
          <i className={`fas fa-chevron-right ${isBoss ? 'text-white' : 'text-gray-400'}`}></i>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* プログレスバー */}
      <div className="bg-white shadow-sm">
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            問題 {quizState.currentIndex + 1} / {quizState.questions.length}
          </div>
          <div className="text-sm font-bold text-indigo-600">
            +{quizState.score} XP
          </div>
        </div>
      </div>

      {/* 問題エリア */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* 問題文 */}
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {currentQuestion.question}
              </h2>

              {/* 選択肢 */}
              <div className="space-y-3">
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

              {/* フィードバック */}
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 rounded-lg bg-gray-50"
                >
                  <div className={`font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '✅ 正解！' : '❌ 不正解'}
                  </div>
                  <div className="text-sm text-gray-700">
                    {currentQuestion.explanation}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 
                disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                hover:shadow-lg transition-all"
            >
              回答する
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500
                hover:shadow-lg transition-all"
            >
              {quizState.currentIndex + 1 < quizState.questions.length ? '次へ' : '結果を見る'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== 回答ボタン =====
function AnswerButton({ option, index, selected, correct, showFeedback, onClick }) {
  let bgClass = 'bg-white hover:bg-indigo-50 border-2 border-gray-200';
  
  if (showFeedback) {
    if (correct) {
      bgClass = 'bg-green-100 border-2 border-green-500';
    } else if (selected && !correct) {
      bgClass = 'bg-red-100 border-2 border-red-500';
    }
  } else if (selected) {
    bgClass = 'bg-indigo-100 border-2 border-indigo-500';
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={!showFeedback ? { scale: 1.02 } : {}}
      whileTap={!showFeedback ? { scale: 0.98 } : {}}
      className={`w-full p-4 rounded-xl text-left transition-all ${bgClass}`}
      disabled={showFeedback}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
          {String.fromCharCode(65 + index)}
        </div>
        <div className="flex-1 font-medium text-gray-800">
          {option}
        </div>
        {showFeedback && correct && <span className="text-green-600 text-xl">✓</span>}
        {showFeedback && selected && !correct && <span className="text-red-600 text-xl">✗</span>}
      </div>
    </motion.button>
  );
}

// ===== 結果画面 =====
function ResultScreen({ score, crownLevel, totalXp, chapter, lesson, onContinue }) {
  const getCrownInfo = () => {
    if (crownLevel === 4) return { icon: '⭐', name: '伝説', color: 'from-yellow-400 to-amber-500' };
    if (crownLevel === 3) return { icon: '👑👑👑', name: 'ゴールド', color: 'from-yellow-500 to-orange-500' };
    if (crownLevel === 2) return { icon: '👑👑', name: 'シルバー', color: 'from-gray-400 to-gray-500' };
    if (crownLevel === 1) return { icon: '👑', name: 'ブロンズ', color: 'from-orange-600 to-red-600' };
    return { icon: '📚', name: '完了', color: 'from-blue-500 to-indigo-500' };
  };

  const crownInfo = getCrownInfo();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-8xl mb-4"
        >
          {crownInfo.icon}
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {lesson.title} 完了！
        </h2>

        <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${crownInfo.color} text-white font-bold mb-6`}>
          {crownInfo.name}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
            <span className="text-gray-600">正解率</span>
            <span className="text-2xl font-bold text-indigo-600">{Math.round(score)}%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <span className="text-gray-600">獲得XP</span>
            <span className="text-2xl font-bold text-purple-600">+{totalXp}</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500
            hover:shadow-lg transition-all"
        >
          学習を続ける
        </button>
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
