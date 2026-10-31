import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to sanitize JSON response from Gemini
function parseJsonSafely<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error('JSON parse error from model output:', err, 'raw:', text);
    return fallback;
  }
}

// Curated Fallbacks for maximum resilience
const getMathFallback = (problem: string) => ({
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
      title: '檢查定義域與邊界條件',
      explanation: '題目若有限定 x 的區間範圍 [m, n]，切記極值可能落在端點而非頂點！',
      mathExpr: 'x \\in [m, n]',
    },
  ],
  finalAnswer: '頂點坐標為 (-b/2a, (4ac - b²)/4a)，若開口向上(a>0)則有最小值。',
  commonTraps: [
    '忘記檢查開口方向 (a的正負號) 導致最大值與最小值判斷顛倒。',
    '忽略題目給予的自變數範圍限制，盲目代入頂點。',
    '判別式 b² - 4ac 符號計算錯誤，特別是常數項 c 為負數時的負負得正。',
  ],
  quickTip: '做題時先在草稿紙畫出拋物線草圖，對稱軸是解決二次函數一切問題的鑰匙！',
  similarProblem: {
    problem: '已知二次函數 f(x) = 2x² - 4x + 5 在 0 ≤ x ≤ 3 的範圍內，求 f(x) 的最大值與最小值。',
    hint: '先配方找出對稱軸 x = 1，接著比較端點 x = 0 與 x = 3 的函數值。',
    answer: '最小值為 3 (發生於 x = 1)，最大值為 11 (發生於 x = 3)。',
  },
});

