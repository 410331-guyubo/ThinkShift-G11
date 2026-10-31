import { DailySprintTask, QuizQuestion } from '../types';

export const INITIAL_DAILY_SPRINTS: DailySprintTask[] = [
  {
    id: 'daily-zh-1',
    subject: 'chinese',
    subjectTitle: '國文 · 文言推敲',
    tag: '會考學測高頻考點',
    question: '「予觀夫巴陵勝狀，在洞庭一湖。銜遠山，吞長江，浩浩湯湯，橫無際涯」句中「銜」與「吞」字運用了何種修辭，其美學效果為何？',
    options: [
      '(A) 譬喻：將山水比擬為金銀珠寶',
      '(B) 轉化（擬人）：賦予洞庭湖吞吐山河之生命氣魄',
      '(C) 倒裝：為了押韻而調動主詞與動詞順序',
      '(D) 借代：以遠山長江借代朝廷命官',
    ],
    correctIndex: 1,
    explanation: '「銜」與「吞」本是動物或人的動作，范仲淹以此形容洞庭湖包容吞納遠山長江的壯闊氣象，屬於轉化（擬人擬物化）修辭，生動呈現天地氣魄。',
    examTrick: '大考極愛考動詞「煉字」！看到無生命之山水湖泊做出吞吐、含蓄、含情之動作，直選擬人轉化。',
  },
  {
    id: 'daily-ma-1',
    subject: 'math',
    subjectTitle: '數學 · 二次函數',
    tag: '易失分陷阱題',
    question: '二次函數 y = -(x - 2)² + 5 在 3 ≤ x ≤ 6 的區間範圍內，其最大值為何？',
    options: [
      '(A) 5',
      '(B) 4',
      '(C) -11',
      '(D) 1',
    ],
    correctIndex: 1,
    explanation: '拋物線開口向下 (a = -1 < 0)，頂點坐標為 (2, 5)。但注意題目限定範圍為 3 ≤ x ≤ 6，頂點 x = 2 不在定義域內！函數在 x ≥ 2 為嚴格遞減，因此在左端點 x = 3 處取得最大值：y = -(3 - 2)² + 5 = -1 + 5 = 4。',
    examTrick: '【經典大考地雷】千萬不能看到頂點 (2, 5) 就直選 5！務必先畫數線檢驗頂點是否落在題目給定的 [3, 6] 區間內！',
  },
  {
    id: 'daily-en-1',
    subject: 'english',
    subjectTitle: '英文 · 長難句與搭配詞',
    tag: '素養閱讀核心文法',
    question: 'Not only ______ the crucial scholarship, but she also earned the opportunity to intern at a prestigious research lab.',
    options: [
      '(A) she secured',
      '(B) did she secure',
      '(C) has she secured',
      '(D) she had secured',
    ],
    correctIndex: 1,
    explanation: '句首為否定對稱連接詞「Not only」，後方子句必須使用倒裝句（助動詞/be動詞 + 主詞 + 原形動詞）。由於後句 earned 為過去簡單式，故選 did she secure。',
    examTrick: '口訣：「Not only 居句首，第一子句必倒裝；前後時態須協調，原形動詞隨 did 留」。',
  },
];

export const PRESET_CHINESE_PASSAGES = [
  {
    title: '岳陽樓記 · 范仲淹',
    snippet: '居廟堂之高則憂其民，處江湖之遠則憂其君。是進亦憂，退亦憂。然則何時而樂耶？其必曰「先天下之憂而憂，後天下之樂而樂」歟！',
    grade: '國中九年級 / 高一高頻核心',
  },
  {
    title: '赤壁賦 · 蘇軾',
    snippet: '寄蜉蝣於天地，渺滄海之一粟。哀吾生之須臾，羨長江之無窮。挾飛仙以遨遊，抱明月而長終。知不可乎驟得，託遺響於悲風。',
    grade: '高中學測核心古文15篇',
  },
  {
    title: '師說 · 韓愈',
    snippet: '古之學者必有師。師者，所以傳道受業解惑也。人非生而知之者，孰能無惑？惑而不從師，其為惑也，終不解矣。',
    grade: '高中必考議論文典範',
  },
  {
    title: '出師表 · 諸葛亮',
    snippet: '親賢臣，遠小人，此先漢所以興隆也；親小人，遠賢臣，此後漢所以傾頹也。先帝在時，每與臣論此事，未嘗不歎息痛恨於桓、靈也。',
    grade: '會考學測極高頻必讀篇目',
  },
];

export const PRESET_MATH_PROBLEMS = [
  {
    title: '二次函數區間極值問題',
    problem: '設 f(x) = x² - 4x + 7，求 f(x) 在 0 ≤ x ≤ 3 與 3 ≤ x ≤ 5 兩不同區間的最大值與最小值。',
    category: '代數與函數',
    tag: '分段區間討論',
  },
  {
    title: '圓與直線的相交與弦長',
    problem: '在坐標平面上，直線 L: 3x + 4y - 12 = 0 與圓 C: x² + y² = 25 相交於 A、B 兩點，求弦長線段 AB 的長度。',
    category: '解析幾何',
    tag: '點到直線距離公式',
  },
  {
    title: '貝氏定理與條件機率',
    problem: '某疾病在人口中的感染率為 2%。現有一篩檢試劑，若受測者感染，呈陽性機率為 95%；若未感染，檢驗呈偽陽性機率為 5%。今某人檢驗呈陽性，求其真正感染該疾病的機率。',
    category: '機率與統計',
    tag: '素養情境命題',
  },
  {
    title: '等比數列與複利儲蓄模型',
    problem: '小華每年年初存入銀行 10,000 元，年利率為 2%，以年複利計息。連續存入 5 年後，在第 5 年年底本利和共是多少元？(計算至整數位)',
    category: '數列與級數',
    tag: '生活數學應用',
  },
];

