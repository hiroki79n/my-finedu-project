// ===== React & Framer Motion =====
const { useState, useEffect, useRef, createContext, useContext } = React;
const { motion, AnimatePresence } = Motion;

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

// ===== カリキュラムデータ =====
const CURRICULUM = {
  levels: [
    {
      id: 1,
      title: 'お金の起源',
      description: '人類はなぜ、どのようにお金を生み出したのか',
      color: 'from-amber-500 to-orange-600',
      icon: '🪙',
      chapters: [
        { id: 1, title: '交換の不便さ', order: 1, xp: 100 },
        { id: 2, title: '価値保存とは何か', order: 2, xp: 100 },
        { id: 3, title: '共通の尺度', order: 3, xp: 100 },
        { id: 4, title: '信用の始まり', order: 4, xp: 100 },
        { id: 5, title: '良いお金の条件', order: 5, xp: 100 },
        { id: 6, title: 'Boss: 村に通貨を作る', order: 6, xp: 200, isBoss: true }
      ]
    },
    {
      id: 2,
      title: '貨幣の進化',
      description: '貝・金・紙幣へ。お金の形はなぜ変わったのか',
      color: 'from-yellow-500 to-amber-600',
      icon: '💰',
      chapters: [
        { id: 7, title: '貝・塩・金属の時代', order: 1, xp: 120 },
        { id: 8, title: '金貨と銀貨', order: 2, xp: 120 },
        { id: 9, title: '鋳造と国家', order: 3, xp: 120 },
        { id: 10, title: '偽造と信認', order: 4, xp: 120 },
        { id: 11, title: '税と通貨', order: 5, xp: 120 },
        { id: 12, title: 'Boss: 強い通貨の条件', order: 6, xp: 250, isBoss: true }
      ]
    },
    {
      id: 3,
      title: '経済の基本',
      description: '需要・供給・価格。市場経済の原理を知る',
      color: 'from-green-500 to-emerald-600',
      icon: '📊',
      chapters: [
        { id: 13, title: '需要と供給', order: 1, xp: 140 },
        { id: 14, title: '価格の役割', order: 2, xp: 140 },
        { id: 15, title: '分業と生産性', order: 3, xp: 140 },
        { id: 16, title: '市場の意味', order: 4, xp: 140 },
        { id: 17, title: 'GDPの直感', order: 5, xp: 140 },
        { id: 18, title: 'Boss: 小さな町の経済を回す', order: 6, xp: 300, isBoss: true }
      ]
    }
  ]
};