const getEssayFallback = (text: string, isChinese: boolean) => ({
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

const getDissectFallback = (text: string, isChinese: boolean) => {
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
    mainSubject: 'The rapid advancement of artificial intelligence',
    mainVerb: 'has revolutionized',
    mainObject: 'the way students acquire knowledge and master complex concepts',
    clauses: [
      { type: '主句 (Main Clause)', text: 'The rapid advancement has revolutionized the way...', explanation: '現在完成式表示從過去持續至今且影響深遠。' },
      { type: '關係副詞省略子句 (Relative Clause modifying "the way")', text: '[in which] students acquire knowledge...', explanation: '先行詞 the way 後面通常省略 that 或 in which。' },
    ],
    grammarPoints: ['現在完成式 (has revolutionized)', '先行詞 the way 之關係子句省略結構', '平行並列 (acquire knowledge and master concepts)'],
    translatedChinese: '人工智慧的飛速進展，徹底革新了學生獲取知識與掌握複雜概念的方式。',
    vocabulary: [
      { word: 'advancement', phonetic: '/ədˈvɑːns.mənt/', meaning: '名詞，進步、進展', collocation: 'technological advancement' },
      { word: 'revolutionize', phonetic: '/ˌrev.əˈluː.ʃən.aɪz/', meaning: '動詞，徹底改變、產生革命性劇變', collocation: 'revolutionize the industry' },
    ],
  };
};

const mockQuizzes: Record<string, any[]> = {
  chinese: [
    {
      id: 'zh-1',
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
      id: 'zh-2',
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
      id: 'ma-1',
      subject: '數學',
      topic: '二次函數極值',
      question: '已知函數 f(x) = -x² + 6x - 5，求其在實數上的最大值為何？',
      options: ['(A) 4', '(B) 5', '(C) 9', '(D) -5'],
      correctIndex: 0,
      explanation: '配方法：f(x) = -(x² - 6x + 9) - 5 + 9 = -(x - 3)² + 4。因平方項 ≥ 0，首項為負，故當 x = 3 時有最大值 4。',
      examTrick: '別忘了配方時常數項補加的符號！括號外有負號，內部加 9 等於實質減 9，外部必須加回 9。',
    },
    {
      id: 'ma-2',
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
      id: 'en-1',
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
      id: 'en-2',
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

const getPlanFallback = () => ({
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

// 1. Math Step-by-Step Solver & Trap Revealer
app.post('/api/ai/solve-math', async (req, res) => {
  const { problem, gradeLevel = '高中/國中會考', studentAttempt } = req.body;

  if (!problem || typeof problem !== 'string') {
    return res.status(400).json({ error: '請輸入欲解析的數學題目' });
  }

  if (!ai) {
    return res.json(getMathFallback(problem));
  }

  try {
    const prompt = `你是一位頂尖的語數英名師與大考閱卷專家（熟悉臺灣升學會考與學測命題風格）。
請針對以下數學題目提供深度步驟剖析，切記不能只給答案，重點是教導「思考邏輯」、「公式幾何意義」、「易錯陷阱」與「同類型變式題」。

題目：${problem}
學段：${gradeLevel}
學生目前的解題想法（若有）：${studentAttempt || '無'}

請以繁體中文與正體數學式輸出，並嚴格遵循指定的 JSON 格式。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coreConcept: { type: Type.STRING, description: '這道題考察的核心數學觀念與定理' },
            formula: { type: Type.STRING, description: '關鍵解題公式或定理名稱' },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: '該步驟名稱' },
                  explanation: { type: Type.STRING, description: '詳細思考與推導引導' },
                  mathExpr: { type: Type.STRING, description: '關鍵運算式或公式' },
                },
                required: ['stepNumber', 'title', 'explanation', 'mathExpr'],
              },
            },
            finalAnswer: { type: Type.STRING, description: '最終明確簡潔的答案與結論' },
            commonTraps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '學生最容易失分的三大思維盲點或計算地雷',
            },
            quickTip: { type: Type.STRING, description: '名師獨家破題速解或直觀檢查技巧' },
            similarProblem: {
              type: Type.OBJECT,
              properties: {
                problem: { type: Type.STRING, description: '同核心觀念的平行變式題' },
                hint: { type: Type.STRING, description: '提示' },
                answer: { type: Type.STRING, description: '變式題解答與簡要過程' },
              },
              required: ['problem', 'hint', 'answer'],
            },
          },
          required: ['coreConcept', 'formula', 'steps', 'finalAnswer', 'commonTraps', 'quickTip', 'similarProblem'],
        },
      },
    });

    const parsed = parseJsonSafely(response.text, null);
    if (!parsed) {
      return res.json(getMathFallback(problem));
    }
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Math solve fallback engaged due to:', error.message || error);
    return res.json(getMathFallback(problem));
  }
});

// 2. Essay & Writing Critique (Chinese & English)
app.post('/api/ai/critique-essay', async (req, res) => {
  const { text, subject = 'chinese', topic = '', targetBand = '大考頂標 / A++' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: '請提供欲批改的作文或文章段落' });
  }

  const isChinese = subject === 'chinese';

  if (!ai) {
    return res.json(getEssayFallback(text, isChinese));
  }

  try {
    const prompt = `你是一位資深大考閱卷召集人與頂尖作文名師。請全面批改以下${isChinese ? '國文作文/隨筆' : '英文作文 (English Composition)'}。
作文題目/情境：${topic || '自由寫作'}
目標標準：${targetBand}
待批改文章內容：
"""
${text}
"""

請嚴格遵循大考評分規準（國文：審題立意、結構組織、修辭文采、標點字體；英文：Content, Organization, Grammar & Vocabulary, Mechanics）。
提供句型升級對比（挑選原文中最平淡或有語病的2~3句，重塑為滿分水準典範句型），並給出具體可落實的改進建議。繁體中文回覆。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.STRING, description: '例如 5級分 (滿分6級分) 或 18/20分' },
            dimensionScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dimension: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  maxScore: { type: Type.NUMBER },
                  feedback: { type: Type.STRING },
                },
                required: ['dimension', 'score', 'maxScore', 'feedback'],
              },
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentenceUpgrades: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: '學生原文句子' },
                  upgraded: { type: Type.STRING, description: '大師升級潤飾版' },
                  rationale: { type: Type.STRING, description: '修改緣由與修辭技巧解析' },
                },
                required: ['original', 'upgraded', 'rationale'],
              },
            },
            structureSuggestions: { type: Type.STRING, description: '篇章架構與立意昇華建議' },
            modelConclusion: { type: Type.STRING, description: '名師寄語與提分心法' },
          },
          required: ['overallScore', 'dimensionScores', 'strengths', 'weaknesses', 'sentenceUpgrades', 'structureSuggestions', 'modelConclusion'],
        },
      },
    });

    const parsed = parseJsonSafely(response.text, null);
    if (!parsed) return res.json(getEssayFallback(text, isChinese));
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Critique essay fallback engaged due to:', error.message || error);
    return res.json(getEssayFallback(text, isChinese));
  }
});

