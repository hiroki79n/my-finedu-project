// Duolingo風学習アプリのデータ構造定義
// 14レベル × 6章 = 84章のカリキュラム構造

/**
 * カリキュラム全体構造
 * - 14 Levels (各レベル6章)
 * - 84 Chapters 合計
 * - 各章5レッスン (導入、仕組み、歴史、応用、Boss Quiz)
 * - 各章18-22問 (レッスンあたり4-6問)
 */

// Level 定義
const CURRICULUM_LEVELS = [
  { 
    id: 1, 
    title: "交換の始まり", 
    titleEn: "Origins of Exchange",
    theme: "価値交換の基礎", 
    icon: "🔄",
    color: "from-amber-500 to-orange-600",
    description: "お金の起源と価値交換の基本原理を学びます"
  },
  { 
    id: 2, 
    title: "お金の誕生", 
    titleEn: "Birth of Money",
    theme: "貨幣の成り立ち", 
    icon: "💰",
    color: "from-yellow-500 to-amber-600",
    description: "貨幣がどのように生まれ、発展してきたかを学びます"
  },
  { 
    id: 3, 
    title: "銀行システム", 
    titleEn: "Banking System",
    theme: "金融の仕組み", 
    icon: "🏦",
    color: "from-green-500 to-emerald-600",
    description: "銀行の役割と現代金融システムの基礎を理解します"
  },
  { 
    id: 4, 
    title: "貯蓄と計画", 
    titleEn: "Saving & Planning",
    theme: "資産形成の第一歩", 
    icon: "🎯",
    color: "from-blue-500 to-cyan-600",
    description: "効果的な貯蓄方法と資金計画の立て方を学びます"
  },
  { 
    id: 5, 
    title: "投資の基礎", 
    titleEn: "Investment Basics",
    theme: "資産運用入門", 
    icon: "📈",
    color: "from-purple-500 to-indigo-600",
    description: "株式、債券、投資信託など基本的な投資商品を理解します"
  },
  { 
    id: 6, 
    title: "リスク管理", 
    titleEn: "Risk Management",
    theme: "守りの投資", 
    icon: "🛡️",
    color: "from-pink-500 to-rose-600",
    description: "リスクとリターンのバランス、分散投資を学びます"
  },
  { 
    id: 7, 
    title: "経済の循環", 
    titleEn: "Economic Cycles",
    theme: "マクロ経済の理解", 
    icon: "🔁",
    color: "from-indigo-500 to-purple-600",
    description: "景気循環、インフレ、金利の関係を理解します"
  },
  { 
    id: 8, 
    title: "企業価値評価", 
    titleEn: "Company Valuation",
    theme: "投資判断の科学", 
    icon: "🔬",
    color: "from-teal-500 to-green-600",
    description: "財務諸表の読み方と企業分析の基本を学びます"
  },
  { 
    id: 9, 
    title: "グローバル経済", 
    titleEn: "Global Economy",
    theme: "世界とつながる投資", 
    icon: "🌍",
    color: "from-cyan-500 to-blue-600",
    description: "為替、貿易、国際投資の基礎を理解します"
  },
  { 
    id: 10, 
    title: "税金と制度", 
    titleEn: "Tax & Systems",
    theme: "賢い制度活用", 
    icon: "📋",
    color: "from-orange-500 to-red-600",
    description: "NISA、iDeCo、税制優遇制度を学びます"
  },
  { 
    id: 11, 
    title: "不動産投資", 
    titleEn: "Real Estate",
    theme: "実物資産への投資", 
    icon: "🏠",
    color: "from-red-500 to-pink-600",
    description: "不動産投資の基礎とREITを理解します"
  },
  { 
    id: 12, 
    title: "オルタナティブ", 
    titleEn: "Alternative Assets",
    theme: "多様な投資手法", 
    icon: "💎",
    color: "from-violet-500 to-purple-600",
    description: "金、仮想通貨、コモディティなど代替投資を学びます"
  },
  { 
    id: 13, 
    title: "危機と対応", 
    titleEn: "Crisis Management",
    theme: "市場の異常事態", 
    icon: "⚡",
    color: "from-rose-500 to-red-600",
    description: "金融危機の歴史と対処法を学びます"
  },
  { 
    id: 14, 
    title: "長期戦略", 
    titleEn: "Long-term Strategy",
    theme: "人生設計と投資", 
    icon: "🎓",
    color: "from-emerald-500 to-teal-600",
    description: "ライフプラン全体を通じた投資戦略を構築します"
  }
];