// Chapter 1の詳細クイズデータ
const CHAPTER_1_QUIZZES = [
  {
    id: 'c1q1',
    question: '物々交換とは何ですか？',
    type: 'multiple-choice',
    options: [
      'お金を使って物を買うこと',
      '物と物を直接交換すること',
      '銀行で預金すること',
      '会社の株を買うこと'
    ],
    correctAnswer: 1,
    explanation: '物々交換とは、お金を介さずに物と物を直接交換する取引方法です。人類最古の経済活動の形態です。',
    xp: 5
  },
  {
    id: 'c1q2',
    question: '漁師が魚10匹を持っています。農家は米10kgを持っています。物々交換が成立するために必要なことは？',
    type: 'multiple-choice',
    options: [
      '漁師が米を欲しがり、農家が魚を欲しがる',
      'どちらか一方だけが欲しがればよい',
      '第三者の仲介者がいる',
      '政府の許可が必要'
    ],
    correctAnswer: 0,
    explanation: '物々交換には「欲求の二重の一致」が必要です。つまり、お互いが相手の持っているものを欲しがらなければ成立しません。',
    xp: 5
  },
  {
    id: 'c1q3',
    question: '物々交換は、お互いが相手の物を欲しいと思わなくても成立する',
    type: 'true-false',
    correctAnswer: false,
    explanation: 'これは誤りです。物々交換には「欲求の二重の一致」が必須です。片方だけが欲しがっても交換は成立しません。',
    xp: 5
  },
  {
    id: 'c1q4',
    question: '次のうち、物々交換に最も適しているのはどれですか？',
    type: 'multiple-choice',
    options: [
      '今日獲れた新鮮な魚',
      '切ったばかりの花',
      '金の延べ棒',
      '作りたてのパン'
    ],
    correctAnswer: 2,
    explanation: '物々交換では、腐らず長期保存できるものが適しています。金は腐らず、分割も可能で、価値が安定しているため最適です。',
    xp: 5
  },
  {
    id: 'c1q5',
    question: '物々交換の最大の問題点は何ですか？',
    type: 'multiple-choice',
    options: [
      '重くて持ち運べない',
      '欲求の二重の一致が必要',
      '政府が禁止している',
      '税金がかかる'
    ],
    correctAnswer: 1,
    explanation: '最大の問題は「欲求の二重の一致」です。自分が欲しいものを持っていて、かつ自分の持っているものを欲しがる相手を見つける必要があります。',
    xp: 5
  },
  {
    id: 'c1q6',
    question: '村に10人の職人がいます。それぞれ異なる物を作っています。全員が交換相手を見つけるには何回の交渉が必要ですか？',
    type: 'multiple-choice',
    options: [
      '10回',
      '45回',
      '100回',
      '9回'
    ],
    correctAnswer: 1,
    explanation: '10人全員が互いに交渉する必要があるので、10×9÷2=45回の交渉が必要です。人数が増えると交渉コストは爆発的に増えます。',
    xp: 10
  },
  {
    id: 'c1q7',
    question: '歴史上、物々交換が主流だった時代はいつですか？',
    type: 'multiple-choice',
    options: [
      '古代エジプト文明',
      '産業革命後',
      '貨幣誕生前の原始時代',
      '現代'
    ],
    correctAnswer: 2,
    explanation: '物々交換は貨幣が誕生する前の原始時代に主流でした。文明が発達すると貨幣が生まれ、物々交換は非効率として減少しました。',
    xp: 5
  },
  {
    id: 'c1q8',
    question: '第二次世界大戦直後のドイツでは、お金の価値が暴落し、人々はタバコを通貨代わりに使った',
    type: 'true-false',
    correctAnswer: true,
    explanation: '正しいです。ハイパーインフレでお金が信用を失うと、人々はタバコやコーヒーなど価値が安定した物品を交換媒体として使いました。',
    xp: 10
  },
  {
    id: 'c1q9',
    question: '現代でも物々交換が使われている例はどれですか？',
    type: 'multiple-choice',
    options: [
      'スーパーでの買い物',
      '会社間のバーター取引',
      '銀行預金',
      '株式市場'
    ],
    correctAnswer: 1,
    explanation: '現代でも企業間で、お金を介さず商品やサービスを交換する「バーター取引」が行われています。',
    xp: 5
  },
  {
    id: 'c1q10',
    question: 'あなたは無人島に漂着しました。10人の仲間がいて、それぞれ得意なことが違います。効率的に物を交換するために、最初にすべきことは何ですか？',
    type: 'multiple-choice',
    options: [
      '全員で1対1の物々交換を始める',
      '共通の交換媒体（貝殻など）を決める',
      '何も交換しない',
      '最も力の強い人が全て決める'
    ],
    correctAnswer: 1,
    explanation: '共通の交換媒体を決めることで、「欲求の二重の一致」の問題を解決できます。これがお金の起源です。',
    xp: 10
  },
  {
    id: 'c1q11',
    question: '物々交換の不便さを解決するために人類が発明したものは何ですか？',
    type: 'multiple-choice',
    options: [
      'インターネット',
      '貨幣（お金）',
      '株式会社',
      '銀行'
    ],
    correctAnswer: 1,
    explanation: '貨幣（お金）の発明により、交換の不便さが劇的に改善されました。お金は「共通の交換媒体」として機能します。',
    xp: 5
  },
  {
    id: 'c1q12',
    question: '現代の仮想通貨（暗号資産）も、物々交換の不便さを解決するためのものです。次のうち、仮想通貨が解決しようとしている問題はどれですか？',
    type: 'multiple-choice',
    options: [
      '国境を越えた送金の手数料と時間',
      '食べ物の保存期間',
      '株価の変動',
      '地震の被害'
    ],
    correctAnswer: 0,
    explanation: '仮想通貨は、従来の銀行送金の高コスト・長時間という問題を解決しようとしています。これも「交換の効率化」という本質は同じです。',
    xp: 10
  },
  {
    id: 'c1q13',
    question: 'ある島に5つの村があります。各村は異なる特産品を作っています。現在は物々交換で、交換がうまくいっていません。島全体の交易を活発にするために、あなたならどうしますか？',
    type: 'multiple-choice',
    options: [
      '各村が全ての物を自分で作るようにする',
      '島共通の通貨を作り、全村で使えるようにする',
      '最も大きい村の特産品だけを流通させる',
      '交易を禁止する'
    ],
    correctAnswer: 1,
    explanation: '島共通の通貨を導入することで、5つの村全てが効率的に交換できるようになります。これが貨幣経済の始まりです。',
    xp: 15
  },
  {
    id: 'c1q14',
    question: '物々交換から貨幣経済に移行すると、最も大きく改善されることは何ですか？',
    type: 'multiple-choice',
    options: [
      '物の品質が上がる',
      '交換回数が減る',
      '欲求の二重の一致が不要になる',
      '生産量が減る'
    ],
    correctAnswer: 2,
    explanation: '貨幣を使えば、「欲求の二重の一致」が不要になります。自分の物を売って貨幣を得て、別の人から別の物を買えるようになります。',
    xp: 10
  },
  {
    id: 'c1q15',
    question: '20人の村で、全員が物々交換で取引する場合、何回の「相手探し」が理論上必要ですか？',
    type: 'multiple-choice',
    options: [
      '20回',
      '190回',
      '400回',
      '40回'
    ],
    correctAnswer: 1,
    explanation: '20人が互いに確認するので、20×19÷2=190回です。人数が増えるほど爆発的に増加します。貨幣があればこの問題は解決されます。',
    xp: 15
  },
  {
    id: 'c1q16',
    question: 'あなたは古代の商人です。遠方の村と交易したいのですが、移動に3日かかります。交換に持っていく財として最も適切なのはどれですか？',
    type: 'multiple-choice',
    options: [
      '今朝獲れた新鮮な魚100匹',
      '金の粒100g',
      '切りたての花束10個',
      '焼きたてのパン50個'
    ],
    correctAnswer: 1,
    explanation: '長距離交易では、腐らず価値が保存される財が必須です。金は腐らず、分割可能で、どこでも価値が認められるため最適です。',
    xp: 15
  },
  {
    id: 'c1q17',
    question: '物々交換の3つの主要な問題は何ですか？',
    type: 'multiple-choice',
    options: [
      '欲求の二重の一致・保存の問題・分割の問題',
      '税金・法律・政府',
      '言語・文化・宗教',
      '天気・季節・気候'
    ],
    correctAnswer: 0,
    explanation: '物々交換の3大問題は、①欲求の二重の一致が必要、②腐る財は保存できない、③分割できない財は小額取引ができない、です。',
    xp: 15
  },
  {
    id: 'c1q18',
    question: 'あなたは小さな村の村長です。村人は魚、野菜、布、陶器を作っています。物々交換がうまくいかず困っています。どう解決しますか？',
    type: 'multiple-choice',
    options: [
      '交換を禁止する',
      '村で共通の通貨（貝殻など）を導入する',
      '全員に同じものを作らせる',
      '外の村から商人を呼ぶ'
    ],
    correctAnswer: 1,
    explanation: '共通通貨の導入が最も効果的です。これにより「欲求の二重の一致」の問題が解決され、交換が活発になります。',
    xp: 15
  },
  {
    id: 'c1q19',
    question: '人類が物々交換から貨幣経済に移行した最も本質的な理由は何ですか？',
    type: 'multiple-choice',
    options: [
      '政府が命令したから',
      '交換の効率を上げ、経済を発展させるため',
      '見た目がかっこいいから',
      '外国が使っていたから'
    ],
    correctAnswer: 1,
    explanation: '貨幣の本質は「交換の効率化」です。これにより分業が進み、専門化が進み、経済全体が発展しました。人類の知恵の結晶です。',
    xp: 20
  },
  {
    id: 'c1q20',
    question: '【Boss問題】次のうち、「良いお金の条件」として最も重要でないものはどれですか？',
    type: 'multiple-choice',
    options: [
      '誰もが価値を認める（受容性）',
      '腐らず保存できる（保存性）',
      '分割して使える（分割性）',
      '見た目が美しい（美観性）'
    ],
    correctAnswer: 3,
    explanation: '良いお金の条件は、受容性・保存性・分割性・希少性・持運び性です。見た目の美しさは本質的ではありません。機能が重要です。',
    xp: 20
  }
];

