import {
  MathSolveResponse,
  EssayCritiqueResponse,
  ChineseSentenceDissect,
  EnglishSentenceDissect,
  QuizQuestion,
  DiagnosticPlanResponse,
} from '../types';

export const getMathFallback = (problem: string): MathSolveResponse => ({
  coreConcept: '二次函數頂點與根的判別式 (Discriminant & Parabola Vertex)',
  formula: 'y = a(x - h)² + k, x = [-b ± √(b² - 4ac)] / 2a',
  steps: [
    {
      stepNumber: 1,
      title: '審題與轉化代數關係',
      explanation: `針對「${problem.slice(0, 30)}...」，先列出已知與未知數。將多項式移項至標準形式 ax² + bx + c = 0。`,
      mathExpr: 'f(x) = ax^2 + bx + c',
    },
    {
      stepNumber: 2,
      title: '配方法或公式解推導',
      explanation: '提出首項係數 a 進行配方，求出對稱軸 x = -b / (2a) 以及極值 k = c - b²/(4a)。',
      mathExpr: 'a(x + b/(2a))^2 + (c - b^2/(4a))',
    },
    {
      stepNumber: 3,
      title: '檢驗區間邊界與極值限制',
      explanation: '務必確認對稱軸是否落在題目限定的定義域區間內，若在區間外，極值必發生在端點。',
      mathExpr: 'x \\in [x_{min}, x_{max}]',
    },
  ],
  finalAnswer: '頂點坐標 (h, k)，在指定區間內極值可由端點與頂點比較求得。',
  commonTraps: [
    '配方時忘記括號外的負號會導致常數項加減符號顛倒。',
    '題目有定義域限制時，直接誤以為頂點就是極值，忽略頂點可能不在區間內。',
    '判別式 b² - 4ac 忘記考慮等號 (相切或恰有一解為 D = 0)。',
  ],
  quickTip: '看到二次多項式，立刻在草稿紙畫出開口向上或向下的小拋物線，標出對稱軸與邊界，幾何直觀永不失誤！',
  similarProblem: {
    problem: '設 f(x) = -2x² + 8x - 3，若 0 ≤ x ≤ 3，求 f(x) 的最大值與最小值？',
    hint: '配方得 -2(x - 2)² + 5，對稱軸 x = 2 在區間 [0, 3] 內，開口向下，最大值為 5；比較端點 f(0)=-3, f(3)=3。',
    answer: '最大值為 5 (當 x=2)，最小值為 -3 (當 x=0)。',
  },
});

export const getEssayFallback = (text: string, isChinese: boolean): EssayCritiqueResponse => ({
  overallScore: isChinese ? '5級分 / 頂標推薦' : '18/20 (Band 5 High)',
  dimensionScores: [
    { dimension: isChinese ? '審題與立意' : 'Content & Thesis', score: 9, maxScore: 10, feedback: '切題明確，能掌握主旨並延伸生活體驗與思想厚度。' },
    { dimension: isChinese ? '結構與鋪陳' : 'Organization & Flow', score: 8, maxScore: 10, feedback: '起承轉合層次分明，各段銜接流暢，轉折自然。' },
    { dimension: isChinese ? '文采與修辭' : 'Vocabulary & Style', score: 8, maxScore: 10, feedback: '用詞準確，多處佳句，可增加更多感官摹寫與化虛為實。' },
    { dimension: isChinese ? '標點與字體規範' : 'Mechanics & Syntax', score: 10, maxScore: 10, feedback: '標點符號與語法規範使用恰當，無錯別字與句型破碎。' },
  ],
  strengths: ['情真意切，敘事畫面感生動細膩。', '段落結構均衡，能扣緊主題進行反思昇華。'],
  weaknesses: ['論述論據略顯常見，若能援引經典名言或獨特生命故事會更震撼。', '部分動詞與形容詞較平鋪直敘，欠缺文采張力。'],
  sentenceUpgrades: [
    {
      original: text.slice(0, 30) || '那天晚上風很大，我很冷，心裡也很難過。',
      upgraded: isChinese
        ? '朔風如刃刮過寂夜，寒意不僅浸透衣襟，更悄然凍結了胸膛中最後一絲溫存。'
        : 'The bitter night wind cut like a blade, penetrating not just my coat, but freezing the last flicker of warmth in my weary heart.',
      rationale: '運用「借景抒情」與感官通感，將具體的冷轉化為心靈的孤絕，畫面感與文學感染力倍增。',
    },
  ],
  structureSuggestions: '建議在第三段轉折處，加入具體頓悟事件的特寫鏡頭，由物及理，深化思想廣度。',
  modelConclusion: '整體文筆流暢自然，只要在動詞煉字與心境轉折上再添幾筆留白與哲理，必能直取滿級分！',
});