export interface EnglishVocabCard {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  chinese: string;
  level: '基礎核心 (Level 3-4)' | '進階學測 (Level 5)' | '頂標分科 (Level 6)';
  rootAnalysis: string;
  collocation: string;
  exampleSentence: string;
}

export const PRESET_ENGLISH_VOCAB: EnglishVocabCard[] = [
  {
    word: 'perseverance',
    phonetic: '/ˌpɜː.sɪˈvɪə.rəns/',
    partOfSpeech: 'n.',
    chinese: '堅持不懈、毅力',
    level: '進階學測 (Level 5)',
    rootAnalysis: 'per-(始終、穿透) + severe(嚴格、堅定) + -ance(名詞字尾)',
    collocation: 'through sheer perseverance (憑藉堅忍不拔的毅力)',
    exampleSentence: 'Success in competitive exams is achieved not merely by talent, but through steadfast perseverance.',
  },
  {
    word: 'comprehend',
    phonetic: '/ˌkɒm.prɪˈhend/',
    partOfSpeech: 'v.',
    chinese: '充分理解、領會',
    level: '基礎核心 (Level 3-4)',
    rootAnalysis: 'com-(完全) + prehend(抓住) → 全然掌握抓住',
    collocation: 'fail to comprehend the gravity of (未能理解...的嚴重性)',
    exampleSentence: 'Students must not just memorize formulas, but deeply comprehend their mathematical derivations.',
  },
  {
    word: 'eloquent',
    phonetic: '/ˈel.ə.kwənt/',
    partOfSpeech: 'adj.',
    chinese: '雄辯的、口才流利的、有說服力的',
    level: '進階學測 (Level 5)',
    rootAnalysis: 'e-(出) + loqu-(說話) + -ent(形容詞字尾) → 能言善道的',
    collocation: 'make an eloquent speech / an eloquent testament to',
    exampleSentence: 'The author presented an eloquent argument in favor of educational reform.',
  },
  {
    word: 'resilient',
    phonetic: '/rɪˈzɪl.i.ənt/',
    partOfSpeech: 'adj.',
    chinese: '有韌性的、能迅速恢復的',
    level: '進階學測 (Level 5)',
    rootAnalysis: 're-(回、反向) + sili-(跳躍) + -ent → 能彈跳復原的',
    collocation: 'demonstrate a resilient mindset (展現堅韌心態)',
    exampleSentence: 'Resilient learners view temporary score dips not as failures, but as feedback for deliberate practice.',
  },
  {
    word: 'ambiguous',
    phonetic: '/æmˈbɪɡ.ju.əs/',
    partOfSpeech: 'adj.',
    chinese: '含糊不清的、引起歧義的',
    level: '頂標分科 (Level 6)',
    rootAnalysis: 'ambi-(雙向、周圍) + agere/igu(驅使、推展) + -ous → 兩邊皆可解釋的',
    collocation: 'remain ambiguous / clear up ambiguous phrasing',
    exampleSentence: 'The question was phrased in an ambiguous manner, causing confusion among examinees.',
  },
  {
    word: 'synthesize',
    phonetic: '/ˈsɪn.θə.saɪz/',
    partOfSpeech: 'v.',
    chinese: '綜合、統整（不同觀點或數據）',
    level: '頂標分科 (Level 6)',
    rootAnalysis: 'syn-(共同) + the-(放置) + -ize(動詞字尾) → 放在一起整合',
    collocation: 'synthesize multiple sources of information',
    exampleSentence: 'The final reading question requires candidates to synthesize evidence from both passages.',
  },
];

export const PRESET_ENGLISH_SENTENCES = [
  {
    title: '倒裝句與條件句混用 (大考頂標高頻)',
    sentence: 'Had it not been for the timely guidance of his mentor, he would never have unlocked his true potential in mathematics.',
    grammarFocus: '與過去事實相反的假設語氣倒裝 (省略 If)',
  },
  {
    title: '分詞構句與原因省略 (閱讀測驗長句)',
    sentence: 'Confronted with the unprecedented environmental crisis, global scientists joined forces, synthesizing vast datasets to formulate sustainable solutions.',
    grammarFocus: '過去分詞受動表被動狀態 + 現在分詞伴隨動作',
  },
  {
    title: '關係代名詞非限定與抽象同位語',
    sentence: 'The research team achieved a breakthrough in renewable energy storage, a milestone that could significantly mitigate global carbon emissions.',
    grammarFocus: '抽象名詞同位語 (a milestone that...) 概括前句主旨',
  },
];