// ===== メインアプリ =====
const App = () => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Demo User',
    xp: 0,
    level: 1,
    streak: 0,
    completedChapters: [],
    currentChapter: 1
  });
  const [screen, setScreen] = useState('home'); // home, chapter, quiz, result, curriculum
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);

  const navigate = (newScreen, data = {}) => {
    soundSystem.playClick();
    setScreen(newScreen);
    if (data.chapter) setSelectedChapter(data.chapter);
  };

  const startChapter = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentQuizIndex(0);
    setQuizAnswers({});
    setShowExplanation(false);
    navigate('quiz');
  };

  const answerQuestion = (answer) => {
    const currentQuiz = CHAPTER_1_QUIZZES[currentQuizIndex];
    const isCorrect = answer === currentQuiz.correctAnswer;
    
    if (isCorrect) {
      soundSystem.playSuccess();
    } else {
      soundSystem.playError();
    }

    setQuizAnswers({
      ...quizAnswers,
      [currentQuiz.id]: { answer, isCorrect }
    });
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuizIndex < CHAPTER_1_QUIZZES.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowExplanation(false);
    } else {
      // チャプター完了
      const totalXP = CHAPTER_1_QUIZZES.reduce((sum, q) => {
        const userAnswer = quizAnswers[q.id];
        return sum + (userAnswer && userAnswer.isCorrect ? q.xp : 0);
      }, 0);
      
      setUser({
        ...user,
        xp: user.xp + totalXP,
        completedChapters: [...user.completedChapters, selectedChapter.id]
      });
      
      navigate('result', { totalXP, chapter: selectedChapter });
    }
  };

  // ===== ホーム画面 =====
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              MoneyWise
            </h1>
            <p className="text-sm text-gray-600">金融の歴史から投資判断まで</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-100 px-3 py-2 rounded-full">
              <span className="text-xl">⚡</span>
              <span className="font-bold text-amber-900">{user.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-full">
              <span className="text-xl">🔥</span>
              <span className="font-bold text-orange-900">{user.streak}日</span>
            </div>
          </div>
        </div>
      </div>

      {/* 学習ロード */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">学習ロード</h2>
          <p className="text-gray-600">お金の起源から投資判断まで、一本道で学びます</p>
        </div>

        {/* レベル表示 */}
        {CURRICULUM.levels.map((level, levelIndex) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: levelIndex * 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`text-4xl bg-gradient-to-r ${level.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                {level.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Level {level.id}: {level.title}</h3>
                <p className="text-sm text-gray-600">{level.description}</p>
              </div>
            </div>

            {/* チャプター一覧（ジグザグ配置） */}
            <div className="relative">
              {level.chapters.map((chapter, chapterIndex) => {
                const isCompleted = user.completedChapters.includes(chapter.id);
                const isLocked = chapter.id > 1 && !user.completedChapters.includes(chapter.id - 1);
                const isCurrent = chapter.id === user.currentChapter;
                const isLeft = chapterIndex % 2 === 0;

                return (
                  <motion.div
                    key={chapter.id}
                    className={`flex ${isLeft ? 'justify-start' : 'justify-end'} mb-6`}
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: chapterIndex * 0.05 }}
                  >
                    <button
                      onClick={() => !isLocked && navigate('chapter', { chapter })}
                      disabled={isLocked}
                      className={`
                        relative w-72 p-6 rounded-2xl shadow-lg transition-all
                        ${isLocked ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:scale-105 cursor-pointer'}
                        ${isCurrent ? 'ring-4 ring-amber-400 ring-offset-2' : ''}
                        ${isCompleted ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400' : ''}
                        ${chapter.isBoss ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-400' : ''}
                      `}
                    >
                      {/* Boss アイコン */}
                      {chapter.isBoss && (
                        <div className="absolute -top-3 -right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          👑 BOSS
                        </div>
                      )}
                      
                      {/* 完了チェック */}
                      {isCompleted && (
                        <div className="absolute -top-3 -left-3 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                          ✓
                        </div>
                      )}

                      {/* ロックアイコン */}
                      {isLocked && (
                        <div className="absolute -top-3 -left-3 bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                          🔒
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Chapter {chapter.order}</div>
                          <h4 className={`font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                            {chapter.title}
                          </h4>
                        </div>
                        <div className="text-2xl">{isCompleted ? '⭐' : chapter.isBoss ? '👑' : '📖'}</div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className={`${isLocked ? 'text-gray-400' : 'text-amber-600'} font-semibold`}>
                          +{chapter.xp} XP
                        </span>
                        {!isLocked && !isCompleted && (
                          <span className="text-blue-600 font-semibold">開始 →</span>
                        )}
                        {isCompleted && (
                          <span className="text-green-600 font-semibold">復習する</span>
                        )}
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* フッターナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
          <button onClick={() => navigate('home')} className="flex flex-col items-center gap-1 text-amber-600">
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-semibold">ホーム</span>
          </button>
          <button onClick={() => navigate('curriculum')} className="flex flex-col items-center gap-1 text-gray-600">
            <span className="text-2xl">📚</span>
            <span className="text-xs font-semibold">カリキュラム</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600">
            <span className="text-2xl">📈</span>
            <span className="text-xs font-semibold">統計</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-600">
            <span className="text-2xl">👤</span>
            <span className="text-xs font-semibold">プロフィール</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ===== チャプター詳細画面 =====
  const ChapterScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate('home')} className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2">
          ← 戻る
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🪙</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedChapter?.title}</h2>
            <p className="text-gray-600">Chapter {selectedChapter?.order} • Level 1: お金の起源</p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-amber-900 mb-3">🎯 学習目標</h3>
            <p className="text-gray-700">
              物々交換がなぜ不便なのか、「欲求の二重の一致」という概念を理解し、
              お金が生まれた必然性を学びます。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm text-gray-600">問題数</div>
              <div className="text-xl font-bold text-blue-900">20問</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-gray-600">獲得XP</div>
              <div className="text-xl font-bold text-green-900">{selectedChapter?.xp}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm text-gray-600">所要時間</div>
              <div className="text-xl font-bold text-purple-900">5分</div>
            </div>
          </div>

          <button
            onClick={() => startChapter(selectedChapter)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            🚀 学習を始める
          </button>
        </motion.div>
      </div>
    </div>
  );

  // ===== クイズ画面 =====
  const QuizScreen = () => {
    const quiz = CHAPTER_1_QUIZZES[currentQuizIndex];
    const userAnswer = quizAnswers[quiz.id];
    const progress = ((currentQuizIndex + 1) / CHAPTER_1_QUIZZES.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20">
        {/* プログレスバー */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">
                問題 {currentQuizIndex + 1} / {CHAPTER_1_QUIZZES.length}
              </span>
              <button onClick={() => navigate('home')} className="text-sm text-gray-500 hover:text-gray-700">
                ✕ 終了
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            {/* 問題文 */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{quiz.question}</h3>
              {quiz.type === 'true-false' && (
                <p className="text-sm text-gray-600">この文は正しいですか？</p>
              )}
            </div>

            {/* 選択肢 */}
            {quiz.type === 'multiple-choice' && (
              <div className="space-y-3 mb-8">
                {quiz.options.map((option, index) => {
                  const isSelected = userAnswer?.answer === index;
                  const isCorrect = index === quiz.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={index}
                      onClick={() => !showExplanation && answerQuestion(index)}
                      disabled={showExplanation}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition-all
                        ${!showResult && 'hover:border-blue-400 hover:bg-blue-50'}
                        ${isSelected && !showResult && 'border-blue-500 bg-blue-50'}
                        ${showResult && isCorrect && 'border-green-500 bg-green-50'}
                        ${showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50'}
                        ${!isSelected && !showResult && 'border-gray-200'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800">{option}</span>
                        {showResult && isCorrect && <span className="text-2xl">✓</span>}
                        {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {quiz.type === 'true-false' && (
              <div className="space-y-3 mb-8">
                {[
                  { label: '正しい', value: true },
                  { label: '誤り', value: false }
                ].map((option) => {
                  const isSelected = userAnswer?.answer === option.value;
                  const isCorrect = option.value === quiz.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={option.label}
                      onClick={() => !showExplanation && answerQuestion(option.value)}
                      disabled={showExplanation}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition-all
                        ${!showResult && 'hover:border-blue-400 hover:bg-blue-50'}
                        ${isSelected && !showResult && 'border-blue-500 bg-blue-50'}
                        ${showResult && isCorrect && 'border-green-500 bg-green-50'}
                        ${showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50'}
                        ${!isSelected && !showResult && 'border-gray-200'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold text-gray-800">{option.label}</span>
                        {showResult && isCorrect && <span className="text-2xl">✓</span>}
                        {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 解説 */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 mb-6 ${userAnswer.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{userAnswer.isCorrect ? '🎉' : '💡'}</span>
                  <h4 className={`text-xl font-bold ${userAnswer.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                    {userAnswer.isCorrect ? '正解です！' : '不正解です'}
                  </h4>
                </div>
                <p className="text-gray-700 leading-relaxed">{quiz.explanation}</p>
                {userAnswer.isCorrect && (
                  <div className="mt-4 flex items-center gap-2 text-amber-600">
                    <span className="text-xl">⚡</span>
                    <span className="font-bold">+{quiz.xp} XP</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* 次へボタン */}
            {showExplanation && (
              <button
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg text-lg"
              >
                {currentQuizIndex < CHAPTER_1_QUIZZES.length - 1 ? '次の問題へ →' : '結果を見る 🎯'}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  };

  // ===== 結果画面 =====
  const ResultScreen = () => {
    const correctCount = Object.values(quizAnswers).filter(a => a.isCorrect).length;
    const totalCount = CHAPTER_1_QUIZZES.length;
    const accuracy = Math.round((correctCount / totalCount) * 100);
    const totalXP = CHAPTER_1_QUIZZES.reduce((sum, q) => {
      const userAnswer = quizAnswers[q.id];
      return sum + (userAnswer && userAnswer.isCorrect ? q.xp : 0);
    }, 0);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-2xl text-center"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Chapter 完了！</h2>
          <p className="text-gray-600 mb-8">{selectedChapter?.title}</p>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-amber-900 mb-2">+{totalXP} XP</div>
            <div className="text-sm text-amber-800">獲得した経験値</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-900 mb-1">{correctCount}/{totalCount}</div>
              <div className="text-sm text-green-700">正解数</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-900 mb-1">{accuracy}%</div>
              <div className="text-sm text-blue-700">正答率</div>
            </div>
          </div>

          {accuracy >= 80 && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <div className="text-2xl mb-2">⭐⭐⭐</div>
              <div className="font-bold text-yellow-900">素晴らしい！</div>
              <div className="text-sm text-yellow-800">80%以上の正答率です</div>
            </div>
          )}

          <button
            onClick={() => navigate('home')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg text-lg mb-3"
          >
            ホームに戻る
          </button>

          <button
            onClick={() => startChapter(selectedChapter)}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-2xl hover:bg-gray-50 transition-all"
          >
            もう一度挑戦する
          </button>
        </motion.div>
      </div>
    );
  };

  // ===== 84チャプター全体カリキュラム画面 =====
  const CurriculumScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => navigate('home')} className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-2">
            ← ホームに戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">84チャプター全体カリキュラム</h1>
          <p className="text-sm text-gray-600">お金の起源から投資判断まで、体系的に学びます</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {CURRICULUM.levels.map((level) => (
          <div key={level.id} className="mb-12">
            <div className={`bg-gradient-to-r ${level.color} rounded-2xl p-6 mb-6 text-white shadow-lg`}>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-5xl">{level.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">Level {level.id}: {level.title}</h2>
                  <p className="text-white/90">{level.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {level.chapters.map((chapter) => {
                const isCompleted = user.completedChapters.includes(chapter.id);
                const isLocked = chapter.id > 1 && !user.completedChapters.includes(chapter.id - 1);

                return (
                  <div
                    key={chapter.id}
                    className={`
                      p-4 rounded-xl border-2 transition-all
                      ${isLocked ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200 hover:border-blue-400'}
                      ${isCompleted ? 'bg-green-50 border-green-400' : ''}
                      ${chapter.isBoss ? 'bg-purple-50 border-purple-400' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-xs text-gray-500">Ch.{chapter.id}</div>
                      {chapter.isBoss && <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">BOSS</span>}
                      {isCompleted && <span className="text-green-600 text-xl">✓</span>}
                      {isLocked && <span className="text-gray-400 text-xl">🔒</span>}
                    </div>
                    <h4 className={`font-bold mb-2 ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                      {chapter.title}
                    </h4>
                    <div className="text-xs text-amber-600 font-semibold">+{chapter.xp} XP</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Level 4-14 プレースホルダー */}
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Level 4-14は開発中</h3>
          <p className="text-gray-600 mb-4">
            銀行と信用、経済史、会社と株式、産業革命、バブル、投資、<br/>
            株式投資、企業分析、バリュエーション、ポートフォリオ、マクロ経済
          </p>
          <div className="text-sm text-gray-500">Phase 2以降で実装予定</div>
        </div>
      </div>
    </div>
  );

  // ===== メインレンダリング =====
  return (
    <div className="font-sans">
      {screen === 'home' && <HomeScreen />}
      {screen === 'chapter' && <ChapterScreen />}
      {screen === 'quiz' && <QuizScreen />}
      {screen === 'result' && <ResultScreen />}
      {screen === 'curriculum' && <CurriculumScreen />}
    </div>
  );
};

// ===== アプリのマウント =====
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
