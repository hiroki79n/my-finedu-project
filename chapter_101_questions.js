// Chapter 101: 交換の不便さ - 詳細クイズデータ
// 5レッスン × 22問 (導入4問、仕組み5問、歴史4問、応用5問、Boss 4問)

const CHAPTER_101_QUESTIONS = [
  // ========== レッスン1: 導入 - 物々交換とは (4問) ==========
  {
    id: 101001,
    chapterId: 101,
    lessonId: 10101,
    lessonType: "INTRO",
    order: 1,
    type: "MULTIPLE_CHOICE",
    difficulty: 1,
    tags: ["物々交換", "基礎概念"],
    question: "物々交換とは何ですか?",
    options: [
      "お金を使わずに物と物を直接交換すること",
      "お店で商品を買うこと",
      "銀行でお金を預けること",
      "友達にプレゼントをあげること"
    ],
    correctAnswer: 0,
    explanation: "物々交換とは、お金を使わずに物と物を直接交換する取引方法です。人類最古の交換形態です。",
    xp: 10,
    imageUrl: null
  },
  {
    id: 101002,
    chapterId: 101,
    lessonId: 10101,
    lessonType: "INTRO",
    order: 2,
    type: "TRUE_FALSE",
    difficulty: 1,
    tags: ["物々交換", "歴史"],
    question: "物々交換は、お金が発明される前から存在していた。",
    options: ["正しい", "間違い"],
    correctAnswer: 0,
    explanation: "正しいです。物々交換は貨幣が発明される以前から人類が行っていた最も原始的な経済活動です。",
    xp: 10,
    imageUrl: null
  },
  {
    id: 101003,
    chapterId: 101,
    lessonId: 10101,
    lessonType: "INTRO",
    order: 3,
    type: "MULTIPLE_CHOICE",
    difficulty: 1,
    tags: ["物々交換", "例"],
    question: "次のうち、物々交換の例として正しいものはどれですか?",
    options: [
      "りんご3個と魚2匹を交換した",
      "100円でパンを買った",
      "お小遣いを貯金箱に入れた",
      "友達にプレゼントをもらった"
    ],
    correctAnswer: 0,
    explanation: "りんごと魚を直接交換するのが物々交換です。お金を介さない点が重要です。",
    xp: 10,
    imageUrl: null
  },
  {
    id: 101004,
    chapterId: 101,
    lessonId: 10101,
    lessonType: "INTRO",
    order: 4,
    type: "MULTIPLE_CHOICE",
    difficulty: 2,
    tags: ["物々交換", "メリット"],
    question: "物々交換の利点は何ですか?",
    options: [
      "お金がなくても取引できる",
      "いつでも好きなものと交換できる",
      "値段を計算しなくてよい",
      "銀行に行かなくてよい"
    ],
    correctAnswer: 0,
    explanation: "物々交換の最大の利点は、お金(貨幣)がなくても物資の交換ができることです。",
    xp: 10,
    imageUrl: null
  },

  // ========== レッスン2: 仕組み - 二重の一致の問題 (5問) ==========
  {
    id: 101005,
    chapterId: 101,
    lessonId: 10102,
    lessonType: "MECHANISM",
    order: 5,
    type: "MULTIPLE_CHOICE",
    difficulty: 2,
    tags: ["二重の一致", "問題点"],
    question: "「二重の一致の問題」とは何ですか?",
    options: [
      "お互いが欲しいものを持っている必要があること",
      "同じ物を2つ交換すること",
      "2人で取引すること",
      "2回交換すること"
    ],
    correctAnswer: 0,
    explanation: "二重の一致とは、AがBの持ち物を欲しがり、かつBもAの持ち物を欲しがるという状況が必要な問題です。これが物々交換の最大の欠点です。",
    xp: 15,
    imageUrl: null
  },
  {
    id: 101006,
    chapterId: 101,
    lessonId: 10102,
    lessonType: "MECHANISM",
    order: 6,
    type: "CASE_JUDGMENT",
    difficulty: 2,
    tags: ["二重の一致", "事例"],
    question: "あなたは魚を持っていて、米が欲しいです。相手は野菜を持っていて、肉が欲しいです。この場合、交換は成立しますか?",
    options: [
      "成立しない - 二重の一致がない",
      "成立する - お互い食べ物を持っている",
      "成立する - 魚と野菜を交換できる",
      "成立しない - 量が違うから"
    ],
    correctAnswer: 0,
    explanation: "あなたは米を欲しがっているが相手は魚を欲しがっておらず、相手は肉を欲しがっているがあなたは持っていません。二重の一致がないため取引は成立しません。",
    xp: 15,
    imageUrl: null
  },
  {
    id: 101007,
    chapterId: 101,
    lessonId: 10102,
    lessonType: "MECHANISM",
    order: 7,
    type: "ORDERING",
    difficulty: 2,
    tags: ["物々交換", "プロセス"],
    question: "物々交換が成立するまでの正しい順序を選んでください。",
    options: [
      "①自分が欲しいものを決める → ②それを持っている人を探す → ③相手が自分の持ち物を欲しがるか確認 → ④交換する",
      "①交換する → ②相手を探す → ③欲しいものを決める → ④確認する",
      "①相手を探す → ②交換する → ③欲しいものを決める → ④確認する",
      "①確認する → ②欲しいものを決める → ③相手を探す → ④交換する"
    ],
    correctAnswer: 0,
    explanation: "物々交換では、まず自分のニーズを特定し、それを満たせる相手を見つけ、さらに相手も自分の持ち物を欲しがることを確認する必要があります。",
    xp: 15,
    imageUrl: null
  },
  {
    id: 101008,
    chapterId: 101,
    lessonId: 10102,
    lessonType: "MECHANISM",
    order: 8,
    type: "MULTIPLE_CHOICE",
    difficulty: 3,
    tags: ["物々交換", "効率"],
    question: "100人の村で、全員が異なる商品を持っている場合、二重の一致を見つける難しさはどうなりますか?",
    options: [
      "人数が増えるほど困難になる",
      "人数が増えるほど簡単になる",
      "人数に関係なく同じ",
      "100人なら簡単"
    ],
    correctAnswer: 0,
    explanation: "参加者が増えるほど、自分が欲しいものを持っていて、かつ自分の持ち物を欲しがる相手を見つける確率は低下します。これが物々交換の限界です。",
    xp: 20,
    imageUrl: null
  },
  {
    id: 101009,
    chapterId: 101,
    lessonId: 10102,
    lessonType: "MECHANISM",
    order: 9,
    type: "TRUE_FALSE",
    difficulty: 2,
    tags: ["物々交換", "分割"],
    question: "物々交換では、商品を細かく分けて交換することが難しい。",
    options: ["正しい", "間違い"],
    correctAnswer: 0,
    explanation: "正しいです。例えば牛1頭は分割できませんが、お金なら少額に分けて取引できます。これを「分割可能性の欠如」と言います。",
    xp: 15,
    imageUrl: null
  },

  // ========== レッスン3: 歴史 - 古代の交換 (4問) ==========
  {
    id: 101010,
    chapterId: 101,
    lessonId: 10103,
    lessonType: "HISTORY",
    order: 10,
    type: "MULTIPLE_CHOICE",
    difficulty: 2,
    tags: ["歴史", "古代文明"],
    question: "古代メソポタミアで物々交換されていたものは?",
    options: [
      "穀物、家畜、工芸品など",
      "スマートフォン",
      "紙幣",
      "クレジットカード"
    ],
    correctAnswer: 0,
    explanation: "古代文明では主に農産物(穀物)、家畜(羊、牛)、手工芸品などが交換されていました。",
    xp: 15,
    imageUrl: null
  },
  {
    id: 101011,
    chapterId: 101,
    lessonId: 10103,
    lessonType: "HISTORY",
    order: 11,
    type: "TRUE_FALSE",
    difficulty: 2,
    tags: ["歴史", "文明"],
    question: "古代エジプトでは、物々交換が主要な取引方法だった。",
    options: ["正しい", "間違い"],
    correctAnswer: 0,
    explanation: "正しいです。古代エジプトでは貨幣が普及する前、パンやビール、穀物などを物々交換していました。",
    xp: 15,
    imageUrl: null
  },
  {
    id: 101012,
    chapterId: 101,
    lessonId: 10103,
    lessonType: "HISTORY",
    order: 12,
    type: "MULTIPLE_CHOICE",
    difficulty: 3,
    tags: ["歴史", "記録"],
    question: "古代メソポタミアで物々交換の記録に使われたものは?",
    options: [
      "粘土板",
      "紙のノート",
      "パソコン",
      "スマートフォン"
    ],
    correctAnswer: 0,
    explanation: "古代メソポタミアでは楔形文字を粘土板に刻んで取引記録を残していました。これが会計の起源とも言われています。",
    xp: 20,
    imageUrl: null
  },
  {
    id: 101013,
    chapterId: 101,
    lessonId: 10103,
    lessonType: "HISTORY",
    order: 13,
    type: "MATCHING",
    difficulty: 2,
    tags: ["歴史", "地域"],
    question: "地域と主な交換品を正しく組み合わせてください。",
    options: [
      "メソポタミア:穀物、エジプト:パン、中国:絹",
      "メソポタミア:絹、エジプト:穀物、中国:パン",
      "メソポタミア:パン、エジプト:絹、中国:穀物",
      "メソポタミア:石油、エジプト:車、中国:スマホ"
    ],
    correctAnswer: 0,
    explanation: "各地域で特産品が異なり、それぞれの地域の主要産物が交換に使われていました。",
    xp: 15,
    imageUrl: null
  },

  // ========== レッスン4: 応用 - 現代の物々交換 (5問) ==========
  {
    id: 101014,
    chapterId: 101,
    lessonId: 10104,
    lessonType: "APPLICATION",
    order: 14,
    type: "MULTIPLE_CHOICE",
    difficulty: 2,
    tags: ["現代", "応用"],
    question: "現代でも物々交換が行われる場面はありますか?",
    options: [
      "ある(フリマアプリでの物々交換、国際貿易など)",
      "全くない",
      "お金があるので不要",
      "違法なのでない"
    ],
    correctAnswer: 0,
    explanation: "現代でも一部で物々交換は行われています。フリマアプリ、国際貿易(カウンタートレード)、災害時などで見られます。",
    xp: 15,
    imageUrl: null
  },
  {
    id: 101015,
    chapterId: 101,
    lessonId: 10104,
    lessonType: "APPLICATION",
    order: 15,
    type: "CASE_JUDGMENT",
    difficulty: 3,
    tags: ["現代", "事例"],
    question: "国際貿易で、A国が石油を輸出しB国から小麦を輸入する取引(お金を使わない)は物々交換と言えますか?",
    options: [
      "言える - カウンタートレードと呼ばれる",
      "言えない - 国際貿易は必ずお金を使う",
      "言えない - 物々交換は個人だけ",
      "言える - でも違法"
    ],
    correctAnswer: 0,
    explanation: "カウンタートレード(対抗貿易)と呼ばれる国際的な物々交換は実際に行われています。外貨不足の国などで利用されます。",
    xp: 20,
    imageUrl: null
  },
  {
    id: 101016,
    chapterId: 101,
    lessonId: 10104,
    lessonType: "APPLICATION",
    order: 16,
    type: "TRUE_FALSE",
    difficulty: 2,
    tags: ["現代", "インターネット"],
    question: "インターネットの発達により、物々交換の「二重の一致の問題」は完全に解決された。",
    options: ["間違い", "正しい"],
    correctAnswer: 0,
    explanation: "間違いです。インターネットで相手を見つけやすくなりましたが、二重の一致の問題は依然として存在します。だからこそお金(貨幣)が必要なのです。",
    xp: 15,
    imageUrl: null
  },
  {
    id: 101017,
    chapterId: 101,
    lessonId: 10104,
    lessonType: "APPLICATION",
    order: 17,
    type: "MOST_APPROPRIATE",
    difficulty: 3,
    tags: ["現代", "最適解"],
    question: "災害時に物々交換が増える最も重要な理由は何ですか?",
    options: [
      "お金の流通が機能しなくなるため",
      "物々交換の方が楽だから",
      "みんなが物々交換を好むから",
      "法律で物々交換が義務付けられるから"
    ],
    correctAnswer: 0,
    explanation: "災害時は銀行やATMが機能せず、電子決済も使えなくなることがあります。そのため一時的に物々交換が必要になります。",
    xp: 20,
    imageUrl: null
  },
  {
    id: 101018,
    chapterId: 101,
    lessonId: 10104,
    lessonType: "APPLICATION",
    order: 18,
    type: "MULTIPLE_CHOICE",
    difficulty: 3,
    tags: ["現代", "デジタル"],
    question: "仮想通貨の登場は物々交換にどう影響しますか?",
    options: [
      "お金の新しい形として物々交換の必要性を減らす",
      "物々交換を完全に復活させる",
      "何も変わらない",
      "物々交換を禁止する"
    ],
    correctAnswer: 0,
    explanation: "仮想通貨も「お金」の一種であり、物々交換の問題(二重の一致)を解決する手段です。形は変わっても貨幣の本質は同じです。",
    xp: 20,
    imageUrl: null
  },

  // ========== レッスン5: Boss Quiz (4問) ==========
  {
    id: 101019,
    chapterId: 101,
    lessonId: 10105,
    lessonType: "BOSS",
    order: 19,
    type: "MOST_APPROPRIATE",
    difficulty: 4,
    tags: ["総合", "Boss"],
    question: "【Boss】物々交換が現代でも完全になくならない最も本質的な理由は何ですか?",
    options: [
      "状況によってはお金よりも直接交換の方が効率的な場合があるから",
      "法律で物々交換が保護されているから",
      "昔ながらの方法を守りたいから",
      "お金を使うのが面倒だから"
    ],
    correctAnswer: 0,
    explanation: "状況(小規模コミュニティ、信頼関係、特殊な取引)によっては、仲介手段(お金)を使わない直接交換の方が合理的な場合があります。",
    xp: 30,
    imageUrl: null
  },
  {
    id: 101020,
    chapterId: 101,
    lessonId: 10105,
    lessonType: "BOSS",
    order: 20,
    type: "CASE_JUDGMENT",
    difficulty: 4,
    tags: ["総合", "Boss"],
    question: "【Boss】村に10人の職人がいます。各自が異なる商品を作り、それぞれ他の9種類の商品が必要です。物々交換で全員が満足するには最大何回の交換が必要ですか?",
    options: [
      "45回(各ペアで1回 = 10C2)",
      "10回",
      "9回",
      "90回"
    ],
    correctAnswer: 0,
    explanation: "10人から2人を選ぶ組み合わせは10C2=45通り。各ペアで交換が成立する可能性を考えると最大45回の交渉が必要です。人数が増えると爆発的に増加します。",
    xp: 30,
    imageUrl: null
  },
  {
    id: 101021,
    chapterId: 101,
    lessonId: 10105,
    lessonType: "BOSS",
    order: 21,
    type: "MOST_APPROPRIATE",
    difficulty: 4,
    tags: ["総合", "Boss"],
    question: "【Boss】お金(貨幣)が発明される前、人類が物々交換の限界を克服しようとした最も重要な工夫は何ですか?",
    options: [
      "みんなが欲しがる価値の高い物(塩、貝殻など)を中継に使う",
      "交換を諦めて自給自足に戻る",
      "取引の回数を減らす",
      "より多くの人と知り合いになる"
    ],
    correctAnswer: 0,
    explanation: "「みんなが欲しがる共通の価値あるもの」を中継することで、二重の一致の問題を緩和しました。これが原始貨幣の誕生につながります。",
    xp: 30,
    imageUrl: null
  },
  {
    id: 101022,
    chapterId: 101,
    lessonId: 10105,
    lessonType: "BOSS",
    order: 22,
    type: "MULTIPLE_CHOICE",
    difficulty: 4,
    tags: ["総合", "Boss", "経済学"],
    question: "【Boss】経済学者が物々交換を研究する理由として最も適切なものは?",
    options: [
      "お金(貨幣)の本質的価値と役割を理解するため",
      "物々交換を復活させたいから",
      "歴史の勉強のため",
      "お金を使わない生活を推奨するため"
    ],
    correctAnswer: 0,
    explanation: "物々交換の限界を研究することで、貨幣がなぜ必要なのか、どんな機能を持つべきかという本質が理解できます。これは現代の金融システムを理解する基礎です。",
    xp: 30,
    imageUrl: null
  }
];

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHAPTER_101_QUESTIONS };
}
