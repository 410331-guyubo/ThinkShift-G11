import React, { useState } from 'react';
import { EnglishSentenceDissect, ErrorBookItem } from '../types';
import { PRESET_ENGLISH_VOCAB, PRESET_ENGLISH_SENTENCES, EnglishVocabCard } from '../data/presetData';
import { GRADE_11_UNITS, GRADE_11_EXAM_QUESTIONS } from '../data/grade11ExamData';
import { SubjectExamHub } from './SubjectExamHub';
import { Volume2, Sparkles, Languages, Search, BookmarkPlus, Loader2, CheckCircle, BookOpen, AlertCircle } from 'lucide-react';

interface EnglishModuleProps {
  onAddErrorItem: (item: Omit<ErrorBookItem, 'id' | 'timestamp' | 'mastered'>) => void;
}

export const EnglishModule: React.FC<EnglishModuleProps> = ({ onAddErrorItem }) => {
  const [activeSubTab, setActiveSubTab] = useState<'examHub' | 'vocab' | 'syntax'>('examHub');

  // Vocab State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Syntax State
  const [sentenceInput, setSentenceInput] = useState<string>(PRESET_ENGLISH_SENTENCES[0].sentence);
  const [syntaxResult, setSyntaxResult] = useState<EnglishSentenceDissect | null>(null);
  const [isDissecting, setIsDissecting] = useState<boolean>(false);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);

  // Audio Playback using Web Speech API
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Dissect English Sentence
  const handleDissectSentence = async (textToUse?: string) => {
    const input = textToUse || sentenceInput;
    if (!input.trim()) return;
    setIsDissecting(true);
    setSyntaxError(null);

    try {
      const res = await fetch('/api/ai/dissect-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, type: 'english_grammar' }),
      });
      if (!res.ok) throw new Error('長難句剖析失敗');
      const data = await res.json();
      setSyntaxResult(data);
    } catch (err: any) {
      setSyntaxError(err.message || '文法手術台暫時不可用');
    } finally {
      setIsDissecting(false);
    }
  };

  const filteredVocab = PRESET_ENGLISH_VOCAB.filter((item) => {
    const matchSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chinese.includes(searchQuery) ||
      item.collocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = selectedLevel === 'all' || item.level.includes(selectedLevel);
    return matchSearch && matchLevel;
  });

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
          onClick={() => setActiveSubTab('vocab')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeSubTab === 'vocab'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          7000字搭配詞與字根網絡
        </button>
        <button
          onClick={() => setActiveSubTab('syntax')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeSubTab === 'syntax'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          長難句文法手術台
        </button>
      </div>

      {/* TAB 0: GRADE 11 ENGLISH EXAMS & FULL SOLUTIONS HUB */}
      {activeSubTab === 'examHub' && (
        <SubjectExamHub
          subject="english"
          subjectTitle="高二英文"
          themeColor="emerald"
          units={GRADE_11_UNITS.english}
          initialQuestions={GRADE_11_EXAM_QUESTIONS.filter((q) => q.subject === 'english')}
          onAddErrorItem={onAddErrorItem}
        />
      )}

      {/* SUB-TAB 1: VOCABULARY & COLLOCATION NETWORK */}
      {activeSubTab === 'vocab' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜尋核心單字、中文義項、字根或搭配詞..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">全等級字彙</option>
                <option value="Level 3-4">基礎核心 (Level 3-4)</option>
                <option value="Level 5">進階學測 (Level 5)</option>
                <option value="Level 6">頂標分科 (Level 6)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((v) => (
              <div
                key={v.word}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          {v.word}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{v.partOfSpeech}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">{v.phonetic}</div>
                    </div>
                    <button
                      onClick={() => handleSpeak(v.word)}
                      title="真人標準發音"
                      className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      aria-label="發音"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    {v.chinese}
                  </div>

                  {/* Root Analysis */}
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">字源解碼：</span>{' '}
                    {v.rootAnalysis}
                  </div>

                  {/* Collocation */}
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">大考搭配詞：</span>
                    <span className="font-medium ml-1">{v.collocation}</span>
                  </div>

                  {/* Example */}
                  <div className="text-xs text-slate-600 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    "{v.exampleSentence}"
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400">{v.level}</span>
                  <button
                    onClick={() =>
                      onAddErrorItem({
                        subject: 'english',
                        topic: '7000核心字彙',
                        question: `單字：${v.word} (${v.partOfSpeech})`,
                        wrongAnswer: '記憶模糊',
                        correctAnswer: `${v.chinese} | ${v.collocation}`,
                        reason: '觀念不熟',
                        note: v.rootAnalysis,
                      })
                    }
                    className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    加入生詞本
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SYNTAX & GRAMMAR SURGERY */}
      {activeSubTab === 'syntax' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Presets + Input */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                大考頂標長難句型選粹
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                一鍵載入倒裝、分詞構句、假設語氣等大考閱讀失分最嚴重的核心句型
              </p>

              <div className="space-y-2">
                {PRESET_ENGLISH_SENTENCES.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => {
                      setSentenceInput(preset.sentence);
                      handleDissectSentence(preset.sentence);
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                      <span>{preset.title}</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {preset.grammarFocus}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 text-[11px] italic">
                      {preset.sentence}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  貼上任何英文長難句
                </label>
                <span className="text-[11px] text-slate-400">支援3行以上複合句</span>
              </div>
              <textarea
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                rows={4}
                placeholder="輸入閱測、克漏字或新聞英文中的複雜長句..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono leading-relaxed"
              />

              <button
                onClick={() => handleDissectSentence()}
                disabled={isDissecting}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
              >
                {isDissecting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    正在精準拆解主動受、修飾語與子句...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    開始文法手術拆解
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Syntax Surgery Output */}
          <div className="lg:col-span-7">
            {syntaxError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {syntaxError}
              </div>
            )}

            {!syntaxResult && !isDissecting && !syntaxError && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Languages className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-semibold">尚未進行文法手術</p>
                <p className="text-xs mt-1">選取左側長難句範本或自行輸入，體驗X光透視級的語法解析</p>
              </div>
            )}

            {isDissecting && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-emerald-600" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  正在標記主幹結構、分離關係子句與分詞修飾語...
                </p>
              </div>
            )}

            {syntaxResult && !isDissecting && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                {/* Sentence & Audio */}
                <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-serif text-slate-900 dark:text-white leading-relaxed">
                      "{sentenceInput}"
                    </p>
                    <button
                      onClick={() => handleSpeak(sentenceInput)}
                      className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shrink-0"
                      title="真人朗讀全句"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Skeleton */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    句子骨架 X-Ray（主詞 · 動詞 · 受詞）
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="text-[11px] text-slate-500 font-semibold">主詞 (Subject)</div>
                      <div className="font-mono text-slate-900 dark:text-white mt-1 font-semibold">
                        {syntaxResult.mainSubject}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        主要動詞 (Main Verb)
                      </div>
                      <div className="font-mono text-emerald-900 dark:text-emerald-200 mt-1 font-bold">
                        {syntaxResult.mainVerb}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="text-[11px] text-slate-500 font-semibold">受詞/補語 (Object)</div>
                      <div className="font-mono text-slate-900 dark:text-white mt-1 font-semibold">
                        {syntaxResult.mainObject || '無直接受詞 (不及物或倒裝結構)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subordinate Clauses */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    子句層級剖析 (Clause Decomposition)
                  </div>
                  <div className="space-y-2">
                    {syntaxResult.clauses.map((clause, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
                      >
                        <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                          {clause.type}
                        </div>
                        <div className="font-mono text-slate-800 dark:text-slate-200 italic">
                          "{clause.text}"
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{clause.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grammar Points */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">大考文法核心考點</div>
                  <div className="flex flex-wrap gap-2">
                    {syntaxResult.grammarPoints.map((pt, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      >
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Smooth Translation */}
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">道地中文意譯</div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {syntaxResult.translatedChinese}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