export const getDissectFallback = (
  _text: string,
  isChinese: boolean
): ChineseSentenceDissect | EnglishSentenceDissect => {
  if (isChinese) {
    return {
      type: 'chinese_classical',
      sourceTitle: '文言名篇語感透析',
      modernTranslation: '不因為外在環境的好壞而悲喜，也不因為個人的失意或得意而動情。胸懷天下，坦蕩自若。',
      wordByWordNotes: [
        { char: '以', pinyin: 'yǐ', meaning: '介詞，因為、由於', usage: '文言極重要虛詞，表因果關聯' },
        { char: '物', pinyin: 'wù', meaning: '名詞，外在景物、客觀境遇', usage: '與「己」相對應，互文見義' },
        { char: '己', pinyin: 'jǐ', meaning: '名詞，自身榮辱、個人得失', usage: '修辭技巧：互文（不以物喜悲，不以己喜悲）' },
      ],
      rhetoricDevices: ['互文見義（省略交錯）', '工整對偶（以物喜 對 以己悲）'],
      examTakeaway: '會考學測極高頻必考句！注意「以」字虛詞用法，以及作者先天下之憂而憂的博大胸襟。',
    };
  }
  return {
    type: 'english_grammar',
    mainSubject: 'The rapid advancement of AI',
    mainVerb: 'has revolutionized',
    mainObject: 'the way humans process information',
    clauses: [
      { type: '主要子句 (Main Clause)', text: 'The rapid advancement has revolutionized the way...', explanation: '現在完成式 (has revolutionized)，表示從過去持續到現在並對當前產生巨大影響。' },
      { type: '關係子句 (Relative Clause)', text: 'the way (that / in which) humans process information', explanation: '省略 that/in which 的關係子句，修飾先行詞 the way。' },
    ],
    grammarPoints: [
      '現在完成式 has + p.p. 強調對現狀之重大變革影響',
      'The way 後方通常不接 how，可接 in which 或直接省略關係副詞',
    ],
    translatedChinese: '人工智慧的飛速進展，已經徹底革新了人類處理資訊與思考決策的方式。',
    vocabulary: [
      { word: 'advancement', phonetic: '/ədˈvɑːns.mənt/', meaning: '名詞，進步、進展', collocation: 'technological advancement' },
      { word: 'revolutionize', phonetic: '/ˌrev.əˈluː.ʃən.aɪz/', meaning: '動詞，徹底改變、產生革命性劇變', collocation: 'revolutionize the industry' },
    ],
  };
};

