import React, { useState } from 'react';
import { SubjectKey, DailySprintTask, ErrorBookItem } from '../types';
import confetti from 'canvas-confetti';
import heroImg from '../assets/images/hero_study_booster_1793412112725.jpg';
import chineseImg from '../assets/images/subject_chinese_art_1793412112955.jpg';
import mathImg from '../assets/images/subject_math_geometry_1793412114372.jpg';
import englishImg from '../assets/images/subject_english_mastery_1793412113865.jpg';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Calendar,
  Flame,
  Award,
  BookOpen,
  Compass,
  Languages,
  BookmarkPlus,
  HelpCircle,
  Target
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: SubjectKey) => void;
  dailySprints: DailySprintTask[];
  onAnswerDailySprint: (taskId: string, optionIndex: number) => void;
  streakDays: number;
  onAddErrorItem: (item: Omit<ErrorBookItem, 'id' | 'timestamp' | 'mastered'>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  dailySprints,
  onAnswerDailySprint,
  streakDays,
  onAddErrorItem,
}) => {
  const [selectedExam, setSelectedExam] = useState<'cap' | 'gsat'>('gsat');

  // Exam Countdown calculation (2027 January for GSAT, May for CAP)
  const gsatDate = new Date('2027-01-22T08:00:00');
  const capDate = new Date('2027-05-15T08:00:00');
  const now = new Date();
  const targetDate = selectedExam === 'gsat' ? gsatDate : capDate;
  const daysLeft = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const completedCount = dailySprints.filter((t) => t.completed).length;
  const isAllSprintFinished = completedCount === dailySprints.length && dailySprints.length > 0;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: HERO VIEWPORT SPLIT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        {/* Left Column (7 cols): Editorial Typography & Direct Action */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-slate-900 dark:text-white font-bold">108課綱高二重點深化</span>
              <span aria-hidden="true">·</span>
              <span>高二段考與學測頂標突破</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                <Flame className="w-3.5 h-3.5 fill-current" />
                已連續修煉 {streakDays} 天
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 dark:text-white leading-[1.2] tracking-tight text-balance font-display">
              高二語數英頂標攻堅 · 核心考題與名師全解析
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              專為高中二年級打造：點進語數英各科獨立面板，即可分單元刷練高二段考與學測高頻考題，包含逐步思路推導、易錯地雷陷阱與秒殺速解。
            </p>
          </div>

          {/* Exam Countdown & Primary Launch Bar */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setSelectedExam('gsat')}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                    selectedExam === 'gsat'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  高二升學測 (116學測)
                </button>
                <button
                  onClick={() => setSelectedExam('cap')}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                    selectedExam === 'cap'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  高二期末段考
                </button>
              </div>

              <div className="text-xs">
                <span className="text-slate-500">倒數：</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white ml-1 tabular-nums">
                  {daysLeft}
                </span>
                <span className="text-slate-500 ml-1">天</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const sprintElem = document.getElementById('daily-sprint-section');
                  sprintElem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                今日高二三科衝刺 ({completedCount}/3)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): High Fidelity Generated Hero Image */}
        <div className="lg:col-span-5 h-72 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-900">
          <img
            src={heroImg}
            alt="智學三絕學習研討書齋"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
            <span className="text-xs font-medium text-slate-300">國文 · 數學 · 英文</span>
            <div className="text-sm font-bold mt-0.5">格物致知 · 融會貫通</div>
          </div>
        </div>
      </section>

      {/* Featured Banner: 智學三絕專區 */}
      <div
        onClick={() => onNavigate('mastery')}
        className="cursor-pointer group p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-sky-500/15 to-emerald-500/15 border border-amber-300/40 dark:border-indigo-500/30 hover:border-indigo-500/60 dark:hover:border-indigo-400/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
            絕
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                全新專區
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-display">
                智學三絕 · 語數英大考破題秘笈殿堂
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              古文思辨脈絡、向量幾何投影秒殺、大考倒裝與高頻搭配詞 · 三絕心法速成與限時試煉
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0">
          <span>進入研讀三絕</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* SECTION 2: THREE-SUBJECT GATEWAY CARDS (Bento Style) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">三科學術突破陣地</h2>
            <p className="text-xs text-slate-500">直擊各科考試特性，結合AI即時推導與診斷</p>
          </div>
          <button
            onClick={() => onNavigate('plan')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            <span>定制30天提分圖</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Chinese */}
          <div
            onClick={() => onNavigate('chinese')}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between"
          >
            <div className="h-44 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
              <img
                src={chineseImg}
                alt="國文古文與文學藝術"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-bold text-amber-800 dark:text-amber-300">
                國文語文攻堅
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>文言名篇與大考作文</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  文言虛詞顯微鏡拆解、互文倒裝修辭判讀，與作文立意昇華「化平淡為驚豔」潤飾引擎。
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>包含：古文核心15篇 · 4維規準批改 · 歷屆語感精練</span>
              </div>
            </div>
          </div>

          {/* Card 2: Math */}
          <div
            onClick={() => onNavigate('math')}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-sky-400 dark:hover:border-sky-600 transition-all flex flex-col justify-between"
          >
            <div className="h-44 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
              <img
                src={mathImg}
                alt="數學幾何與函數微積分"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-bold text-sky-800 dark:text-sky-300">
                數理破題思維
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>步驟透析與幾何實驗</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  深入揭露 3 大失分地雷、二次函數拋物線定義域動態滑桿、勾股定理與排列組合圖解。
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>包含：避坑引導 · 變式平行題 · 互動拋物線實驗室</span>
              </div>
            </div>
          </div>

          {/* Card 3: English */}
          <div
            onClick={() => onNavigate('english')}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between"
          >
            <div className="h-44 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
              <img
                src={englishImg}
                alt="英語語言學與經典文學"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                英文核心精研
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>7000字搭配詞與長難句</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  字首字根拆解記憶法、真人朗讀發音、長難句主幹X光透視與克漏字文法結構破題。
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>包含：字源解碼 · 真人語音朗讀 · 倒裝分詞手術</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DAILY 15-MINUTE MICRO-SPRINT CHALLENGE */}
      <section id="daily-sprint-section" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                每日三科 15 分鐘微衝刺挑戰
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                進度：{completedCount} / 3 題已答
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              每日精選 1 題國文煉字 + 1 題數學陷阱 + 1 題英文長難句，維持敏銳題感
            </p>
          </div>

          {isAllSprintFinished && (
            <button
              onClick={triggerConfetti}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
            >
              <Award className="w-4 h-4" />
              恭喜今日全數通關！再次慶祝
            </button>
          )}
        </div>

        <div className="space-y-6">
          {dailySprints.map((task, index) => {
            const isAnswered = task.userSelection !== undefined;
            const isCorrect = task.userSelection === task.correctIndex;

            return (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      第 {index + 1} 題：{task.subjectTitle}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{task.tag}</span>
                  </div>

                  <button
                    onClick={() =>
                      onAddErrorItem({
                        subject: task.subject,
                        topic: task.subjectTitle,
                        question: task.question,
                        wrongAnswer: isAnswered && !isCorrect ? task.options[task.userSelection!] : '未答/不熟',
                        correctAnswer: task.options[task.correctIndex],
                        reason: '題意誤解',
                        note: task.examTrick,
                      })
                    }
                    className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    title="收錄進錯題本"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>收錄錯題</span>
                  </button>
                </div>

                <div className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed font-serif-tc">
                  {task.question}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {task.options.map((opt, optIdx) => {
                    let btnStyle =
                      'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300';
                    if (isAnswered) {
                      if (optIdx === task.correctIndex) {
                        btnStyle =
                          'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (optIdx === task.userSelection) {
                        btnStyle =
                          'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                      } else {
                        btnStyle = 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => {
                          onAnswerDailySprint(task.id, optIdx);
                          if (completedCount + 1 === dailySprints.length) {
                            triggerConfetti();
                          }
                        }}
                        className={`p-3 text-left rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === task.correctIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Trick */}
                {isAnswered && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-900 dark:text-white">題目解析：</span>{' '}
                      {task.explanation}
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">大考破題心法：</span> {task.examTrick}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
