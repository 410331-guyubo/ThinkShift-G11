import React, { useState } from 'react';
import { MathSolveResponse, ErrorBookItem } from '../types';
import { PRESET_MATH_PROBLEMS } from '../data/presetData';
import { GRADE_11_UNITS, GRADE_11_EXAM_QUESTIONS } from '../data/grade11ExamData';
import { SubjectExamHub } from './SubjectExamHub';
import { MathVisualizer } from './MathVisualizer';
import { Compass, Sparkles, AlertTriangle, Lightbulb, BookmarkPlus, Loader2, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';

interface MathModuleProps {
  onAddErrorItem: (item: Omit<ErrorBookItem, 'id' | 'timestamp' | 'mastered'>) => void;
}

export const MathModule: React.FC<MathModuleProps> = ({ onAddErrorItem }) => {
  const [activeSubTab, setActiveSubTab] = useState<'examHub' | 'solver' | 'visualizer'>('examHub');

  // Solver state
  const [mathProblem, setMathProblem] = useState<string>(PRESET_MATH_PROBLEMS[0].problem);
  const [studentAttempt, setStudentAttempt] = useState<string>('');
  const [gradeLevel, setGradeLevel] = useState<string>('高中二年級 (數A / 數B)');
  const [solveResult, setSolveResult] = useState<MathSolveResponse | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [showSimilarAnswer, setShowSimilarAnswer] = useState<boolean>(false);

  // Handle Math Solve API call
  const handleSolve = async (problemToUse?: string) => {
    const input = problemToUse || mathProblem;
    if (!input.trim()) return;
    setIsSolving(true);
    setSolveError(null);
    setShowSimilarAnswer(false);

    try {
      const res = await fetch('/api/ai/solve-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: input, gradeLevel, studentAttempt }),
      });
      if (!res.ok) throw new Error('數學求解服務異常');
      const data = await res.json();
      setSolveResult(data);
    } catch (err: any) {
      setSolveError(err.message || '解題剖析暫時無法回應');
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveSubTab('examHub')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeSubTab === 'examHub'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          高二考題與全解析精選
        </button>
        <button
          onClick={() => setActiveSubTab('solver')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeSubTab === 'solver'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          AI 步驟逆向解題機
        </button>
        <button
          onClick={() => setActiveSubTab('visualizer')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeSubTab === 'visualizer'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          幾何與函數直觀實驗室
        </button>
      </div>

      {/* TAB 0: GRADE 11 MATH EXAMS & SOLUTIONS HUB */}
      {activeSubTab === 'examHub' && (
        <SubjectExamHub
          subject="math"
          subjectTitle="高二數學 (數A / 數B)"
          themeColor="sky"
          units={GRADE_11_UNITS.math}
          initialQuestions={GRADE_11_EXAM_QUESTIONS.filter((q) => q.subject === 'math')}
          onAddErrorItem={onAddErrorItem}
        />
      )}

      {/* SUB-TAB 1: SOLVER & TRAP REVEALER */}
      {activeSubTab === 'solver' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Preset Problems + Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                大考經典易錯母題庫
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                一鍵載入歷屆常考、觀念陷阱最深的代表性題型
              </p>

              <div className="space-y-2">
                {PRESET_MATH_PROBLEMS.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => {
                      setMathProblem(preset.problem);
                      handleSolve(preset.problem);
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>{preset.title}</span>
                      <span className="text-[11px] text-slate-400">{preset.tag}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 text-[11px]">
                      {preset.problem}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  輸入任何數學題目
                </label>
                <span className="text-[11px] text-slate-400">支援幾何、代數、機率、三角</span>
              </div>
              <textarea
                value={mathProblem}
                onChange={(e) => setMathProblem(e.target.value)}
                rows={4}
                placeholder="輸入題目敘述或算式..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono leading-relaxed"
              />

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  你的卡關點或目前推導想法 (選填，AI會針對盲點糾正)
                </label>
                <input
                  type="text"
                  value={studentAttempt}
                  onChange={(e) => setStudentAttempt(e.target.value)}
                  placeholder="例如：我算到頂點但不知道怎麼結合區間範圍..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                onClick={() => handleSolve()}
                disabled={isSolving}
                className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
              >
                {isSolving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    正在逆向推導思路與標記失分地雷...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    開始步驟剖析與避坑引導
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Solution Output */}
          <div className="lg:col-span-7">
            {solveError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {solveError}
              </div>
            )}

            {!solveResult && !isSolving && !solveError && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Compass className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-semibold">尚未載入題目解析</p>
                <p className="text-xs mt-1">從左側點選常考母題，或輸入作業/模擬考中的難題</p>
              </div>
            )}

            {isSolving && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-sky-600" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  名師正在拆解解題架構、盤點考題陷阱、生成平行變式題...
                </p>
              </div>
            )}

            {solveResult && !isSolving && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                {/* Core Concept Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div>
                    <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                      大考考查核心觀念
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {solveResult.coreConcept}
                    </h4>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                    {solveResult.formula}
                  </div>
                </div>

                {/* Step-by-Step Breakdown */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    邏輯解題思維路徑 (Step-by-Step)
                  </div>
                  <div className="space-y-3">
                    {solveResult.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1.5"
                      >
                        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                          <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center text-[11px] font-mono">
                            {st.stepNumber}
                          </span>
                          <span>{st.title}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                          {st.explanation}
                        </p>
                        {st.mathExpr && (
                          <div className="pl-7 pt-1 font-mono text-xs text-sky-800 dark:text-sky-300 font-semibold">
                            {st.mathExpr}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Answer */}
                <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs flex items-center justify-between">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                    標準答案與結論：
                  </span>
                  <span className="font-mono font-bold text-emerald-900 dark:text-emerald-100 text-sm">
                    {solveResult.finalAnswer}
                  </span>
                </div>

                {/* Common Pitfalls / Traps */}
                <div className="p-4 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2 text-xs">
                  <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    學生常犯的三大失分地雷（高危險陷阱）：
                  </div>
                  <ul className="space-y-1.5 pl-6 list-disc text-slate-700 dark:text-slate-300">
                    {solveResult.commonTraps.map((trap, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {trap}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Check Tip */}
                <div className="p-3 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">秒殺直觀檢驗技巧：</span>{' '}
                    <span className="text-slate-200">{solveResult.quickTip}</span>
                  </div>
                </div>

                {/* Similar Practice Problem */}
                <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/30 dark:bg-sky-950/20 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      同觀念變式題（測驗你是否真正掌握）
                    </div>
                    <button
                      onClick={() =>
                        onAddErrorItem({
                          subject: 'math',
                          topic: solveResult.coreConcept,
                          question: solveResult.similarProblem.problem,
                          wrongAnswer: '變式題演練',
                          correctAnswer: solveResult.similarProblem.answer,
                          reason: '公式記憶模糊',
                          note: solveResult.similarProblem.hint,
                        })
                      }
                      className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1"
                    >
                      <BookmarkPlus className="w-3 h-3" />
                      收錄至錯題本
                    </button>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
                    {solveResult.similarProblem.problem}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSimilarAnswer(!showSimilarAnswer)}
                      className="px-3 py-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 text-xs"
                    >
                      {showSimilarAnswer ? '隱藏提示與答案' : '查看解題提示與答案'}
                    </button>
                  </div>
                  {showSimilarAnswer && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">提示：</span>{' '}
                        {solveResult.similarProblem.hint}
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-400 font-bold">
                        答案：{solveResult.similarProblem.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VISUALIZER */}
      {activeSubTab === 'visualizer' && <MathVisualizer />}
    </div>
  );
};