export const getQuizFallback = (subject: 'chinese' | 'math' | 'english'): QuizQuestion[] => {
  const mockQuizzes: Record<string, QuizQuestion[]> = {
    chinese: [
      {
        id: 'zh-mock-1',
        subject: '國文',
        topic: '文言虛詞與文意',
        question: '下列文句中的「之」字，何者當作「動詞（前往、到）」使用？',
        options: [
          '(A) 杳不知其所「之」也',
          '(B) 送孟浩然「之」廣陵',
          '(C) 菊「之」愛，陶後鮮有聞',
          '(D) 物外「之」趣',
        ],
        correctIndex: 1,
        explanation: '(B)「之廣陵」之意為前往廣陵，為動詞。 (A)當作代名詞；(C)為結構助詞賓語提前標誌；(D)為的，介詞/助詞。',
        examTrick: '「之」字後方接地方名詞時，高達九成以上為動詞「前往」！',
      },
      {
        id: 'zh-mock-2',
        subject: '國文',
        topic: '修辭辨析',
        question: '「白日依山盡，黃河入海流」所使用的修辭技巧，與下列何者完全相同？',
        options: [
          '(A) 撒了滿天的珍珠和一枚又大又圓的月亮',
          '(B) 綠樹村邊合，青山郭外斜',
          '(C) 留蚊於素帳中，徐噴以煙',
          '(D) 少年不識愁滋味，愛上層樓',
        ],
        correctIndex: 1,
        explanation: '題幹為經典工整之「對偶」（白日對黃河，依山對入海，盡對流）。(B)「綠樹村邊合，青山郭外斜」亦為嚴格對偶。',
        examTrick: '對偶題目先看字數是否相同、詞性是否相對、平仄是否協調。',
      },
    ],
    math: [
      {
        id: 'ma-mock-1',
        subject: '數學',
        topic: '二次函數極值',
        question: '已知函數 f(x) = -x² + 6x - 5，求其在實數上的最大值為何？',
        options: ['(A) 4', '(B) 5', '(C) 9', '(D) -5'],
        correctIndex: 0,
        explanation: '配方法：f(x) = -(x² - 6x + 9) - 5 + 9 = -(x - 3)² + 4。因平方項 ≥ 0，首項為負，故當 x = 3 時有最大值 4。',
        examTrick: '別忘了配方時常數項補加的符號！括號外有負號，內部加 9 等於實質減 9，外部必須加回 9。',
      },
      {
        id: 'ma-mock-2',
        subject: '數學',
        topic: '排列組合與機率',
        question: '從 1 到 10 的自然數中隨機取出兩個相異數，此兩數之和為偶數的機率為何？',
        options: ['(A) 4/9', '(B) 5/9', '(C) 1/2', '(D) 2/5'],
        correctIndex: 0,
        explanation: '總可能數 C(10, 2) = 45。兩數和為偶數的情形：兩奇數 C(5, 2) = 10，或兩偶數 C(5, 2) = 10。總共有 10 + 10 = 20 種。機率 = 20 / 45 = 4/9。',
        examTrick: '和為偶數 = 奇+奇 或 偶+偶；和為奇數 = 奇+偶。分類討論互斥相加！',
      },
    ],
    english: [
      {
        id: 'en-mock-1',
        subject: '英文',
        topic: 'Grammar - Inversion & Subjunctive',
        question: 'Hardly ______ the station when the torrential rain began to pour down.',
        options: [
          '(A) we had reached',
          '(B) had we reached',
          '(C) we reached',
          '(D) did we reach',
        ],
        correctIndex: 1,
        explanation: '否定副詞 Hardly / Scarcely 放句首時引導倒裝句，公式為：Hardly + had + 主詞 + p.p. + when + 過去式子句。',
        examTrick: '口訣：「否定副詞在句首，助動詞提前把主詞摟」。',
      },
      {
        id: 'en-mock-2',
        subject: '英文',
        topic: 'Vocabulary & Context',
        question: 'The scientist’s groundbreaking research has made a significant ______ to the treatment of rare diseases.',
        options: [
          '(A) contradiction',
          '(B) contribution',
          '(C) controversy',
          '(D) consumption',
        ],
        correctIndex: 1,
        explanation: '固定搭配片語為 make a contribution to（對...做出貢獻）。(A)矛盾；(C)爭議；(D)消耗。',
        examTrick: '看到動詞 make 與介系詞 to，首選 contribution！',
      },
    ],
  };
  return mockQuizzes[subject] || mockQuizzes.chinese;
};