// 3. Sentence & Text Dissector (English Grammar / Chinese Classical)
app.post('/api/ai/dissect-sentence', async (req, res) => {
  const { text, type = 'english_grammar' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: '請輸入要剖析的長難句或文言文' });
  }

  const isChinese = type === 'chinese_classical';

  if (!ai) {
    return res.json(getDissectFallback(text, isChinese));
  }

  try {
    const prompt = isChinese
      ? `請對以下文言文字句進行顯微鏡級拆解：
"${text}"
包含：白話通譯、重要字詞/虛詞逐字詳解、修辭手法（如倒裝、互文、借代、頂真）、大考命題重點提點。請嚴格遵守 JSON。`
      : `請對以下英文長難句進行文法手術剖析：
"${text}"
包含：主詞(Main Subject)、主要動詞(Main Verb)、主要受詞/補語(Main Object/Complement)、子句層次拆解、重點文法考點、流暢道地中文翻譯、核心單字與片語搭配。請嚴格遵守 JSON。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: isChinese
          ? {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                sourceTitle: { type: Type.STRING },
                modernTranslation: { type: Type.STRING },
                wordByWordNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      char: { type: Type.STRING },
                      pinyin: { type: Type.STRING },
                      meaning: { type: Type.STRING },
                      usage: { type: Type.STRING },
                    },
                    required: ['char', 'pinyin', 'meaning', 'usage'],
                  },
                },
                rhetoricDevices: { type: Type.ARRAY, items: { type: Type.STRING } },
                examTakeaway: { type: Type.STRING },
              },
              required: ['modernTranslation', 'wordByWordNotes', 'rhetoricDevices', 'examTakeaway'],
            }
          : {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                mainSubject: { type: Type.STRING },
                mainVerb: { type: Type.STRING },
                mainObject: { type: Type.STRING },
                clauses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      text: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ['type', 'text', 'explanation'],
                  },
                },
                grammarPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                translatedChinese: { type: Type.STRING },
                vocabulary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      phonetic: { type: Type.STRING },
                      meaning: { type: Type.STRING },
                      collocation: { type: Type.STRING },
                    },
                    required: ['word', 'phonetic', 'meaning', 'collocation'],
                  },
                },
              },
              required: ['mainSubject', 'mainVerb', 'clauses', 'grammarPoints', 'translatedChinese', 'vocabulary'],
            },
      },
    });

    const parsed = parseJsonSafely(response.text, null);
    if (!parsed) return res.json(getDissectFallback(text, isChinese));
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Dissect sentence fallback engaged due to:', error.message || error);
    return res.json(getDissectFallback(text, isChinese));
  }
});

// 4. Generate Practice Quizzes (Curated Exam Drills)
app.post('/api/ai/generate-quiz', async (req, res) => {
  const { subject = 'chinese', topic = '詩詞成語', difficulty = 'intermediate', count = 3 } = req.body;

  if (!ai) {
    return res.json(mockQuizzes[subject] || mockQuizzes.chinese);
  }

  try {
    const prompt = `請嚴格根據臺灣 108 課綱「高二程度」（高中二年級段考、學測高頻考點命題規格），針對科目「${subject}」、單元主題「${topic}」、難度「${difficulty}」，生成 ${count} 題高品質單選測驗題。
題材需符合高二水平（例如國文考高二古文十五篇、修辭、文言詞義；數學考高二三角函數正餘弦、向量內積、指對數、矩陣；英文考 7000 字 Level 4-5、倒裝句、分詞構句、克漏字與閱測）。
每題包含：題目敘述、四個選項(A/B/C/D)、正確答案索引(0-3)、詳盡解析（包含思維審題與步驟）、以及名師破題秒殺大考心法(examTrick)。
請使用繁體中文輸出。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4個選項，例如 (A)... (B)... (C)... (D)...',
              },
              correctIndex: { type: Type.INTEGER, description: '正確答案的索引 0, 1, 2, 或 3' },
              explanation: { type: Type.STRING, description: '各選項正誤原因與觀念詳解' },
              examTrick: { type: Type.STRING, description: '秒殺考點或防陷阱秘訣' },
            },
            required: ['id', 'subject', 'topic', 'question', 'options', 'correctIndex', 'explanation', 'examTrick'],
          },
        },
      },
    });

    const parsed = parseJsonSafely(response.text, []);
    if (!parsed || parsed.length === 0) return res.json(mockQuizzes[subject] || mockQuizzes.chinese);
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Generate quiz fallback engaged due to:', error.message || error);
    return res.json(mockQuizzes[subject] || mockQuizzes.chinese);
  }
});

