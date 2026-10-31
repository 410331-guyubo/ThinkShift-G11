import React, { useState } from 'react';
import { ChineseSentenceDissect, EssayCritiqueResponse, ErrorBookItem } from '../types';
import { PRESET_CHINESE_PASSAGES } from '../data/presetData';
import { GRADE_11_UNITS, GRADE_11_EXAM_QUESTIONS } from '../data/grade11ExamData';
import { SubjectExamHub } from './SubjectExamHub';
import { BookOpen, Sparkles, Feather, CheckCircle, ArrowRight, BookmarkPlus, Loader2, AlertCircle } from 'lucide-react';

interface ChineseModuleProps {
  onAddErrorItem: (item: Omit<ErrorBookItem, 'id' | 'timestamp' | 'mastered'>) => void;
}

export const ChineseModule: React.FC<ChineseModuleProps> = ({ onAddErrorItem }) => {
  const [activeSubTab, setActiveSubTab] = useState<'examHub' | 'dissect' | 'essay'>('examHub');

  // Dissector state
  const [classicalText, setClassicalText] = useState<string>(PRESET_CHINESE_PASSAGES[0].snippet);
  const [dissectResult, setDissectResult] = useState<ChineseSentenceDissect | null>(null);
  const [isDissecting, setIsDissecting] = useState<boolean>(false);
  const [dissectError, setDissectError] = useState<string | null>(null);

  // Essay state
  const [essayText, setEssayText] = useState<string>(
    '那是一個下著大雨的傍晚，我走在放學的路上。段考的成績剛剛發下來，我考得很差，心裡很難過。我看著路邊的小草，雖然被雨打得低下了頭，但還是沒有斷掉。我覺得我也應該像小草一樣堅強，不要隨便放棄自己的理想。'
  );
  const [essayTopic, setEssayTopic] = useState<string>('從挫折中生長的力量');
  const [targetBand, setTargetBand] = useState<string>('大考滿級分 (6級分 / 頂標)');
  const [essayResult, setEssayResult] = useState<EssayCritiqueResponse | null>(null);
  const [isCritiquing, setIsCritiquing] = useState<boolean>(false);
  const [critiqueError, setCritiqueError] = useState<string | null>(null);

  // Trigger Sentence Dissect
  const handleDissect = async (textToUse?: string) => {
    const input = textToUse || classicalText;
    if (!input.trim()) return;
    setIsDissecting(true);
    setDissectError(null);

    try {
      const res = await fetch('/api/ai/dissect-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, type: 'chinese_classical' }),
      });
      if (!res.ok) throw new Error('拆解服務異常');
      const data = await res.json();
      setDissectResult(data);
    } catch (err: any) {
      setDissectError(err.message || '無法取得文言解析');
    } finally {
      setIsDissecting(false);
    }
  };

  // Trigger Essay Critique
  const handleCritiqueEssay = async () => {
    if (!essayText.trim()) return;
    setIsCritiquing(true);
    setCritiqueError(null);

    try {
      const res = await fetch('/api/ai/critique-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: essayText, subject: 'chinese', topic: essayTopic, targetBand }),
      });
      if (!res.ok) throw new Error('批改服務異常');
      const data = await res.json();
      setEssayResult(data);
    } catch (err: any) {
      setCritiqueError(err.message || '批改服務暫時不可用');
    } finally {
      setIsCritiquing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav Navigation Tabs */}
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
          onClick={() => setActiveSubTab('dissect')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeSubTab === 'dissect'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          文言文與詩詞顯微鏡
        </button>
        <button
          onClick={() => setActiveSubTab('essay')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeSubTab === 'essay'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          大考作文急救與潤飾室
        </button>
      </div>

      {/* TAB 0: GRADE 11 EXAMS & FULL SOLUTIONS HUB */}
      {activeSubTab === 'examHub' && (
        <SubjectExamHub
          subject="chinese"
          subjectTitle="高二國文"
          themeColor="amber"
          units={GRADE_11_UNITS.chinese}
          initialQuestions={GRADE_11_EXAM_QUESTIONS.filter((q) => q.subject === 'chinese')}
          onAddErrorItem={onAddErrorItem}
        />
      )}

      {/* TAB 1: CLASSICAL CHINESE DISSECTOR */}
      {activeSubTab === 'dissect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Preset library + Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                大考核心必考名篇選粹
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                點擊直接載入並拆解大考出題率最高之古文精句
              </p>

              <div className="space-y-2">
                {PRESET_CHINESE_PASSAGES.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => {
                      setClassicalText(preset.snippet);
                      handleDissect(preset.snippet);
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>{preset.title}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{preset.grade}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 text-[11px]">
                      {preset.snippet}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  自訂欲剖析文言文或詩詞
                </label>
                <span className="text-[11px] text-slate-400">支援詩詞、銘文、奏表、散文</span>
              </div>
              <textarea
                value={classicalText}
                onChange={(e) => setClassicalText(e.target.value)}
                rows={4}
                placeholder="貼上課本、模擬考或考古題文言字句..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-serif-tc leading-relaxed"
              />
              <button
                onClick={() => handleDissect()}
                disabled={isDissecting}
                className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
              >
                {isDissecting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    名師顯微鏡深度解構中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    開始顯微鏡逐字拆解
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Dissection Results */}
          <div className="lg:col-span-7">
            {dissectError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {dissectError}
              </div>
            )}

            {!dissectResult && !isDissecting && !dissectError && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Feather className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-semibold">尚未載入文言拆解</p>
                <p className="text-xs mt-1">點擊左側範例名篇或輸入自訂文句，體驗字字珠璣的精準剖析</p>
              </div>
            )}

            {isDissecting && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-amber-600" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  正在對字詞音義、文法虛詞、互文修辭進行大考考點關聯...
                </p>
              </div>
            )}

            {dissectResult && !isDissecting && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                {/* Header Title */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {dissectResult.sourceTitle || '名篇語意剖析'}
                  </span>
                  <div className="text-base font-serif-tc font-bold text-slate-900 dark:text-white mt-1 leading-relaxed">
                    「{classicalText}」
                  </div>
                </div>

                {/* Modern Translation */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">白話通暢釋義</div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                    {dissectResult.modernTranslation}
                  </p>
                </div>

                {/* Word by Word Notes */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    重要字詞與虛詞透析（會考學測必考）
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dissectResult.wordByWordNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif-tc text-base font-bold text-amber-800 dark:text-amber-400">
                            {note.char}
                          </span>
                          <span className="font-mono text-xs text-slate-400">{note.pinyin}</span>
                        </div>
                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {note.meaning}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {note.usage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rhetoric Devices */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">篇章修辭與句法技巧</div>
                  <div className="flex flex-wrap gap-2">
                    {dissectResult.rhetoricDevices.map((device, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {device}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exam Takeaway */}
                <div className="p-4 rounded-lg bg-slate-900 text-white dark:bg-slate-800 text-xs space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    大考閱卷召集人叮嚀
                  </div>
                  <p className="text-slate-200 leading-relaxed">{dissectResult.examTakeaway}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI ESSAY CRITIQUE & UPGRADE DOCTOR */}
      {activeSubTab === 'essay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Essay Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Feather className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                作文段落潤飾與立意昇華
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                依據大考 4 大核心規準（審題立意、結構組織、修辭文采、標點字體）為您的文章進行診斷升級
              </p>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  作文題目或情境
                </label>
                <input
                  type="text"
                  value={essayTopic}
                  onChange={(e) => setEssayTopic(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  目標評分標準
                </label>
                <select
                  value={targetBand}
                  onChange={(e) => setTargetBand(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="大考滿級分 (6級分 / 頂標)">大考滿級分 (6級分 / 頂標)</option>
                  <option value="穩健提分 (5級分 / 前標)">穩健提分 (5級分 / 前標)</option>
                  <option value="基礎躍升 (4級分 / 均標)">基礎躍升 (4級分 / 均標)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    文章草稿或特定段落
                  </label>
                  <span className="text-[11px] text-slate-400 tabular-nums">{essayText.length} 字</span>
                </div>
                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  rows={6}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-serif-tc leading-relaxed"
                />
              </div>

              <button
                onClick={handleCritiqueEssay}
                disabled={isCritiquing}
                className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
              >
                {isCritiquing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    正在全面規準批改與句型重塑...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    立即獲得滿級分批改報告
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Critique & Upgrades */}
          <div className="lg:col-span-7">
            {critiqueError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {critiqueError}
              </div>
            )}

            {!essayResult && !isCritiquing && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Feather className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-semibold">尚未產生批改報告</p>
                <p className="text-xs mt-1">點擊左側「立即獲得滿級分批改報告」開始診斷</p>
              </div>
            )}

            {isCritiquing && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-rose-600" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  大考專家正在逐句推敲立意、結構流暢度，重塑精妙文采句...
                </p>
              </div>
            )}

            {essayResult && !isCritiquing && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div>
                    <span className="text-xs text-slate-500">大考預估等級</span>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      {essayResult.overallScore}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-500">
                    評估目標：<span className="font-semibold text-slate-800 dark:text-slate-200">{targetBand}</span>
                  </div>
                </div>

                {/* 4 Dimension Matrix */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">四維規準量化得分</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {essayResult.dimensionScores.map((dim, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{dim.dimension}</span>
                          <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                            {dim.score} / {dim.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-600 h-full rounded-full"
                            style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{dim.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crucial Section: Sentence Upgrades (Before / After) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    化平淡為驚豔 · 句型典範重塑對比
                  </div>
                  <div className="space-y-3">
                    {essayResult.sentenceUpgrades.map((upgrade, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs"
                      >
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                          <span className="font-semibold text-slate-500">原文語法：</span>
                          <span className="text-slate-700 dark:text-slate-300 ml-1 font-serif-tc">
                            {upgrade.original}
                          </span>
                        </div>
                        <div className="p-3 bg-rose-50/40 dark:bg-rose-950/20 border-b border-slate-200 dark:border-slate-700">
                          <span className="font-semibold text-rose-700 dark:text-rose-400">大師潤飾：</span>
                          <span className="text-slate-900 dark:text-white font-serif-tc font-semibold ml-1">
                            {upgrade.upgraded}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">升級關鍵：</span>{' '}
                          {upgrade.rationale}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structure Suggestions & Conclusion */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white">立意昇華與架構布局建議</div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {essayResult.structureSuggestions}
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 italic">
                    名師總評：{essayResult.modelConclusion}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