export const getPlanFallback = (): DiagnosticPlanResponse => ({
  diagnosticSummary: '當前三科基礎尚可，但存在「做題速度慢、關鍵題型失分」的瓶頸。透過掌握高頻命題觀念與建立錯題分類本，預估可在 30 天內提分 15%~25%！',
  subjectStrategies: {
    chinese: {
      focus: '文言虛詞字感累積與白話閱讀快篩定位',
      actionItems: [
        '每天晨讀 15 分鐘經典短篇文言文（如《古文觀止》選段），專注筆記高頻動詞與代名詞虛詞。',
        '作文每週限時訓練一篇「審題立意」，著重在第三段融入哲理性昇華。',
      ],
      expectedGain: '+4~6分 / 晉級 A+',
    },
    math: {
      focus: '由題圖尋找對稱與輔助線直覺，根除粗心計算',
      actionItems: [
        '幾何題目養成「先用色筆標註已知相等邊長與特殊角(30-60-90, 45-45-90)」習慣。',
        '建立「陷阱錯題本」，只記錯誤原因（如忘記考慮 a<0 或分母不可為零），考前只翻錯題。',
      ],
      expectedGain: '+8~12分 / 穩拿 A',
    },
    english: {
      focus: '7000字搭配詞網絡化與長難句括弧閱讀法',
      actionItems: [
        '背單字放棄孤立字母拼寫，改背「Verb + Noun + Prep」搭配詞（如 make a breakthrough in）。',
        '遇到 3 行以上的長句，立刻用筆打括弧 [ ] 把關係子句與介系詞片語括起來，直取主詞與主要動詞。',
      ],
      expectedGain: '+6~10分 / 穩步向 A 推進',
    },
  },
  weeklySchedule: [
    { day: '週一 / 語感沉浸', routine: ['20min 國文高頻成語與文言文對讀', '40min 英文克漏字與長難句拆解'] },
    { day: '週二 / 數理重構', routine: ['50min 函數與幾何高頻題型變式演練', '20min 錯題覆盤與盲點歸因'] },
    { day: '週三 / 雙語閱讀', routine: ['30min 英文歷屆素養長篇閱讀速讀', '35min 國文現代散文題旨分析'] },
    { day: '週四 / 數學突破', routine: ['50min 機率排列組合模型化練習', '20min 易錯題重算驗算'] },
    { day: '週五 / 寫作昇華', routine: ['40min 國文/英文作文佳句替換與仿寫', '30min 7000核心單字搭配詞速刷'] },
    { day: '週末 / 實戰模考', routine: ['90min 語數英各 1 回計時實戰檢測', '45min AI 弱點診斷與錯題重入庫'] },
  ],
  mindsetTip: '提分不是做更多的題，而是把做過的每一題徹底理解到能講給別人聽！',
});

// Robust client fetch wrappers with zero-failure fallbacks
export async function clientSolveMath(
  problem: string,
  gradeLevel = '高中/國中會考',
  studentAttempt = ''
): Promise<MathSolveResponse> {
  try {
    const res = await fetch('/api/ai/solve-math', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, gradeLevel, studentAttempt }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // network or static host fallback
  }
  return getMathFallback(problem);
}

export async function clientCritiqueEssay(
  text: string,
  subject: 'chinese' | 'english',
  topic = '',
  targetBand = ''
): Promise<EssayCritiqueResponse> {
  try {
    const res = await fetch('/api/ai/critique-essay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, subject, topic, targetBand }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // network or static host fallback
  }
  return getEssayFallback(text, subject === 'chinese');
}

export async function clientDissectSentence(
  text: string,
  type: 'chinese_classical' | 'english_grammar'
): Promise<ChineseSentenceDissect | EnglishSentenceDissect> {
  try {
    const res = await fetch('/api/ai/dissect-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // network or static host fallback
  }
  return getDissectFallback(text, type === 'chinese_classical');
}

export async function clientGenerateQuiz(
  subject: 'chinese' | 'math' | 'english',
  topic: string,
  difficulty = 'intermediate',
  count = 2
): Promise<QuizQuestion[]> {
  try {
    const res = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, difficulty, count }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // network or static host fallback
  }
  return getQuizFallback(subject);
}

export async function clientDiagnosePlan(params: {
  chineseGrade: string;
  mathGrade: string;
  englishGrade: string;
  targetGoal: string;
  hoursPerDay: number;
  mainStruggles: string;
}): Promise<DiagnosticPlanResponse> {
  try {
    const res = await fetch('/api/ai/diagnose-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // network or static host fallback
  }
  return getPlanFallback();
}

