import React, { useState } from 'react';
import { ErrorBookItem } from '../types';
import { BookX, CheckCircle, Trash2, X, Filter, CheckCircle2, BookmarkCheck } from 'lucide-react';

interface ErrorBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ErrorBookItem[];
  onToggleMastered: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}

export const ErrorBookModal: React.FC<ErrorBookModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleMastered,
  onDeleteItem,
  onUpdateNote,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isOpen) return null;

  const filteredItems = items.filter((item) => {
    const matchSub = filterSubject === 'all' || item.subject === filterSubject;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unmastered' && !item.mastered) ||
      (filterStatus === 'mastered' && item.mastered);
    return matchSub && matchStatus;
  });

  const subjectLabels: Record<string, string> = {
    chinese: '國文',
    math: '數學',
    english: '英文',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <BookX className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                個人專屬錯題本
                <span className="text-xs font-normal text-slate-500 font-mono tabular-nums">
                  ({items.length} 題收錄)
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                提分秘訣：考前只看錯題，徹底根除失分盲點與計算地雷
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">學科：</span>
            {['all', 'chinese', 'math', 'english'].map((sub) => (
              <button
                key={sub}
                onClick={() => setFilterSubject(sub)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterSubject === sub
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub === 'all' ? '全部' : subjectLabels[sub]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">狀態：</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2 py-0.5 rounded ${
                filterStatus === 'all'
                  ? 'bg-slate-200 dark:bg-slate-700 font-bold text-slate-900 dark:text-white'
                  : 'text-slate-500'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterStatus('unmastered')}
              className={`px-2 py-0.5 rounded ${
                filterStatus === 'unmastered'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold'
                  : 'text-slate-500'
              }`}
            >
              待攻克
            </button>
            <button
              onClick={() => setFilterStatus('mastered')}
              className={`px-2 py-0.5 rounded ${
                filterStatus === 'mastered'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                  : 'text-slate-500'
              }`}
            >
              已掌握
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <BookmarkCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">錯題本目前空空如也！</p>
              <p className="text-xs mt-1">在國文、數學、英文單元中，點擊「收錄錯題本」即可隨時記錄</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                  item.mastered
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-75'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      [{subjectLabels[item.subject]}] {item.topic}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      失分歸因：{item.reason}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleMastered(item.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        item.mastered
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.mastered ? '已標記掌握' : '標記為已掌握'}
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="刪除此題"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-medium text-slate-900 dark:text-white leading-relaxed font-mono">
                  {item.question}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300">
                    <span className="font-semibold">原先錯誤答案：</span> {item.wrongAnswer}
                  </div>
                  <div className="p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300">
                    <span className="font-semibold">正確解析答案：</span> {item.correctAnswer}
                  </div>
                </div>

                {/* Personal Note */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 shrink-0">避坑筆記：</span>
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => onUpdateNote(item.id, e.target.value)}
                    placeholder="寫下給自己的提醒..."
                    className="flex-1 text-[11px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
