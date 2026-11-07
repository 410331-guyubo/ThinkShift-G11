import React, { useState } from 'react';
import { SubjectKey, ErrorBookItem } from '../types';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Compass,
  Languages,
  Award,
  Zap,
  ChevronRight,
  CheckCircle2,
  BookmarkPlus,
  Flame,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  Star,
  Check,
  HelpCircle,
  Copy,
  BookMarked
} from 'lucide-react';

interface TriMasteryPageProps {
  onNavigate: (tab: SubjectKey) => void;
  onAddErrorItem: (item: Omit<ErrorBookItem, 'id' | 'timestamp' | 'mastered'>) => void;
}

type MasteryTab = 'all' | 'chinese' | 'math' | 'english';

interface MasterySecret {
  id: string;
  subject: 'chinese' | 'math' | 'english';
  subjectTitle: string;
  badge: string;
  title: string;
  motto: string;
  coreConcept: string;
  technique: string;
  examExample: {
    question: string;
    answer: string;
    trick: string;
    pitfall: string;
  };
}

export const TriMasteryPage: React.FC<TriMasteryPageProps> = ({ onNavigate, onAddErrorItem }) => {
  const [activeTab, setActiveTab] = useState<MasteryTab>('all');
  const [expandedSecretId, setExpandedSecretId] = useState<string | null>('secret-c1');
  const [savedSecretIds, setSavedSecretIds] = useState<Set<string>>(new Set());

  // Interactive Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  const secrets: MasterySecret[] = [
    // 國文 · 文思絕
    {
      id: 'secret-c1',
      subject: 'chinese',
      subjectTitle: '第一絕 · 文思絕（國文）',
      badge: '古文十五篇思辨',
      title: '論證脈絡穿透術：秒抓古文核心提問',
      motto: '讀古文不在死背翻譯，而在洞悉作者「為什麼要寫這段話」的博弈心理。',
      coreConcept: '108 課綱大考國綜最愛考「論點推展與文本依據」。掌握作者意圖，不必逐字硬翻也能秒殺文意理解題。',
      technique: '四步拆解法：1. 誰對誰說（立場）→ 2. 當時困境（痛點）→ 3. 舉何論據（打比方/引典）→ 4. 真正目的（落腳點）。例如《燭之武退秦師》，燭之武通篇「為秦著想」，實質「解鄭之圍」，大考考點全在「說理層次之反轉」。',
      examExample: {
        question: '《燭之武退秦師》中，燭之武說「鄰之厚，君之薄也」，其在說理策略上的最高明之處為何？',
        answer: '站在秦國立場指出「滅鄭只對晉國有利，反而削弱秦國實力」，將鄭國存亡轉化為秦晉利益博弈。',
        trick: '大考文意分析關鍵詞：永遠看「受詞」與「利益歸屬者」。燭之武避談鄭國多委屈，只算秦國得失。',
        pitfall: '容易誤選「燭之武哀求秦穆公展現仁慈」，古文外交辭令絕非乞憐，而是精密理性算計！',
      },
    },
    {
      id: 'secret-c2',
      subject: 'chinese',
      subjectTitle: '第一絕 · 文思絕（國文）',
      badge: '國寫情意與知性',
      title: '國寫雙向立意法：從「現象觀察」昇華至「哲理思辨」',
      motto: '平庸的文章講故事，頂標的文章看見故事背後的時代矛盾與生命哲思。',
      coreConcept: '學測國寫知性題強調「邏輯論證與具體方案」，情意題強調「情感真實與意象象徵」。五六級分的關鍵在於「立意層次」。',
      technique: '黃金三層梯：第一層「具象敘事」（我看見什麼、發生了什麼）→ 第二層「正反思辨」（社會普遍如何看待 vs. 自身深層反思）→ 第三層「價值昇華」（與自我成長或人類處境共鳴）。',
      examExample: {
        question: '國寫題目遇上「縫隙中的陽光」或「當我面對限制」等情意題，如何避免流於陳腔濫調？',
        answer: '不要通篇寫「我很努力克服了考試」，應將「限制」具象化為心靈的界線，並在結尾探討「正是因為有限制，自由才具備形狀」。',
        trick: '在第二段與倒數第二段加入金句呼應，並利用對比修辭（如「黑夜之於星芒，恰如羈絆之於成長」）。',
        pitfall: '切忌堆砌華麗辭藻卻缺乏真實生命經驗細節，評審老師最忌諱假大空的無病呻吟。',
      },
    },

    // 數學 · 數理絕
    {
      id: 'secret-m1',
      subject: 'math',
      subjectTitle: '第二絕 · 數理絕（數學）',
      badge: '幾何代數數形結合',
      title: '向量投影穿透術：正射影與幾何內積秒殺法',
      motto: '公式只是結果，向量內積的靈魂在於「平行方向的有效投影量」。',
      coreConcept: '平面向量內積 a · b = |a||b|cosθ = (a 在 b 上的正射影長度) × |b|。只要能畫出影子，根本不需要坐標化！',
      technique: '投影定基底法：遇到正多邊形、長方形或立方體中的複雜向量內積，立刻找出「固定底邊」，將所有移動向量垂直投影到該底邊上，乘積瞬間化為「純長度相乘」，省下 80% 計算量。',
      examExample: {
        question: '正六邊形 ABCDEF，邊長為 2，中心為 O，求向量 AB · 向量 AC 之值？',
        answer: 'AB · AC = 6。',
        trick: '作 C 到直線 AB 的垂足 H。因 ∠CAB = 30°，|AC| = 2√3，故投影長 AH = 2√3 × cos30° = 3。內積即為 |AB| × AH = 2 × 3 = 6！兩秒破題。',
        pitfall: '千萬不要硬設坐標系去求 C 點與 B 點坐標再相乘，既花時間又極易因為根號計算錯誤丟失分數！',
      },
    },
    {
      id: 'secret-m2',
      subject: 'math',
      subjectTitle: '第二絕 · 數理絕（數學）',
      badge: '函數極值防踩雷',
      title: '區間二次函數降維破局：三段軸向判別法',
      motto: '拋物線頂點再迷人，若不在題目給定的定義域區間內，頂點就只是一場空！',
      coreConcept: 'y = a(x - h)² + k 在有限區間 α ≤ x ≤ β 上求極值，是高二段考與學測最致命的失分陷阱題。',
      technique: '三步定位置：1. 配方找出對稱軸 x = h 與開口方向。2. 判斷對稱軸是落在區間「左側」、「內部」還是「右側」。3. 極值永遠只出現在「頂點（若在區間內）」或「兩個端點 x = α, β」。',
      examExample: {
        question: '已知 f(x) = -2(x - 1)² + 8 在區間 2 ≤ x ≤ 5 的最大值與最小值分別為何？',
        answer: '最大值為 6 (在 x = 2 處)，最小值為 -24 (在 x = 5 處)。',
        trick: '頂點在 x = 1，完全不在 [2, 5] 區間內！開口向下，離對稱軸越遠值越小。故 x = 2 是最靠近頂點的端點（最大值），x = 5 最遠（最小值）。',
        pitfall: '直覺看到配方後面的 +8 就搶答最大值是 8，直接落入命題老師的標準零分陷阱！',
      },
    },

    // 英文 · 語境絕
    {
      id: 'secret-e1',
      subject: 'english',
      subjectTitle: '第三絕 · 語境絕（英文）',
      badge: '大考句型絕殺',
      title: '頂標長句降維術：倒裝句與分詞構句三秒拆解',
      motto: '長難句不是紙老虎，抓出「真主詞」與「真動詞」，多餘的修飾統統靠邊站。',
      coreConcept: '學測閱讀測驗與克漏字中，命題教授最喜歡用「否定副詞放句首倒裝」與「分詞構句簡化」來干擾你的主謂判斷。',
      technique: '否定副詞倒裝公式：否定副詞 (Not only, Seldom, Hardly, Under no circumstances) + 助動詞/be動詞 + 主詞 + 原形動詞。寫作使用這招，句型維度立刻超越 90% 同儕。',
      examExample: {
        question: '改寫句子：She not only won the national competition, but she also inspired thousands of students.',
        answer: 'Not only did she win the national competition, but she also inspired thousands of students.',
        trick: '倒裝關鍵只在第一子句（Not only did she win），第二子句（but she also...）維持正常語序不變！',
        pitfall: '注意 did 出現後，動詞必須還原為原形 win，不能再寫 won！',
      },
    },
    {
      id: 'secret-e2',
      subject: 'english',
      subjectTitle: '第三絕 · 語境絕（英文）',
      badge: '7000字搭配詞庫',
      title: '大考必殺搭配詞（Collocations）：單字成雙成對才算真懂',
      motto: '學測克漏字從來不是比誰背的生字難，而是看誰掌握最地道的介系詞搭配。',
      coreConcept: '背單字如果只背中文意思，考試時介系詞一空格就只能靠擲骰子。大考高頻核心詞組具有強烈固定依賴。',
      technique: '高頻大考三大金剛搭配詞組：1. pave the way for (為...鋪平道路/奠定基礎) 2. attribute A to B (把A歸因於B) 3. take A into account / consideration (將A納入考量)。',
      examExample: {
        question: '克漏字空格：The breakthrough discovery paved the ______ for groundbreaking renewable energy technologies.',
        answer: 'way (pave the way for 固定搭配)',
        trick: '只要看到前面有 pave，後面有 for，中間 100% 填 way！毫不猶豫直接秒殺。',
        pitfall: '容易被選項中的 road, path, foundation 混淆，英語母語習慣與大考唯一認證就是 pave the way for。',
      },
    },
  ];

  // Daily San-Jue Mastery Challenge Questions
  const challengeQuestions = [
    {
      id: 'q-chinese',
      subject: '文思絕 · 國文',
      tag: '學測核心字義與思辨',
      question: '下列文言文經典名句中，「師」字作「動詞（學習、效法）」用法的是哪一選項？',
      options: [
        'A. 巫醫樂師百工之人，不恥「相師」',
        'B. 古之學者必有「師」',
        'C. 齊「師」伐我，公將戰',
        'D. 十人同行，必有我「師」焉',
      ],
      correctIndex: 0,
      analysis: '選項 A 韓愈《師說》：「不恥相師」，意指不以「互相學習效法」為可恥，此處「師」為動詞。B 為老師（名詞）；C 為軍隊（名詞）；D 亦為名詞（可以作為效法學習的老師）。',
    },
    {
      id: 'q-math',
      subject: '數理絕 · 數學',
      tag: '平面向量內積幾何意義',
      question: '在平面坐標上，已知向量 u = (3, 4)，向量 v = (5, 0)，則向量 v 在向量 u 上的「正射影長度」為何？',
      options: ['A. 3', 'B. 4', 'C. 5', 'D. 15/2'],
      correctIndex: 0,
      analysis: '向量 v 在向量 u 上的正射影長度 = |u · v| / |u|。其中 u · v = 3×5 + 4×0 = 15，而 |u| = √(3² + 4²) = 5。故正射影長度為 15 / 5 = 3！',
    },
    {
      id: 'q-english',
      subject: '語境絕 · 英文',
      tag: '大考倒裝句型判斷',
      question: 'Which of the following sentences utilizes the correct inversion (倒裝) structure?',
      options: [
        'A. Under no circumstances students should leave the examination hall early.',
        'B. Under no circumstances should students leave the examination hall early.',
        'C. Under no circumstances students left the examination hall early.',
        'D. Under no circumstances do students leaving the examination hall early.',
      ],
      correctIndex: 1,
      analysis: '否定片語「Under no circumstances (絕不)」放在句首時，必須嚴格採用倒裝語序（助動詞 should 移至主詞 students 之前）。因此正解為 B！',
    },
  ];

  const handleSelectAnswer = (qId: string, idx: number, correctIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: idx }));
    setShowResults((prev) => ({ ...prev, [qId]: true }));
    if (idx === correctIdx) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleCollectToErrorBook = (q: typeof challengeQuestions[0], userChoice: number) => {
    onAddErrorItem({
      subject: q.subject.includes('國文') ? 'chinese' : q.subject.includes('數學') ? 'math' : 'english',
      topic: q.tag,
      question: q.question,
      wrongAnswer: `你選擇了：${q.options[userChoice]}`,
      correctAnswer: `正確答案：${q.options[q.correctIndex]}`,
      reason: '觀念不熟',
      note: q.analysis,
    });
    setSavedSecretIds((prev) => new Set(prev).add(q.id));
  };

  const filteredSecrets = activeTab === 'all' ? secrets : secrets.filter((s) => s.subject === activeTab);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 border border-slate-700 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>智學三絕 · 108課綱高二頂標修煉總部</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
              智學三絕 · 語數英破題秘笈
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              「一絕<span className="text-amber-400 font-semibold">文思通古今</span>，二絕<span className="text-sky-400 font-semibold">數理破玄機</span>，三絕<span className="text-emerald-400 font-semibold">語境拓寰宇</span>。」
              匯聚段考與學測命題盲點，以直觀思維擊破題海戰術，專治高中生常見失分地雷！
            </p>
          </div>

          {/* Quick Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div
              onClick={() => setActiveTab('chinese')}
              className="cursor-pointer group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  第一絕 · 文思絕
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                古文思辨脈絡、國寫立意昇華、修辭意象直覺解讀。
              </p>
            </div>

            <div
              onClick={() => setActiveTab('math')}
              className="cursor-pointer group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                  第二絕 · 數理絕
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                向量正射影幾何直觀、二次函數區間極值防踩雷。
              </p>
            </div>

            <div
              onClick={() => setActiveTab('english')}
              className="cursor-pointer group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Languages className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  第三絕 · 語境絕
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                學測克漏字搭配詞庫、否定倒裝與分詞構句降維。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS & CORE CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              三絕秘笈研讀堂
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              點選下方卡片展開「名師解法」、「核心公式」與「常犯避雷針」
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              全部三絕
            </button>
            <button
              onClick={() => setActiveTab('chinese')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'chinese'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
              }`}
            >
              文思絕 (國文)
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'math'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-sky-600'
              }`}
            >
              數理絕 (數學)
            </button>
            <button
              onClick={() => setActiveTab('english')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'english'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              語境絕 (英文)
            </button>
          </div>
        </div>

        {/* Secrets Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredSecrets.map((secret) => {
            const isExpanded = expandedSecretId === secret.id;
            const themeColor =
              secret.subject === 'chinese'
                ? {
                    border: 'border-amber-200 dark:border-amber-900/50',
                    bg: 'bg-amber-50/50 dark:bg-amber-950/10',
                    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
                    icon: 'text-amber-600 dark:text-amber-400',
                    bar: 'bg-amber-500',
                  }
                : secret.subject === 'math'
                ? {
                    border: 'border-sky-200 dark:border-sky-900/50',
                    bg: 'bg-sky-50/50 dark:bg-sky-950/10',
                    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
                    icon: 'text-sky-600 dark:text-sky-400',
                    bar: 'bg-sky-500',
                  }
                : {
                    border: 'border-emerald-200 dark:border-emerald-900/50',
                    bg: 'bg-emerald-50/50 dark:bg-emerald-950/10',
                    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
                    icon: 'text-emerald-600 dark:text-emerald-400',
                    bar: 'bg-emerald-500',
                  };

            return (
              <div
                key={secret.id}
                className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-md ${themeColor.border}`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedSecretId(isExpanded ? null : secret.id)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${themeColor.badge}`}>
                        {secret.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{secret.subjectTitle}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {secret.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
                      「{secret.motto}」
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isExpanded ? '收合詳解' : '查看秘笈'}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Left: Theory & Method */}
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            考點核心原理（為什麼會考？）
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {secret.coreConcept}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            智學破題招式（名師實戰口訣）
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-mono text-slate-800 dark:text-slate-200">
                            {secret.technique}
                          </p>
                        </div>
                      </div>

                      {/* Right: Real Exam Drill */}
                      <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4" />
                            大考實戰示範與陷阱
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs text-slate-400 font-medium">題目情境：</div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-100">
                            {secret.examExample.question}
                          </div>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs">
                          <div className="font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            破題關鍵（秒殺解）：
                          </div>
                          <p>{secret.examExample.answer}</p>
                          <p className="text-emerald-300/80 mt-1 font-mono">{secret.examExample.trick}</p>
                        </div>

                        <div className="space-y-1.5 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
                          <div className="font-bold flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-rose-400" />
                            高頻失分陷阱（千萬別踩）：
                          </div>
                          <p>{secret.examExample.pitfall}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons inside card */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => onNavigate(secret.subject)}
                        className="px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        前往該科完整練習庫
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION: 3-QUESTION MASTERY SPRINT CHALLENGE */}
      <section className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
              <Star className="w-4 h-4 fill-current" />
              <span>現場實測 · 智學三絕快速過關試煉</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              三科各一題 · 驗收你的三絕直覺力
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            答對立即獲得通關徽章 · 答錯一鍵收錄至錯題本
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {challengeQuestions.map((q) => {
            const userChoice = selectedAnswers[q.id];
            const hasAnswered = showResults[q.id];
            const isCorrect = userChoice === q.correctIndex;
            const isCollected = savedSecretIds.has(q.id);

            return (
              <div
                key={q.id}
                className="flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {q.subject}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{q.tag}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    {q.options.map((opt, idx) => {
                      let btnStyle =
                        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-indigo-400 text-slate-700 dark:text-slate-300';
                      if (hasAnswered) {
                        if (idx === q.correctIndex) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                        } else if (idx === userChoice) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-bold';
                        } else {
                          btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasAnswered}
                          onClick={() => handleSelectAnswer(q.id, idx, q.correctIndex)}
                          className={`w-full text-left p-2.5 text-xs rounded-xl border transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback & Collect */}
                {hasAnswered && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                    <div
                      className={`text-xs p-2.5 rounded-lg leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-100/70 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1 mb-1">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            三絕心法驗證成功！
                          </>
                        ) : (
                          <>
                            <Flame className="w-3.5 h-3.5 text-rose-600" />
                            思維踩坑，請看三絕解析：
                          </>
                        )}
                      </div>
                      <p className="text-[11px]">{q.analysis}</p>
                    </div>

                    {!isCorrect && (
                      <button
                        onClick={() => handleCollectToErrorBook(q, userChoice)}
                        disabled={isCollected}
                        className={`w-full py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                          isCollected
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-default'
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                        }`}
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        {isCollected ? '已存入錯題本' : '收錄此題至錯題本'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* QUICK FOOTER CALLOUT */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg shadow-sm">
            絕
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              智學三絕 · 提分心法每日鞏固
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              掌握大考命題脈絡，不論題目如何變形，核心觀念永遠萬變不離其宗。
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shadow-xs"
        >
          返回提分儀表板
        </button>
      </section>
    </div>
  );
};
