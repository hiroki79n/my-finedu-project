// 84チャプター全体カリキュラムデータ構造

export const CURRICULUM = {
  levels: [
    {
      id: 1,
      title: 'お金の起源',
      theme: '人類はなぜ、どのようにお金を生み出したのか',
      description: '物々交換の不便さから、価値保存、共通尺度、信用の概念まで。お金が生まれた必然性を理解します。',
      color: 'from-amber-500 to-orange-600',
      chapters: [
        { id: 1, title: '交換の不便さ', order: 1 },
        { id: 2, title: '価値保存とは何か', order: 2 },
        { id: 3, title: '共通の尺度', order: 3 },
        { id: 4, title: '信用の始まり', order: 4 },
        { id: 5, title: '良いお金の条件', order: 5 },
        { id: 6, title: 'Boss: 村に通貨を作る', order: 6, isBoss: true }
      ]
    },
    {
      id: 2,
      title: '貨幣の進化',
      theme: '貝・金・紙幣へ。お金の形はなぜ変わったのか',
      description: '実物貨幣から金属貨幣、そして紙幣へ。通貨の進化と国家・信認の関係を学びます。',
      color: 'from-yellow-500 to-amber-600',
      chapters: [
        { id: 7, title: '貝・塩・金属の時代', order: 1 },
        { id: 8, title: '金貨と銀貨', order: 2 },
        { id: 9, title: '鋳造と国家', order: 3 },
        { id: 10, title: '偽造と信認', order: 4 },
        { id: 11, title: '税と通貨', order: 5 },
        { id: 12, title: 'Boss: 強い通貨の条件', order: 6, isBoss: true }
      ]
    },
    {
      id: 3,
      title: '経済の基本',
      theme: '需要・供給・価格。市場経済の原理を知る',
      description: '需要と供給、価格メカニズム、分業、市場の役割、GDPの直感的理解まで。',
      color: 'from-green-500 to-emerald-600',
      chapters: [
        { id: 13, title: '需要と供給', order: 1 },
        { id: 14, title: '価格の役割', order: 2 },
        { id: 15, title: '分業と生産性', order: 3 },
        { id: 16, title: '市場の意味', order: 4 },
        { id: 17, title: 'GDPの直感', order: 5 },
        { id: 18, title: 'Boss: 小さな町の経済を回す', order: 6, isBoss: true }
      ]
    },
    {
      id: 4,
      title: '銀行と信用',
      theme: '預金・貸出・利子。銀行はなぜ必要なのか',
      description: '預金の意味、貸出と利子、複利の力、取り付け騒ぎ、中央銀行の役割を学びます。',
      color: 'from-blue-500 to-cyan-600',
      chapters: [
        { id: 19, title: '預金とは何か', order: 1 },
        { id: 20, title: '貸出と利子', order: 2 },
        { id: 21, title: '複利の力', order: 3 },
        { id: 22, title: '取り付け騒ぎ', order: 4 },
        { id: 23, title: '中央銀行の役割', order: 5 },
        { id: 24, title: 'Boss: 銀行はなぜ必要か', order: 6, isBoss: true }
      ]
    },
    {
      id: 5,
      title: '古代から近世の経済史',
      theme: '農業革命から大航海時代まで',
      description: '農業革命、都市の誕生、シルクロード、帝国と税、中世から近世への移行を学びます。',
      color: 'from-purple-500 to-pink-600',
      chapters: [
        { id: 25, title: '農業革命と余剰', order: 1 },
        { id: 26, title: '都市と商人', order: 2 },
        { id: 27, title: 'シルクロードと交易', order: 3 },
        { id: 28, title: '帝国と税', order: 4 },
        { id: 29, title: '中世から近世へ', order: 5 },
        { id: 30, title: 'Boss: 交易が世界を変える', order: 6, isBoss: true }
      ]
    },
    {
      id: 6,
      title: '会社と株式の誕生',
      theme: '株式会社という発明。資本主義の始まり',
      description: '会社とは何か、株式会社の意味、株主の権利、配当、証券取引所の誕生を学びます。',
      color: 'from-red-500 to-rose-600',
      chapters: [
        { id: 31, title: '会社とは何か', order: 1 },
        { id: 32, title: '株式会社の意味', order: 2 },
        { id: 33, title: '株主の権利', order: 3 },
        { id: 34, title: '利益と配当', order: 4 },
        { id: 35, title: '証券取引所の誕生', order: 5 },
        { id: 36, title: 'Boss: 航海事業に出資する', order: 6, isBoss: true }
      ]
    },
    {
      id: 7,
      title: '産業革命と資本主義の拡大',
      theme: '蒸気機関から大量生産へ。経済成長の始まり',
      description: '産業革命、鉄道と資本市場、工場と労働、景気循環、金本位制を学びます。',
      color: 'from-orange-500 to-red-600',
      chapters: [
        { id: 37, title: '産業革命', order: 1 },
        { id: 38, title: '鉄道と資本市場', order: 2 },
        { id: 39, title: '工場と労働', order: 3 },
        { id: 40, title: '景気循環', order: 4 },
        { id: 41, title: '金本位制', order: 5 },
        { id: 42, title: 'Boss: 成長経済の仕組み', order: 6, isBoss: true }
      ]
    },
    {
      id: 8,
      title: 'バブルと危機の歴史',
      theme: '人類は同じ過ちを繰り返す',
      description: 'チューリップバブル、南海泡沫事件、1929年大恐慌、70年代インフレ、2008年金融危機を学びます。',
      color: 'from-pink-500 to-rose-600',
      chapters: [
        { id: 43, title: 'チューリップ狂乱', order: 1 },
        { id: 44, title: '南海泡沫事件', order: 2 },
        { id: 45, title: '1929年と大恐慌', order: 3 },
        { id: 46, title: '1970年代インフレ', order: 4 },
        { id: 47, title: '2008年金融危機', order: 5 },
        { id: 48, title: 'Boss: バブルを見抜く', order: 6, isBoss: true }
      ]
    },
    {
      id: 9,
      title: '投資の全体像',
      theme: '投資と投機の違い。長期資産形成の考え方',
      description: '投資と投機、リスクとリターン、資産クラス、長期投資、手数料と税の影響を学びます。',
      color: 'from-teal-500 to-cyan-600',
      chapters: [
        { id: 49, title: '投資と投機の違い', order: 1 },
        { id: 50, title: 'リスクとリターン', order: 2 },
        { id: 51, title: '資産クラス入門', order: 3 },
        { id: 52, title: '長期投資の考え方', order: 4 },
        { id: 53, title: '手数料と税の影響', order: 5 },
        { id: 54, title: 'Boss: 自分の資産配分を作る', order: 6, isBoss: true }
      ]
    },
    {
      id: 10,
      title: '株式投資の基本',
      theme: '株価とは何か。株式市場の仕組み',
      description: '株価の意味、時価総額、PER・PBR、配当利回り、インデックス投資と個別株を学びます。',
      color: 'from-indigo-500 to-purple-600',
      chapters: [
        { id: 55, title: '株価とは何か', order: 1 },
        { id: 56, title: '時価総額と発行株式数', order: 2 },
        { id: 57, title: 'PER・PBRの直感', order: 3 },
        { id: 58, title: '配当利回り', order: 4 },
        { id: 59, title: 'インデックス投資と個別株', order: 5 },
        { id: 60, title: 'Boss: 初めての銘柄比較', order: 6, isBoss: true }
      ]
    },
    {
      id: 11,
      title: '企業を見る目',
      theme: '財務諸表の基本。良い会社とは何か',
      description: '売上と利益、営業利益と純利益、BS・PL・CF、ROE・ROIC、強いビジネスの特徴を学びます。',
      color: 'from-emerald-500 to-green-600',
      chapters: [
        { id: 61, title: '売上と利益', order: 1 },
        { id: 62, title: '営業利益と純利益', order: 2 },
        { id: 63, title: 'BS・PL・CF超入門', order: 3 },
        { id: 64, title: 'ROE・ROIC', order: 4 },
        { id: 65, title: '強いビジネスの特徴', order: 5 },
        { id: 66, title: 'Boss: 良い会社を選ぶ', order: 6, isBoss: true }
      ]
    },
    {
      id: 12,
      title: '値付けとバリュエーション',
      theme: '価格と価値は違う。企業価値の考え方',
      description: '割安・割高、成長と期待、DCFの考え方、安全域、シナリオ分析を学びます。',
      color: 'from-cyan-500 to-blue-600',
      chapters: [
        { id: 67, title: '割安・割高とは何か', order: 1 },
        { id: 68, title: '成長と期待', order: 2 },
        { id: 69, title: 'DCFの考え方', order: 3 },
        { id: 70, title: '安全域', order: 4 },
        { id: 71, title: 'シナリオ分析', order: 5 },
        { id: 72, title: 'Boss: 価格と価値を分ける', order: 6, isBoss: true }
      ]
    },
    {
      id: 13,
      title: 'ポートフォリオと心理',
      theme: '分散投資と行動バイアス。感情に勝つ',
      description: '分散投資、相関とボラティリティ、損切りルール、行動バイアス、暴落時の対応を学びます。',
      color: 'from-violet-500 to-purple-600',
      chapters: [
        { id: 73, title: '分散投資', order: 1 },
        { id: 74, title: '相関とボラティリティ', order: 2 },
        { id: 75, title: '損切りとルール', order: 3 },
        { id: 76, title: '行動バイアス', order: 4 },
        { id: 77, title: '暴落時の対応', order: 5 },
        { id: 78, title: 'Boss: 感情に勝つ', order: 6, isBoss: true }
      ]
    },
    {
      id: 14,
      title: 'マクロと上級投資判断',
      theme: '金利・インフレ・為替。歴史から投資判断へ',
      description: '金利と株価、インフレと資産、為替と世界投資、景気後退と防御、資本配分を学びます。',
      color: 'from-slate-600 to-gray-800',
      chapters: [
        { id: 79, title: '金利と株価', order: 1 },
        { id: 80, title: 'インフレと資産', order: 2 },
        { id: 81, title: '為替と世界投資', order: 3 },
        { id: 82, title: '景気後退と防御', order: 4 },
        { id: 83, title: '資本配分と経営者', order: 5 },
        { id: 84, title: 'Final Boss: 歴史から投資判断へ', order: 6, isBoss: true, isFinal: true }
      ]
    }
  ]
};

