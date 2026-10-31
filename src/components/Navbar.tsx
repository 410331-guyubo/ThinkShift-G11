import React from 'react';
import { SubjectKey } from '../types';
import { BookOpen, Sparkles, Moon, Sun, BookX } from 'lucide-react';

interface NavbarProps {
  currentTab: SubjectKey;
  onTabChange: (tab: SubjectKey) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  errorBookCount: number;
  onOpenErrorBook: () => void;
  onStartSprint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isDark,
  onToggleTheme,
  errorBookCount,
  onOpenErrorBook,
  onStartSprint,
}) => {
  const navItems: { key: SubjectKey; label: string }[] = [
    { key: 'dashboard', label: '提分儀表板' },
    { key: 'chinese', label: '高二國文' },
    { key: 'math', label: '高二數學' },
    { key: 'english', label: '高二英文' },
    { key: 'plan', label: '提分作戰圖' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onTabChange('dashboard')}
          className="text-left group flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
            智
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 font-display">
            智學三絕
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links (Single line) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold border-slate-900 dark:border-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Icons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenErrorBook}
            title="查看錯題本"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="查看錯題本"
          >
            <BookX className="w-4 h-4" />
            {errorBookCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {errorBookCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            title={isDark ? '切換淺色模式' : '切換深色模式'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="切換主題"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onStartSprint}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            每日三科衝刺
          </button>
        </div>
      </div>

      {/* Mobile Secondary Sub-nav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-2 px-3 overflow-x-auto text-xs bg-slate-50/50 dark:bg-slate-900/50">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
              currentTab === item.key
                ? 'font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
