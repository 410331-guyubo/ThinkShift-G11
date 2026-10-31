import React, { useState, useEffect, useMemo } from 'react';
import { Grade11ExamQuestion, ErrorBookItem } from '../types';
import {
  Sparkles,
  CheckCircle,
  HelpCircle,
  BookmarkPlus,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Loader2,
  PlusCircle,
  Clock,
  Timer,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Award,
  XCircle,
  Play,
  Pause,
  ListChecks,
  Check,
  ChevronRight
} from 'lucide-react';

interface SubjectExamHubProps {
  subject: 'chinese' | 'math' | 'english';
  subjectTitle: string;
  themeColor: 'amber' | 'sky' | 'emerald';
  units: string[];
  initialQuestions: Grade11ExamQuestion[];
  onAddErrorItem: (item: Omit<ErrorBookItem, 'id' | 'timestamp' | 'mastered'>) => void;
}

export const SubjectExamHub: React.FC<SubjectExamHubProps> = ({
  subject,
  subjectTitle,
  themeColor,
  units,
  initialQuestions,
  onAddErrorItem,
}) => {
  // Mode: 'timedExam' (1-question at a time, 15 questions) vs 'browseAll'
  const [viewMode, setViewMode] = useState<'timedExam' | 'browseAll'>('timedExam');
  const [questions, setQuestions] = useState<Grade11ExamQuestion[]>(initialQuestions);

  // Active question index (0 to 14)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // User answers & records
  // key: questionId, value: selected optIndex (-1 for timeout)
  const [userSelections, setUserSelections] = useState<Record<string, number>>({});
  // time spent in seconds per question
  const [timeSpentRecord, setTimeSpentRecord] = useState<Record<string, number>>({});
  // Whether exam is finished (after question 15)
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);

  // Current question timer state
  const currentQ = questions[currentIndex] || questions[0];
  const allocatedSecs = (currentQ?.allocatedMinutes || (subject === 'math' ? 5 : 3)) * 60;
  const [timeLeft, setTimeLeft] = useState<number>(allocatedSecs);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // Hint visibility state (for 10-min difficult questions)
  const [showHint, setShowHint] = useState<boolean>(false);

  // Browse mode filters
  const [selectedUnit, setSelectedUnit] = useState<string>('全部單元');
  const [selectedDiff, setSelectedDiff] = useState<string>('全部');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  // AI Quiz Generation State
  const [aiCustomTopic, setAiCustomTopic] = useState<string>(units[1] || '段考綜合重點');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGenMessage, setAiGenMessage] = useState<string | null>(null);

  // Theme styling helpers
  const themeStyles = {
    amber: {
      text: 'text-amber-700 dark:text-amber-400',
      bgLight: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/60',
      btnActive: 'bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500',
      badge: 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60',
      accentGlow: 'hover:border-amber-300 dark:hover:border-amber-700',
      activeRing: 'ring-2 ring-amber-600 dark:ring-amber-400',
      timerBadge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    },
    sky: {
      text: 'text-sky-700 dark:text-sky-400',
      bgLight: 'bg-sky-50 dark:bg-sky-950/30',
      border: 'border-sky-200 dark:border-sky-800/60',
      btnActive: 'bg-sky-700 hover:bg-sky-800 text-white dark:bg-sky-600 dark:hover:bg-sky-500',
      badge: 'text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/60',
      accentGlow: 'hover:border-sky-300 dark:hover:border-sky-700',
      activeRing: 'ring-2 ring-sky-600 dark:ring-sky-400',
      timerBadge: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-800',
    },
    emerald: {
      text: 'text-emerald-700 dark:text-emerald-400',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      btnActive: 'bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500',
      badge: 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60',
      accentGlow: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      activeRing: 'ring-2 ring-emerald-600 dark:ring-emerald-400',
      timerBadge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
    },
  }[themeColor];

  // Reset timer whenever currentIndex changes
  useEffect(() => {
    if (!currentQ) return;
    const isAnswered = userSelections[currentQ.id] !== undefined;
    setShowHint(false);

    if (isAnswered) {
      setIsTimerRunning(false);
      setIsTimeUp(userSelections[currentQ.id] === -1);
    } else {
      const qSeconds = (currentQ.allocatedMinutes || (subject === 'math' ? 5 : 3)) * 60;
      setTimeLeft(qSeconds);
      setIsTimerRunning(true);
      setIsTimeUp(false);
    }
  }, [currentIndex, currentQ, userSelections, subject]);

  // Timer countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const isAnswered = currentQ && userSelections[currentQ.id] !== undefined;

    if (isTimerRunning && timeLeft > 0 && !isAnswered && !isExamCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimeUp(true);
            setIsTimerRunning(false);
            // Auto timeout mark
            if (currentQ) {
              setUserSelections((s) => ({ ...s, [currentQ.id]: -1 }));
              setTimeSpentRecord((t) => ({
                ...t,
                [currentQ.id]: (currentQ.allocatedMinutes || 3) * 60,
              }));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, currentQ, userSelections, isExamCompleted]);

  // Handle student selecting an option
  const handleSelectOption = (questionId: string, optIndex: number) => {
    if (userSelections[questionId] !== undefined) return; // Already answered

    const spentSecs = Math.max(1, allocatedSecs - timeLeft);
    setUserSelections((prev) => ({ ...prev, [questionId]: optIndex }));
    setTimeSpentRecord((prev) => ({ ...prev, [questionId]: spentSecs }));
    setIsTimerRunning(false);
  };

  // Move to next question or complete exam
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsExamCompleted(true);
    }
  };

  // Restart whole 15 questions
  const handleRestartExam = () => {
    setUserSelections({});
    setTimeSpentRecord({});
    setCurrentIndex(0);
    setIsExamCompleted(false);
    setIsTimeUp(false);
    const firstQ = questions[0];
    const firstQSecs = (firstQ?.allocatedMinutes || (subject === 'math' ? 5 : 3)) * 60;
    setTimeLeft(firstQSecs);
    setIsTimerRunning(true);
  };

  // Add all mistakes to error book in one click
  const handleAddAllMistakesToErrorBook = () => {
    questions.forEach((q) => {
      const choice = userSelections[q.id];
      const isWrong = choice !== undefined && choice !== q.correctIndex;
      if (isWrong) {
        onAddErrorItem({
          subject: q.subject,
          topic: `[高二${subjectTitle}] ${q.unit}`,
          question: q.question,
          wrongAnswer: choice === -1 ? '超時未作答' : q.options[choice],
          correctAnswer: q.options[q.correctIndex],
          reason: '觀念不熟',
          note: q.speedTrick || q.commonTraps,
        });
      }
    });
  };

  // Calculate statistics
  const answeredCount = Object.keys(userSelections).length;
  const correctCount = questions.reduce((acc, q) => {
    return userSelections[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const totalSpentSeconds = Object.values(timeSpentRecord).reduce((a, b) => a + b, 0);

  // Time format helper (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate more Grade 11 questions via AI endpoint
  const handleGenerateAiQuiz = async () => {
    setIsGeneratingAi(true);
    setAiGenMessage(null);

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic: aiCustomTopic,
          difficulty: 'intermediate',
          count: 2,
        }),
      });
      if (!res.ok) throw new Error('無法生成新試題');
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const formatted: Grade11ExamQuestion[] = data.map((item, idx) => ({
          id: `ai-${subject}-${Date.now()}-${idx}`,
          subject,
          unit: aiCustomTopic,
          examSource: '高二學測名師精準素養命題',
          difficulty: '進階應用',
          allocatedMinutes: subject === 'math' ? 7 : 3,
          question: item.question,
          options: item.options,
          correctIndex: item.correctIndex,
          coreConcept: item.topic || aiCustomTopic,
          fullSolution: {
            analysis: '此題依據 108 課綱高二重點命題，需綜合題幹已知條件與定義推演。',
            steps: [item.explanation],
            answerNote: `正確選項為 (${['A', 'B', 'C', 'D'][item.correctIndex]})。`,
          },
          commonTraps: '注意審題條件範圍與各選項細微詞義/正負符號之差別。',
          speedTrick: item.examTrick || '抓住題幹核心動詞與限制條件即可迅速秒殺！',
        }));

        setQuestions((prev) => [...prev, ...formatted]);
        setAiGenMessage(`成功為高二擴充生成 ${formatted.length} 題最新考題與詳解！`);
        setTimeout(() => setAiGenMessage(null), 4000);
      }
    } catch (err: any) {
      console.error(err);
      setAiGenMessage('生成服務暫時無法回應，已載入預設考題。');
      setTimeout(() => setAiGenMessage(null), 3000);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Filtered questions for Browse All mode
  const filteredQuestions = questions.filter((q) => {
    const matchUnit = selectedUnit === '全部單元' || q.unit === selectedUnit;
    const matchDiff = selectedDiff === '全部' || q.difficulty === selectedDiff;
    return matchUnit && matchDiff;
  });

  const isCurrentAnswered = userSelections[currentQ?.id] !== undefined;
  const currentChoice = userSelections[currentQ?.id];
  const isCurrentCorrect = currentChoice === currentQ?.correctIndex;

  return (
    <div className="space-y-6">
      {/* Top Controls: Mode Switcher & Progress Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${themeStyles.bgLight} ${themeStyles.text}`}>
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                108課綱高二 {subjectTitle} 專題考題庫
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                共 {questions.length} 題
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {subject === 'math'
                ? '數學每題 5~10 分鐘（難題 10 分鐘附名師思維提示）· 答完上一題進入下一題'
                : `${subjectTitle}每題 3 分鐘計時 · 一題一題出現 · 即時答案判定與名師全解析`}
            </div>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('timedExam')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'timedExam'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>15題逐題計時實戰</span>
          </button>
          <button
            onClick={() => setViewMode('browseAll')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === 'browseAll'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>15題全覽清單</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: TIMED 15-QUESTION SEQUENTIAL EXAM (MAIN USER REQUIREMENT)        */}
      {/* ========================================================================= */}
      {viewMode === 'timedExam' && (
        <>
          {/* If 15 questions completed: Show Diagnostic Report Screen */}
          {isExamCompleted ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  恭喜完成 {subjectTitle} 15 題段考實戰測驗！
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  根據 108 課綱高二命題標準，為您生成本輪試題作答診斷報告與弱點分析
                </p>
              </div>

              {/* Scorecard Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-xs text-slate-500">總答對題數</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                    {correctCount} <span className="text-sm font-normal text-slate-400">/ {questions.length}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-xs text-slate-500">得分率</div>
                  <div className={`text-2xl font-bold mt-1 tabular-nums ${correctCount >= 12 ? 'text-emerald-600' : correctCount >= 9 ? 'text-sky-600' : 'text-amber-600'}`}>
                    {Math.round((correctCount / questions.length) * 100)}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-xs text-slate-500">測驗總耗時</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                    {formatTime(totalSpentSeconds)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-xs text-slate-500">預估學測級距</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {correctCount >= 13 ? '頂標 (14-15級)' : correctCount >= 10 ? '前標 (12-13級)' : correctCount >= 7 ? '均標 (9-11級)' : '後標 (需加強)'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleAddAllMistakesToErrorBook}
                  className="px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors shadow-xs"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>一鍵將所有錯題收錄至錯題本</span>
                </button>

                <button
                  onClick={handleRestartExam}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors ${themeStyles.btnActive}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>重新挑戰本輪 15 題</span>
                </button>

                <button
                  onClick={() => setViewMode('browseAll')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  檢視全部題目與詳細解析
                </button>
              </div>

              {/* Question By Question Review Accordion */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  15 題作答回顧清單（點擊即可展開每題步驟思路）：
                </h4>

                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const choice = userSelections[q.id];
                    const isRight = choice === q.correctIndex;
                    const isExpanded = expandedSolutions[q.id];

                    return (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all"
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() =>
                            setExpandedSolutions((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                          }
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isRight
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {q.unit} · {q.coreConcept}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-bold ${
                                isRight ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {isRight ? '答對' : choice === -1 ? '超時未答' : '答錯'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Collapsed Detailed View */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-3">
                            <div className="font-serif-tc whitespace-pre-line text-slate-800 dark:text-slate-200 font-medium">
                              {q.question}
                            </div>
                            <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                              {q.fullSolution.answerNote}
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                              {q.fullSolution.steps.map((st, i) => (
                                <div key={i} className="mb-1">{st}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE 1-QUESTION CARD FLOW */
            <div className="space-y-6">
              {/* Question Step Progress Dots (1 to 15) */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-sm">第 {currentIndex + 1} 題</span>
                    <span className="text-slate-400">/ 共 15 題</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {currentQ.unit}
                    </span>
                  </div>

                  {/* Timer Display */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs font-mono font-bold transition-colors ${
                        timeLeft <= 30 && !isCurrentAnswered
                          ? 'bg-rose-100 border-rose-300 text-rose-700 animate-pulse'
                          : themeStyles.timerBadge
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      <span>
                        {isCurrentAnswered
                          ? `作答耗時：${formatTime(timeSpentRecord[currentQ.id] || 0)}`
                          : `剩餘時間：${formatTime(timeLeft)} / ${currentQ.allocatedMinutes || 3}分`}
                      </span>
                    </div>

                    {!isCurrentAnswered && (
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title={isTimerRunning ? '暫停計時' : '繼續計時'}
                      >
                        {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* 15 Question Steps Indicator Track */}
                <div className="grid grid-cols-15 gap-1 pt-1">
                  {questions.map((q, idx) => {
                    const isAnswered = userSelections[q.id] !== undefined;
                    const isCorrect = userSelections[q.id] === q.correctIndex;
                    const isCurrent = idx === currentIndex;

                    let dotClass =
                      'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700';
                    if (isCurrent) {
                      dotClass = `${themeStyles.btnActive} ${themeStyles.activeRing}`;
                    } else if (isAnswered) {
                      dotClass = isCorrect
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-rose-500 text-white font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-7 rounded-md text-[11px] font-mono flex items-center justify-center transition-all ${dotClass}`}
                        title={`第 ${idx + 1} 題：${q.unit} (${q.allocatedMinutes}分鐘)`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The Single Active Question Box */}
              <div
                className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-all ${themeStyles.accentGlow}`}
              >
                {/* Question Metadata Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      第 {currentIndex + 1} 題 / 15
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${themeStyles.badge}`}>
                      {currentQ.examSource}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {currentQ.difficulty}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      限時 {currentQ.allocatedMinutes || 3} 分鐘
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        onAddErrorItem({
                          subject: currentQ.subject,
                          topic: `[高二${subjectTitle}] ${currentQ.unit}`,
                          question: currentQ.question,
                          wrongAnswer:
                            isCurrentAnswered && !isCurrentCorrect
                              ? currentChoice === -1
                                ? '時間到未作答'
                                : currentQ.options[currentChoice]
                              : '觀念不熟',
                          correctAnswer: currentQ.options[currentQ.correctIndex],
                          reason: '觀念不熟',
                          note: currentQ.speedTrick || currentQ.commonTraps,
                        })
                      }
                      className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1.5 transition-colors font-medium"
                      title="收錄進錯題本"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span>收錄錯題本</span>
                    </button>
                  </div>
                </div>

                {/* 10-Minute Math Question Hint Banner (難題十分鐘給提示) */}
                {currentQ.hint && (
                  <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          {currentQ.allocatedMinutes && currentQ.allocatedMinutes >= 10
                            ? '💡 難題10分鐘專屬思維提示（若遇到瓶頸請點開）：'
                            : '💡 名師關鍵提示：'}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 underline transition-colors"
                      >
                        {showHint ? '收起提示' : '查看提示 (不扣分)'}
                      </button>
                    </div>

                    {showHint && (
                      <div className="text-xs text-amber-900 dark:text-amber-200 font-serif-tc leading-relaxed pl-6 border-l-2 border-amber-400 dark:border-amber-600 pt-1">
                        {currentQ.hint}
                      </div>
                    )}
                  </div>
                )}

                {/* Time Out Alert Banner */}
                {isTimeUp && isCurrentAnswered && currentChoice === -1 && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>⏰ 時間已到！請詳閱下方名師推導步驟與常犯地雷，加強解題速度與觀念熟練度。</span>
                  </div>
                )}

                {/* Question Statement */}
                <div className="text-base font-medium text-slate-900 dark:text-white leading-relaxed font-serif-tc whitespace-pre-line">
                  {currentQ.question}
                </div>

                {/* 4 Interactive Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    let optStyle =
                      'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50';

                    if (isCurrentAnswered) {
                      if (optIdx === currentQ.correctIndex) {
                        optStyle =
                          'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                      } else if (optIdx === currentChoice) {
                        optStyle =
                          'border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 line-through';
                      } else {
                        optStyle = 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isCurrentAnswered}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`p-4 text-left rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between font-mono leading-relaxed cursor-pointer disabled:cursor-default ${optStyle}`}
                      >
                        <span>{option}</span>
                        {isCurrentAnswered && optIdx === currentQ.correctIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {isCurrentAnswered && optIdx === currentChoice && optIdx !== currentQ.correctIndex && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & In-Depth Solution Deck (Shown Immediately Upon Answering) */}
                {isCurrentAnswered && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                    {/* Instant Result Notice */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        {isCurrentCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 dark:text-emerald-300">
                              ✓ 回答正確！思維精準迅速。
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span className="text-rose-700 dark:text-rose-300">
                              {currentChoice === -1 ? '✕ 時間到未作答' : '✕ 回答有誤'}，正確答案為 (
                              {['A', 'B', 'C', 'D'][currentQ.correctIndex]})
                            </span>
                          </>
                        )}
                      </div>

                      <span className="text-xs text-slate-500 font-mono">
                        耗時：{formatTime(timeSpentRecord[currentQ.id] || 0)}
                      </span>
                    </div>

                    {/* EXPANDED FULL SOLUTION DECK */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-5 text-xs">
                      {/* Core Concept */}
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-900 dark:text-white shrink-0">
                          🎯 核心考點與概念：
                        </span>
                        <span className={`font-semibold ${themeStyles.text}`}>
                          {currentQ.coreConcept}
                        </span>
                      </div>

                      {/* Analysis & Steps */}
                      <div className="space-y-2">
                        <div className="font-bold text-slate-900 dark:text-white">
                          📝 審題思路與解題步驟推導：
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif-tc">
                          {currentQ.fullSolution.analysis}
                        </p>
                        <div className="space-y-2 pl-3 border-l-2 border-slate-300 dark:border-slate-600">
                          {currentQ.fullSolution.steps.map((st, sIdx) => (
                            <div
                              key={sIdx}
                              className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono"
                            >
                              {st}
                            </div>
                          ))}
                        </div>
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 pt-1">
                          結論：{currentQ.fullSolution.answerNote}
                        </div>
                      </div>

                      {/* Common Pitfalls / Traps */}
                      <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                        <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          ⚠️ 高二學生最常失分地雷（審題陷阱）：
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                          {currentQ.commonTraps}
                        </p>
                      </div>

                      {/* Exam Speed Trick */}
                      <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-white space-y-1.5">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                          ⚡ 考場秒殺技巧與直觀判斷：
                        </div>
                        <p className="text-slate-200 leading-relaxed pl-5">
                          {currentQ.speedTrick}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation: Proceed to Next Question (一題一題出現，答完上一題後出現下一題) */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>上一題</span>
                  </button>

                  <div className="text-xs text-slate-400">
                    {isCurrentAnswered ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ 本題作答已完成
                      </span>
                    ) : (
                      <span>請點選選項作答，答完即解鎖全解析與下一題</span>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={!isCurrentAnswered}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed ${themeStyles.btnActive}`}
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        <span>進入下一題 (第 {currentIndex + 2} / 15 題)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>完成全部 15 題！查看診斷報告</span>
                        <Award className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: BROWSE ALL 15 QUESTIONS (OPTIONAL LIST VIEW FOR REVISION)         */}
      {/* ========================================================================= */}
      {viewMode === 'browseAll' && (
        <div className="space-y-6">
          {/* Unit Filter Navigation Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className={`w-4 h-4 ${themeStyles.text}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">高二核心單元篩選：</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">難度：</span>
                {['全部', '基礎概念', '進階應用', '頂標挑戰'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDiff(diff)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      selectedDiff === diff
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Units Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-semibold ${
                    selectedUnit === u
                      ? themeStyles.btnActive
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* AI Custom Exam Generator Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${themeStyles.bgLight} ${themeStyles.text}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  AI 高二考題與全解析即時生成機
                </div>
                <div className="text-[11px] text-slate-500">
                  挑選單元，由名師引擎為高二量身擬定段考與學測高難度實戰考題
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={aiCustomTopic}
                onChange={(e) => setAiCustomTopic(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                {units.filter((u) => u !== '全部單元').map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerateAiQuiz}
                disabled={isGeneratingAi}
                className={`px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs disabled:opacity-50 ${themeStyles.btnActive}`}
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    命題與解析推演中...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    生成專屬高二新題
                  </>
                )}
              </button>
            </div>
          </div>

          {aiGenMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{aiGenMessage}</span>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            {filteredQuestions.map((q, idx) => {
              const userChoice = userSelections[q.id];
              const isAnswered = userChoice !== undefined;
              const isCorrect = userChoice === q.correctIndex;
              const isExpanded = expandedSolutions[q.id];

              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 transition-all ${themeStyles.accentGlow}`}
                >
                  {/* Question Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        第 {idx + 1} 題
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{q.unit}</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${themeStyles.badge}`}>
                        {q.examSource}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {q.difficulty}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 font-mono">
                        ⏱️ 限時 {q.allocatedMinutes || 3} 分鐘
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          onAddErrorItem({
                            subject: q.subject,
                            topic: `[高二${subjectTitle}] ${q.unit}`,
                            question: q.question,
                            wrongAnswer: isAnswered && !isCorrect ? q.options[userChoice] : '未答/觀念不熟',
                            correctAnswer: q.options[q.correctIndex],
                            reason: '觀念不熟',
                            note: q.speedTrick || q.commonTraps,
                          })
                        }
                        className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                        title="收錄進錯題本"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>收錄錯題本</span>
                      </button>
                    </div>
                  </div>

                  {/* 10-Minute Difficult Hint Box */}
                  {q.hint && (
                    <div className="p-3.5 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 text-xs">
                      <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>💡 難題思維提示：</span>
                      </div>
                      <p className="text-amber-900 dark:text-amber-300 font-serif-tc leading-relaxed pl-5">
                        {q.hint}
                      </p>
                    </div>
                  )}

                  {/* Question Content */}
                  <div className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed font-serif-tc whitespace-pre-line">
                    {q.question}
                  </div>

                  {/* 4 Interactive Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((option, optIdx) => {
                      let optStyle =
                        'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';
                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          optStyle =
                            'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (optIdx === userChoice) {
                          optStyle =
                            'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                        } else {
                          optStyle = 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3.5 text-left rounded-lg border text-xs transition-colors flex items-center justify-between font-mono leading-relaxed ${optStyle}`}
                        >
                          <span>{option}</span>
                          {isAnswered && optIdx === q.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Toggle Solution Action Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-slate-500">
                      {isAnswered && (
                        <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                          {isCorrect ? '✓ 回答正確！' : '✕ 回答有誤，請詳閱下方步驟拆解與避坑分析'}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setExpandedSolutions((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <span>{isExpanded ? '收起名師全解析' : '💡 展開名師全步驟詳解'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* EXPANDED IN-DEPTH FULL SOLUTION DECK */}
                  {isExpanded && (
                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-xs animate-fade-in">
                      {/* Core Concept */}
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-900 dark:text-white shrink-0">
                          🎯 核心考點與概念：
                        </span>
                        <span className={`font-semibold ${themeStyles.text}`}>{q.coreConcept}</span>
                      </div>

                      {/* Analysis & Steps */}
                      <div className="space-y-2">
                        <div className="font-bold text-slate-900 dark:text-white">📝 審題思路與解題步驟推導：</div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif-tc">
                          {q.fullSolution.analysis}
                        </p>
                        <div className="space-y-1.5 pl-2 border-l-2 border-slate-300 dark:border-slate-600">
                          {q.fullSolution.steps.map((st, sIdx) => (
                            <div key={sIdx} className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                              {st}
                            </div>
                          ))}
                        </div>
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 pt-1">
                          結論：{q.fullSolution.answerNote}
                        </div>
                      </div>

                      {/* Common Pitfalls / Traps */}
                      <div className="p-3.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1">
                        <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          ⚠️ 高二學生最常失分地雷（審題陷阱）：
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                          {q.commonTraps}
                        </p>
                      </div>

                      {/* Exam Speed Trick */}
                      <div className="p-3.5 rounded-lg bg-slate-900 dark:bg-slate-950 text-white space-y-1">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                          ⚡ 考場秒殺技巧與直觀判斷：
                        </div>
                        <p className="text-slate-200 leading-relaxed pl-5">
                          {q.speedTrick}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
