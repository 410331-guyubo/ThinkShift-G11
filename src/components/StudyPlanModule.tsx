import React, { useState } from 'react';
import { DiagnosticPlanResponse } from '../types';
import { Target, Sparkles, Calendar, TrendingUp, CheckCircle, Clock, BookOpen, Loader2, Award } from 'lucide-react';

export const StudyPlanModule: React.FC = () => {
  const [chineseGrade, setChineseGrade] = useState<string>('B++ / 前標邊緣');
  const [mathGrade, setMathGrade] = useState<string>('B+ / 均標');
  const [englishGrade, setEnglishGrade] = useState<string>('B / 均標');
  const [targetGoal, setTargetGoal] = useState<string>('全面衝刺 3A++ / 頂標 14~15級分');
  const [hoursPerDay, setHoursPerDay] = useState<number>(3);
  const [mainStruggles, setMainStruggles] = useState<string>(
    '數學幾何常看不出輔助線，英文長篇閱讀讀不完容易粗心，國文文言文閱讀速度慢、作文立意稍嫌平淡。'
  );

  const [planResult, setPlanResult] = useState<DiagnosticPlanResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/diagnose-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chineseGrade,
          mathGrade,
          englishGrade,
          targetGoal,
          hoursPerDay,
          mainStruggles,
        }),
      });
      if (!res.ok) throw new Error('提分診斷服務異常');
      const data = await res.json();
      setPlanResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || '無法取得診斷報告');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Description */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          全科 30 天提分戰略藍圖診斷
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          拒絕盲目刷題 · 依據個人弱點大數據精確匹配「二八法則」高產出突破路徑
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Input (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">學生學力現況盤點</h3>

          {/* Chinese Grade */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              國文目前模考/段考水準
            </label>
            <input
              type="text"
              value={chineseGrade}
              onChange={(e) => setChineseGrade(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Math Grade */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              數學目前模考/段考水準
            </label>
            <input
              type="text"
              value={mathGrade}
              onChange={(e) => setMathGrade(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* English Grade */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              英文目前模考/段考水準
            </label>
            <input
              type="text"
              value={englishGrade}
              onChange={(e) => setEnglishGrade(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Target Goal */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              目標志願或升學門檻
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Hours per Day */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 mb-1">
              <label>每日可自由支配讀書時間</label>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {hoursPerDay} 小時
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Struggles */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              核心困擾與最大痛點
            </label>
            <textarea
              rows={3}
              value={mainStruggles}
              onChange={(e) => setMainStruggles(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                正在智能計算三科權重與突破日程...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                生成專屬 30 天提分作戰圖
              </>
            )}
          </button>
        </div>

        {/* Blueprint Output (7 cols) */}
        <div className="lg:col-span-7">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs mb-4">
              {errorMsg}
            </div>
          )}

          {!planResult && !isGenerating && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
              <Award className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-semibold">尚未生成提分藍圖</p>
              <p className="text-xs mt-1">填寫左側學力現況，一鍵打造個人化語數英躍升計畫</p>
            </div>
          )}

          {isGenerating && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500">
              <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-indigo-600" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                名師系統正在深度診斷學力瓶頸，規劃 30 天提分路徑...
              </p>
            </div>
          )}

          {planResult && !isGenerating && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
              {/* Executive Summary */}
              <div className="p-4 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  大考名師診斷摘要
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {planResult.diagnosticSummary}
                </p>
              </div>

              {/* Subject Breakdown Cards */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  語數英三科突破策略與預期提分
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {/* Chinese Strategy */}
                  <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-950/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900 dark:text-amber-300">
                        國文 · {planResult.subjectStrategies.chinese.focus}
                      </span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        預期提升：{planResult.subjectStrategies.chinese.expectedGain}
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc pl-5">
                      {planResult.subjectStrategies.chinese.actionItems.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Math Strategy */}
                  <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-sky-50/30 dark:bg-sky-950/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sky-900 dark:text-sky-300">
                        數學 · {planResult.subjectStrategies.math.focus}
                      </span>
                      <span className="font-semibold text-sky-700 dark:text-sky-400">
                        預期提升：{planResult.subjectStrategies.math.expectedGain}
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc pl-5">
                      {planResult.subjectStrategies.math.actionItems.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  {/* English Strategy */}
                  <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300">
                        英文 · {planResult.subjectStrategies.english.focus}
                      </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        預期提升：{planResult.subjectStrategies.english.expectedGain}
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc pl-5">
                      {planResult.subjectStrategies.english.actionItems.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  高效循環日程表（依據每日 {hoursPerDay} 小時精準規劃）
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {planResult.weeklySchedule.map((sched, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs space-y-1.5"
                    >
                      <div className="font-semibold text-slate-900 dark:text-white">{sched.day}</div>
                      <div className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                        {sched.routine.map((r, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-1">
                            <span className="text-indigo-500">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mindset tip */}
              <div className="p-3.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">導師激勵心法：</span>{' '}
                  <span className="text-slate-200">{planResult.mindsetTip}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
