/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SubjectKey, DailySprintTask, ErrorBookItem } from './types';
import { INITIAL_DAILY_SPRINTS } from './data/presetData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ChineseModule } from './components/ChineseModule';
import { MathModule } from './components/MathModule';
import { EnglishModule } from './components/EnglishModule';
import { StudyPlanModule } from './components/StudyPlanModule';
import { TriMasteryPage } from './components/TriMasteryPage';
import { ErrorBookModal } from './components/ErrorBookModal';
import { BookOpen, Compass, Languages, Target, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<SubjectKey>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem('trio_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Daily Sprints state
  const [dailySprints, setDailySprints] = useState<DailySprintTask[]>(() => {
    const saved = localStorage.getItem('trio_daily_sprints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_DAILY_SPRINTS;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('trio_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Error Book state
  const [errorBookItems, setErrorBookItems] = useState<ErrorBookItem[]>(() => {
    const saved = localStorage.getItem('trio_error_book');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'err-default-1',
        subject: 'math',
        topic: '二次函數區間極值',
        question: 'y = -(x - 2)² + 5 在 3 ≤ x ≤ 6 之最大值為何？',
        wrongAnswer: '選 (A) 5',
        correctAnswer: '答案為 4 (因頂點 x=2 不在區間 [3, 6] 內，極值在端點 x=3 發生)',
        reason: '粗心計算',
        note: '切記每次都要在草稿紙畫出拋物線開口與區間邊界！',
        timestamp: Date.now() - 86400000,
        mastered: false,
      },
      {
        id: 'err-default-2',
        subject: 'english',
        topic: '倒裝句文法',
        question: 'Not only ______ the crucial scholarship, but she also earned the opportunity...',
        wrongAnswer: '選 (A) she secured',
        correctAnswer: '選 (B) did she secure (Not only 放句首第一子句必倒裝)',
        reason: '觀念不熟',
        note: '否定副詞在句首，助動詞提前，動詞用原形！',
        timestamp: Date.now() - 43200000,
        mastered: true,
      },
    ];
  });

  const [isErrorBookOpen, setIsErrorBookOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Sync theme with DOM documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('trio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('trio_theme', 'light');
    }
  }, [isDark]);

  // Persist Daily sprints
  useEffect(() => {
    localStorage.setItem('trio_daily_sprints', JSON.stringify(dailySprints));
  }, [dailySprints]);

  // Persist Error book
  useEffect(() => {
    localStorage.setItem('trio_error_book', JSON.stringify(errorBookItems));
  }, [errorBookItems]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleAnswerDailySprint = (taskId: string, optionIndex: number) => {
    setDailySprints((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: true, userSelection: optionIndex } : t
      )
    );
  };

  const handleAddErrorItem = (item: Omit<ErrorBookItem, 'id' | 'timestamp' | 'mastered'>) => {
    const newItem: ErrorBookItem = {
      ...item,
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      mastered: false,
    };
    setErrorBookItems((prev) => [newItem, ...prev]);
    setShowToast('已成功收錄至個人錯題本！');
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleToggleMastered = (id: string) => {
    setErrorBookItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, mastered: !item.mastered } : item))
    );
  };

  const handleDeleteErrorItem = (id: string) => {
    setErrorBookItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateErrorNote = (id: string, note: string) => {
    setErrorBookItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        errorBookCount={errorBookItems.filter((i) => !i.mastered).length}
        onOpenErrorBook={() => setIsErrorBookOpen(true)}
        onStartSprint={() => {
          setCurrentTab('dashboard');
          setTimeout(() => {
            const sprintElem = document.getElementById('daily-sprint-section');
            sprintElem?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentTab}
            dailySprints={dailySprints}
            onAnswerDailySprint={handleAnswerDailySprint}
            streakDays={streakDays}
            onAddErrorItem={handleAddErrorItem}
          />
        )}

        {currentTab === 'mastery' && (
          <TriMasteryPage
            onNavigate={setCurrentTab}
            onAddErrorItem={handleAddErrorItem}
          />
        )}

        {currentTab === 'chinese' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                高二國文 · 核心考題與名師全解析
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                涵蓋高二古文十五篇思辨、先秦諸子、古典詩詞詞曲與國寫作文 · 考題與完整步驟思路
              </p>
            </div>
            <ChineseModule onAddErrorItem={handleAddErrorItem} />
          </div>
        )}

        {currentTab === 'math' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                高二數學 (數A / 數B) · 考題與全步驟詳解
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                三角函數與正餘弦、平面向量與內積、指對數方程、矩陣轉移 · 核心考題與避坑詳解
              </p>
            </div>
            <MathModule onAddErrorItem={handleAddErrorItem} />
          </div>
        )}

        {currentTab === 'english' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                高二英文 · 7000字與學測考題詳解
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                學測克漏字、文意選填、篇章結構、倒裝句與分詞構句 · 考題實戰與考點詳解
              </p>
            </div>
            <EnglishModule onAddErrorItem={handleAddErrorItem} />
          </div>
        )}

        {currentTab === 'plan' && <StudyPlanModule />}
      </main>

      {/* Global Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Error Book Modal */}
      <ErrorBookModal
        isOpen={isErrorBookOpen}
        onClose={() => setIsErrorBookOpen(false)}
        items={errorBookItems}
        onToggleMastered={handleToggleMastered}
        onDeleteItem={handleDeleteErrorItem}
        onUpdateNote={handleUpdateErrorNote}
      />

      {/* Footer conforming strictly to anti-slop rules */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-display">
            <span className="font-bold text-slate-900 dark:text-white">智學三絕</span>
            <span aria-hidden="true">·</span>
            <span>語數英高效提分學院</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('mastery')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors font-semibold text-indigo-600 dark:text-indigo-400"
            >
              智學三絕
            </button>
            <button
              onClick={() => setCurrentTab('chinese')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              國文名篇
            </button>
            <button
              onClick={() => setCurrentTab('math')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              數理實驗
            </button>
            <button
              onClick={() => setCurrentTab('english')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              英文搭配詞
            </button>
            <button
              onClick={() => setIsErrorBookOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              錯題管理
            </button>
          </div>

          <div>專注思維本質與考點突破 · 助你大考無往不利</div>
        </div>
      </footer>
    </div>
  );
}