// Crown レベル定義
const CROWN_LEVELS = {
  LOCKED: { level: 0, name: "ロック中", icon: "🔒", color: "gray" },
  CROWN_1: { level: 1, name: "Crown 1", icon: "👑", color: "bronze", minScore: 60 },
  CROWN_2: { level: 2, name: "Crown 2", icon: "👑👑", color: "silver", minScore: 80 },
  CROWN_3: { level: 3, name: "Crown 3", icon: "👑👑👑", color: "gold", minScore: 95 },
  LEGENDARY: { level: 4, name: "伝説", icon: "⭐", color: "legendary", minScore: 100 }
};

// レッスンタイプ定義
const LESSON_TYPES = {
  INTRO: { id: 1, name: "導入", nameEn: "Introduction", icon: "📖", order: 1 },
  MECHANISM: { id: 2, name: "仕組み", nameEn: "Mechanism", icon: "⚙️", order: 2 },
  HISTORY: { id: 3, name: "歴史", nameEn: "History", icon: "📜", order: 3 },
  APPLICATION: { id: 4, name: "応用", nameEn: "Application", icon: "💡", order: 4 },
  BOSS: { id: 5, name: "Boss Quiz", nameEn: "Boss Quiz", icon: "👾", order: 5, isBoss: true }
};

// 問題タイプ定義
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: { id: "mc4", name: "4択問題", icon: "✅" },
  TRUE_FALSE: { id: "tf", name: "正誤問題", icon: "⭕" },
  ORDERING: { id: "order", name: "順序付け", icon: "🔢" },
  MATCHING: { id: "match", name: "マッチング", icon: "🔗" },
  CALCULATION: { id: "calc", name: "計算問題", icon: "🧮" },
  CHART_READING: { id: "chart", name: "グラフ読解", icon: "📊" },
  CASE_JUDGMENT: { id: "case", name: "事例判断", icon: "⚖️" },
  MOST_APPROPRIATE: { id: "most", name: "最適解選択", icon: "🎯" }
};