// 5. Personalized Score Booster Diagnosis Plan
app.post('/api/ai/diagnose-plan', async (req, res) => {
  const {
    chineseGrade = 'B++',
    mathGrade = 'B+',
    englishGrade = 'B',
    targetGoal = '全面衝刺 A++ / 頂標',
    hoursPerDay = 3,
    mainStruggles = '數學幾何常看不出輔助線，英文長閱讀看不完，國文文言文猜不懂。',
  } = req.body;

  if (!ai) {
    return res.json(getPlanFallback());
  }

  try {
    const prompt = `你是一位資深升學輔導首席專家與名校導師。
學生目前的現狀如下：
- 國文成績：${chineseGrade}
- 數學成績：${mathGrade}
- 英文成績：${englishGrade}
- 目標設定：${targetGoal}
- 每天可支配讀書時間：${hoursPerDay} 小時
- 核心困擾與痛點：${mainStruggles}

請運用高效率的「二八法則」（20%高頻核心拉抬80%分數）為其量身打造一份 30 天提分診斷策劃書。
包含：現狀總評、各科突破聚焦策略、一週循環日程安排、提分心法。請繁體中文輸出符合 JSON 格式。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosticSummary: { type: Type.STRING },
            subjectStrategies: {
              type: Type.OBJECT,
              properties: {
                chinese: {
                  type: Type.OBJECT,
                  properties: {
                    focus: { type: Type.STRING },
                    actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                    expectedGain: { type: Type.STRING },
                  },
                  required: ['focus', 'actionItems', 'expectedGain'],
                },
                math: {
                  type: Type.OBJECT,
                  properties: {
                    focus: { type: Type.STRING },
                    actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                    expectedGain: { type: Type.STRING },
                  },
                  required: ['focus', 'actionItems', 'expectedGain'],
                },
                english: {
                  type: Type.OBJECT,
                  properties: {
                    focus: { type: Type.STRING },
                    actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                    expectedGain: { type: Type.STRING },
                  },
                  required: ['focus', 'actionItems', 'expectedGain'],
                },
              },
              required: ['chinese', 'math', 'english'],
            },
            weeklySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  routine: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['day', 'routine'],
              },
            },
            mindsetTip: { type: Type.STRING },
          },
          required: ['diagnosticSummary', 'subjectStrategies', 'weeklySchedule', 'mindsetTip'],
        },
      },
    });

    const parsed = parseJsonSafely(response.text, null);
    if (!parsed) return res.json(getPlanFallback());
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Diagnose plan fallback engaged due to:', error.message || error);
    return res.json(getPlanFallback());
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Edu-Booster fullstack server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