// Level 1の詳細データ（完全実装）
export const LEVEL_1_DETAILS = {
  chapters: [
    {
      id: 1,
      levelId: 1,
      title: '交換の不便さ',
      goal: '物々交換がなぜ不便なのか、交換成立の条件を理解する',
      difficulty: 1,
      unlockCondition: null, // 最初から解放
      lessons: [
        {
          id: 1,
          title: '導入: 物々交換とは',
          type: 'intro',
          questions: [
            {
              id: 'c1l1q1',
              type: 'multiple-choice',
              question: '物々交換とは何ですか？',
              options: [
                'お金を使って物を買うこと',
                '物と物を直接交換すること',
                '銀行で預金すること',
                '会社の株を買うこと'
              ],
              correctAnswer: 1,
              explanation: '物々交換とは、お金を介さずに物と物を直接交換する取引方法です。人類最古の経済活動の形態です。',
              tags: ['basic', 'history', 'barter']
            },
            {
              id: 'c1l1q2',
              type: 'multiple-choice',
              question: '漁師が魚10匹を持っています。農家は米10kgを持っています。物々交換が成立するために必要なことは？',
              options: [
                '漁師が米を欲しがり、農家が魚を欲しがる',
                'どちらか一方だけが欲しがればよい',
                '第三者の仲介者がいる',
                '政府の許可が必要'
              ],
              correctAnswer: 0,
              explanation: '物々交換には「欲求の二重の一致」が必要です。つまり、お互いが相手の持っているものを欲しがらなければ成立しません。',
              tags: ['basic', 'double-coincidence']
            },
            {
              id: 'c1l1q3',
              type: 'true-false',
              question: '物々交換は、お互いが相手の物を欲しいと思わなくても成立する',
              correctAnswer: false,
              explanation: 'これは誤りです。物々交換には「欲求の二重の一致」が必須です。片方だけが欲しがっても交換は成立しません。',
              tags: ['basic', 'double-coincidence']
            },
            {
              id: 'c1l1q4',
              type: 'multiple-choice',
              question: '次のうち、物々交換に最も適しているのはどれですか？',
              options: [
                '今日獲れた新鮮な魚',
                '切ったばかりの花',
                '金の延べ棒',
                '作りたてのパン'
              ],
              correctAnswer: 2,
              explanation: '物々交換では、腐らず長期保存できるものが適しています。金は腐らず、分割も可能で、価値が安定しているため最適です。',
              tags: ['intermediate', 'storage', 'value']
            }
          ]
        },
        {
          id: 2,
          title: '仕組み: なぜ不便なのか',
          type: 'mechanism',
          questions: [
            {
              id: 'c1l2q1',
              type: 'multiple-choice',
              question: '物々交換の最大の問題点は何ですか？',
              options: [
                '重くて持ち運べない',
                '欲求の二重の一致が必要',
                '政府が禁止している',
                '税金がかかる'
              ],
              correctAnswer: 1,
              explanation: '最大の問題は「欲求の二重の一致」です。自分が欲しいものを持っていて、かつ自分の持っているものを欲しがる相手を見つける必要があります。',
              tags: ['mechanism', 'problem']
            },
            {
              id: 'c1l2q2',
              type: 'ordering',
              question: '物々交換が成立するまでの手順を正しい順序に並べてください',
              items: [
                '相手を探す',
                '交換比率を決める',
                '物を交換する',
                '相手が自分の物を欲しがるか確認する'
              ],
              correctOrder: [0, 3, 1, 2],
              explanation: '物々交換では、まず相手を探し、お互いの欲求を確認し、交換比率を交渉して、最後に実際に交換します。',
              tags: ['mechanism', 'process']
            },
            {
              id: 'c1l2q3',
              type: 'multiple-choice',
              question: '村に10人の職人がいます。それぞれ異なる物を作っています。全員が交換相手を見つけるには何回の交渉が必要ですか？',
              options: [
                '10回',
                '45回',
                '100回',
                '9回'
              ],
              correctAnswer: 1,
              explanation: '10人全員が互いに交渉する必要があるので、10×9÷2=45回の交渉が必要です。人数が増えると交渉コストは爆発的に増えます。',
              tags: ['advanced', 'calculation', 'cost']
            },
            {
              id: 'c1l2q4',
              type: 'matching',
              question: '次の財と、その保存特性を正しく組み合わせてください',
              pairs: [
                { left: '魚', right: '数時間で腐る' },
                { left: '米', right: '数ヶ月保存可能' },
                { left: '金', right: '永久に保存可能' },
                { left: '花', right: '数日で枯れる' }
              ],
              explanation: '物々交換では、保存が効く財の方が交換媒体として優れています。腐りやすい財は価値が急速に失われます。',
              tags: ['basic', 'storage']
            }
          ]
        },
        {
          id: 3,
          title: '歴史: 実際の物々交換',
          type: 'history',
          questions: [
            {
              id: 'c1l3q1',
              type: 'multiple-choice',
              question: '歴史上、物々交換が主流だった時代はいつですか？',
              options: [
                '古代エジプト文明',
                '産業革命後',
                '貨幣誕生前の原始時代',
                '現代'
              ],
              correctAnswer: 2,
              explanation: '物々交換は貨幣が誕生する前の原始時代に主流でした。文明が発達すると貨幣が生まれ、物々交換は非効率として減少しました。',
              tags: ['history', 'timeline']
            },
            {
              id: 'c1l3q2',
              type: 'multiple-choice',
              question: '中世ヨーロッパで、農民が領主に農作物を納める代わりに土地を借りる仕組みは何ですか？',
              options: [
                '資本主義',
                '物々交換の一種',
                '株式投資',
                '銀行取引'
              ],
              correctAnswer: 1,
              explanation: 'これは物々交換の一種です。お金ではなく、労働や生産物を土地利用権と交換する形態でした。',
              tags: ['history', 'feudalism']
            },
            {
              id: 'c1l3q3',
              type: 'true-false',
              question: '第二次世界大戦直後のドイツでは、お金の価値が暴落し、人々はタバコを通貨代わりに使った',
              correctAnswer: true,
              explanation: '正しいです。ハイパーインフレでお金が信用を失うと、人々はタバコやコーヒーなど価値が安定した物品を交換媒体として使いました。',
              tags: ['history', 'hyperinflation', 'modern']
            },
            {
              id: 'c1l3q4',
              type: 'multiple-choice',
              question: '現代でも物々交換が使われている例はどれですか？',
              options: [
                'スーパーでの買い物',
                '会社間のバーター取引',
                '銀行預金',
                '株式市場'
              ],
              correctAnswer: 1,
              explanation: '現代でも企業間で、お金を介さず商品やサービスを交換する「バーター取引」が行われています。',
              tags: ['modern', 'business']
            }
          ]
        },
        {
          id: 4,
          title: '応用: 現代につながる教訓',
          type: 'application',
          questions: [
            {
              id: 'c1l4q1',
              type: 'case-judgment',
              question: 'あなたは無人島に漂着しました。10人の仲間がいて、それぞれ得意なことが違います。効率的に物を交換するために、最初にすべきことは何ですか？',
              options: [
                '全員で1対1の物々交換を始める',
                '共通の交換媒体（貝殻など）を決める',
                '何も交換しない',
                '最も力の強い人が全て決める'
              ],
              correctAnswer: 1,
              explanation: '共通の交換媒体を決めることで、「欲求の二重の一致」の問題を解決できます。これがお金の起源です。',
              tags: ['application', 'problem-solving']
            },
            {
              id: 'c1l4q2',
              type: 'multiple-choice',
              question: '物々交換の不便さを解決するために人類が発明したものは何ですか？',
              options: [
                'インターネット',
                '貨幣（お金）',
                '株式会社',
                '銀行'
              ],
              correctAnswer: 1,
              explanation: '貨幣（お金）の発明により、交換の不便さが劇的に改善されました。お金は「共通の交換媒体」として機能します。',
              tags: ['application', 'solution']
            },
            {
              id: 'c1l4q3',
              type: 'multiple-choice',
              question: '現代の仮想通貨（暗号資産）も、物々交換の不便さを解決するためのものです。次のうち、仮想通貨が解決しようとしている問題はどれですか？',
              options: [
                '国境を越えた送金の手数料と時間',
                '食べ物の保存期間',
                '株価の変動',
                '地震の被害'
              ],
              correctAnswer: 0,
              explanation: '仮想通貨は、従来の銀行送金の高コスト・長時間という問題を解決しようとしています。これも「交換の効率化」という本質は同じです。',
              tags: ['modern', 'crypto', 'application']
            },
            {
              id: 'c1l4q4',
              type: 'case-judgment',
              question: 'あなたは小さな村の村長です。村人は魚、野菜、布、陶器を作っています。物々交換がうまくいかず困っています。どう解決しますか？',
              options: [
                '交換を禁止する',
                '村で共通の通貨（貝殻など）を導入する',
                '全員に同じものを作らせる',
                '外の村から商人を呼ぶ'
              ],
              correctAnswer: 1,
              explanation: '共通通貨の導入が最も効果的です。これにより「欲求の二重の一致」の問題が解決され、交換が活発になります。',
              tags: ['application', 'governance', 'solution']
            }
          ]
        },
        {
          id: 5,
          title: 'Boss Quiz: 交換の不便さマスター',
          type: 'boss',
          questions: [
            {
              id: 'c1l5q1',
              type: 'case-judgment',
              question: '【総合問題】ある島に5つの村があります。各村は異なる特産品を作っています。A村:魚、B村:米、C村:布、D村:陶器、E村:木材。現在は物々交換で、交換がうまくいっていません。島全体の交易を活発にするために、あなたならどうしますか？',
              options: [
                '各村が全ての物を自分で作るようにする',
                '島共通の通貨を作り、全村で使えるようにする',
                '最も大きい村の特産品だけを流通させる',
                '交易を禁止する'
              ],
              correctAnswer: 1,
              explanation: '島共通の通貨を導入することで、5つの村全てが効率的に交換できるようになります。これが貨幣経済の始まりです。',
              tags: ['boss', 'comprehensive', 'solution']
            },
            {
              id: 'c1l5q2',
              type: 'multiple-choice',
              question: '【発展問題】物々交換から貨幣経済に移行すると、最も大きく改善されることは何ですか？',
              options: [
                '物の品質が上がる',
                '交換回数が減る',
                '欲求の二重の一致が不要になる',
                '生産量が減る'
              ],
              correctAnswer: 2,
              explanation: '貨幣を使えば、「欲求の二重の一致」が不要になります。自分の物を売って貨幣を得て、別の人から別の物を買えるようになります。',
              tags: ['boss', 'mechanism']
            },
            {
              id: 'c1l5q3',
              type: 'calculation',
              question: '【計算問題】20人の村で、全員が物々交換で取引する場合、何回の「相手探し」が理論上必要ですか？（各人が他の全員と取引可能性を確認する必要がある）',
              options: [
                '20回',
                '190回',
                '400回',
                '40回'
              ],
              correctAnswer: 1,
              explanation: '20人が互いに確認するので、20×19÷2=190回です。人数が増えるほど爆発的に増加します。貨幣があればこの問題は解決されます。',
              tags: ['boss', 'calculation', 'advanced']
            },
            {
              id: 'c1l5q4',
              type: 'case-judgment',
              question: '【判断問題】あなたは古代の商人です。遠方の村と交易したいのですが、移動に3日かかります。交換に持っていく財として最も適切なのはどれですか？',
              options: [
                '今朝獲れた新鮮な魚100匹',
                '金の粒100g',
                '切りたての花束10個',
                '焼きたてのパン50個'
              ],
              correctAnswer: 1,
              explanation: '長距離交易では、腐らず価値が保存される財が必須です。金は腐らず、分割可能で、どこでも価値が認められるため最適です。',
              tags: ['boss', 'judgment', 'trade']
            },
            {
              id: 'c1l5q5',
              type: 'multiple-choice',
              question: '【統合問題】物々交換の3つの主要な問題は何ですか？',
              options: [
                '欲求の二重の一致・保存の問題・分割の問題',
                '税金・法律・政府',
                '言語・文化・宗教',
                '天気・季節・気候'
              ],
              correctAnswer: 0,
              explanation: '物々交換の3大問題は、①欲求の二重の一致が必要、②腐る財は保存できない、③分割できない財は小額取引ができない、です。',
              tags: ['boss', 'comprehensive']
            },
            {
              id: 'c1l5q6',
              type: 'case-judgment',
              question: '【最終問題】人類が物々交換から貨幣経済に移行した最も本質的な理由は何ですか？',
              options: [
                '政府が命令したから',
                '交換の効率を上げ、経済を発展させるため',
                '見た目がかっこいいから',
                '外国が使っていたから'
              ],
              correctAnswer: 1,
              explanation: '貨幣の本質は「交換の効率化」です。これにより分業が進み、専門化が進み、経済全体が発展しました。人類の知恵の結晶です。',
              tags: ['boss', 'essence', 'comprehensive']
            }
          ]
        }
      ]
    }
    // Chapter 2-6はデータ構造のみ定義（詳細は後で実装）
  ]
};

// ユーザー進捗データの構造
export const USER_PROGRESS_SCHEMA = {
  userId: 'string',
  currentLevel: 'number',
  currentChapter: 'number',
  xp: 'number',
  streak: 'number', // 連続学習日数
  lastStudyDate: 'date',
  completedChapters: ['number'], // 完了したチャプターIDの配列
  crownLevels: {}, // { chapterId: crownLevel (0-4) }
  reviewQueue: [], // 復習が必要な問題
  achievements: [], // 達成した実績
  weakTags: {} // { tag: errorCount }
};