// Level 1 の詳細構造 (6章)
const LEVEL_1_CHAPTERS = [
  {
    id: 101,
    levelId: 1,
    chapterNumber: 1,
    title: "交換の不便さ",
    titleEn: "Inconvenience of Exchange",
    description: "物々交換の限界と問題点を理解する",
    icon: "🤝",
    difficulty: 1,
    estimatedMinutes: 15,
    tags: ["基礎", "歴史", "物々交換"],
    unlockCondition: null, // 最初から解放
    lessons: [
      { id: 10101, type: "INTRO", title: "物々交換とは", questionCount: 4 },
      { id: 10102, type: "MECHANISM", title: "二重の一致の問題", questionCount: 5 },
      { id: 10103, type: "HISTORY", title: "古代の交換", questionCount: 4 },
      { id: 10104, type: "APPLICATION", title: "現代の物々交換", questionCount: 5 },
      { id: 10105, type: "BOSS", title: "Chapter 1 Boss", questionCount: 4 }
    ],
    totalQuestions: 22
  },
  {
    id: 102,
    levelId: 1,
    chapterNumber: 2,
    title: "価値の基準",
    titleEn: "Standards of Value",
    description: "価値をどう測るか、交換比率の決定",
    icon: "⚖️",
    difficulty: 1,
    estimatedMinutes: 18,
    tags: ["基礎", "価値", "交換"],
    unlockCondition: { chapterId: 101, minCrown: 1 },
    lessons: [
      { id: 10201, type: "INTRO", title: "価値とは何か", questionCount: 5 },
      { id: 10202, type: "MECHANISM", title: "交換比率の決定", questionCount: 4 },
      { id: 10203, type: "HISTORY", title: "価値基準の変遷", questionCount: 4 },
      { id: 10204, type: "APPLICATION", title: "現代の価値評価", questionCount: 5 },
      { id: 10205, type: "BOSS", title: "Chapter 2 Boss", questionCount: 4 }
    ],
    totalQuestions: 22
  },
  {
    id: 103,
    levelId: 1,
    chapterNumber: 3,
    title: "貝殻とビーズ",
    titleEn: "Shells & Beads",
    description: "最初の「お金」的なものの誕生",
    icon: "🐚",
    difficulty: 1,
    estimatedMinutes: 16,
    tags: ["歴史", "原始貨幣", "文化"],
    unlockCondition: { chapterId: 102, minCrown: 1 },
    lessons: [
      { id: 10301, type: "INTRO", title: "原始貨幣とは", questionCount: 4 },
      { id: 10302, type: "MECHANISM", title: "なぜ貝殻が使われたか", questionCount: 5 },
      { id: 10303, type: "HISTORY", title: "世界の原始貨幣", questionCount: 4 },
      { id: 10304, type: "APPLICATION", title: "貨幣の条件", questionCount: 5 },
      { id: 10305, type: "BOSS", title: "Chapter 3 Boss", questionCount: 4 }
    ],
    totalQuestions: 22
  },
  {
    id: 104,
    levelId: 1,
    chapterNumber: 4,
    title: "金属の登場",
    titleEn: "Emergence of Metals",
    description: "金や銀が貨幣になるまで",
    icon: "🪙",
    difficulty: 2,
    estimatedMinutes: 20,
    tags: ["歴史", "金属貨幣", "貴金属"],
    unlockCondition: { chapterId: 103, minCrown: 1 },
    lessons: [
      { id: 10401, type: "INTRO", title: "金属の特性", questionCount: 5 },
      { id: 10402, type: "MECHANISM", title: "金本位制の仕組み", questionCount: 5 },
      { id: 10403, type: "HISTORY", title: "古代の金貨", questionCount: 4 },
      { id: 10404, type: "APPLICATION", title: "現代の金の価値", questionCount: 4 },
      { id: 10405, type: "BOSS", title: "Chapter 4 Boss", questionCount: 4 }
    ],
    totalQuestions: 22
  },
  {
    id: 105,
    levelId: 1,
    chapterNumber: 5,
    title: "信用の誕生",
    titleEn: "Birth of Credit",
    description: "紙幣と信用経済の始まり",
    icon: "📜",
    difficulty: 2,
    estimatedMinutes: 22,
    tags: ["信用", "紙幣", "金融"],
    unlockCondition: { chapterId: 104, minCrown: 1 },
    lessons: [
      { id: 10501, type: "INTRO", title: "紙幣の誕生", questionCount: 5 },
      { id: 10502, type: "MECHANISM", title: "信用創造とは", questionCount: 5 },
      { id: 10503, type: "HISTORY", title: "世界初の紙幣", questionCount: 4 },
      { id: 10504, type: "APPLICATION", title: "現代の信用システム", questionCount: 4 },
      { id: 10505, type: "BOSS", title: "Chapter 5 Boss", questionCount: 4 }
    ],
    totalQuestions: 22
  },
  {
    id: 106,
    levelId: 1,
    chapterNumber: 6,
    title: "デジタル通貨",
    titleEn: "Digital Currency",
    description: "電子マネーと仮想通貨の時代",
    icon: "💳",
    difficulty: 2,
    estimatedMinutes: 24,
    tags: ["デジタル", "電子決済", "仮想通貨"],
    unlockCondition: { chapterId: 105, minCrown: 1 },
    lessons: [
      { id: 10601, type: "INTRO", title: "電子マネーとは", questionCount: 5 },
      { id: 10602, type: "MECHANISM", title: "ブロックチェーン基礎", questionCount: 5 },
      { id: 10603, type: "HISTORY", title: "デジタル通貨の歴史", questionCount: 4 },
      { id: 10604, type: "APPLICATION", title: "未来の通貨", questionCount: 5 },
      { id: 10605, type: "BOSS", title: "Chapter 6 Boss", questionCount: 4 }
    ],
    totalQuestions: 23
  }
];

// ユーザー進捗データ構造
const USER_PROGRESS_TEMPLATE = {
  userId: null,
  currentLevel: 1,
  currentChapter: 101,
  totalXp: 0,
  streakDays: 0,
  lastStudyDate: null,
  completedChapters: [], // [{ chapterId, crownLevel, score, completedAt }]
  lessonProgress: {}, // { lessonId: { completed, correctCount, totalCount, lastAttempt } }
  weakSpots: [], // [{ questionId, tagId, errorCount, lastReview }]
  reviewQueue: [], // [{ questionId, scheduledFor, priority }]
  achievements: [], // [{ achievementId, unlockedAt }]
  infiniteModeUnlocked: false
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CURRICULUM_LEVELS,
    CROWN_LEVELS,
    LESSON_TYPES,
    QUESTION_TYPES,
    LEVEL_1_CHAPTERS,
    USER_PROGRESS_TEMPLATE
  };
}
