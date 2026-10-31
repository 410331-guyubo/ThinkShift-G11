import React, { useState, useId } from 'react';
import { Compass, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const MathVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parabola' | 'triangle' | 'combinatorics'>('parabola');

  // Parabola State
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-4);
  const [c, setC] = useState<number>(3);
  const [rangeMin, setRangeMin] = useState<number>(0);
  const [rangeMax, setRangeMax] = useState<number>(4);

  // Parabola math calculations
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const discriminant = b * b - 4 * a * c;

  // Values at boundaries
  const yAtMin = a * rangeMin * rangeMin + b * rangeMin + c;
  const yAtMax = a * rangeMax * rangeMax + b * rangeMax + c;

  // Extremum in range [rangeMin, rangeMax]
  const isVertexInRange = vertexX >= rangeMin && vertexX <= rangeMax;
  let minVal: number;
  let maxVal: number;
  let minAt: string;
  let maxAt: string;

  if (a > 0) {
    minVal = isVertexInRange ? vertexY : Math.min(yAtMin, yAtMax);
    minAt = isVertexInRange ? `頂點 x = ${vertexX.toFixed(2)}` : (yAtMin < yAtMax ? `左端點 x = ${rangeMin}` : `右端點 x = ${rangeMax}`);
    maxVal = Math.max(yAtMin, yAtMax);
    maxAt = yAtMin > yAtMax ? `左端點 x = ${rangeMin}` : `右端點 x = ${rangeMax}`;
  } else {
    maxVal = isVertexInRange ? vertexY : Math.max(yAtMin, yAtMax);
    maxAt = isVertexInRange ? `頂點 x = ${vertexX.toFixed(2)}` : (yAtMin > yAtMax ? `左端點 x = ${rangeMin}` : `右端點 x = ${rangeMax}`);
    minVal = Math.min(yAtMin, yAtMax);
    minAt = yAtMin < yAtMax ? `左端點 x = ${rangeMin}` : `右端點 x = ${rangeMax}`;
  }

  // Right Triangle State
  const [angleDeg, setAngleDeg] = useState<number>(36);
  const angleRad = (angleDeg * Math.PI) / 180;
  const hypotenuse = 10;
  const adjacent = hypotenuse * Math.cos(angleRad);
  const opposite = hypotenuse * Math.sin(angleRad);

  // Combinatorics State
  const [nVal, setNVal] = useState<number>(6);
  const [kVal, setKVal] = useState<number>(2);

  const factorial = (num: number): number => {
    if (num <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= num; i++) res *= i;
    return res;
  };

  const pVal = kVal <= nVal ? factorial(nVal) / factorial(nVal - kVal) : 0;
  const cVal = kVal <= nVal ? factorial(nVal) / (factorial(kVal) * factorial(nVal - kVal)) : 0;

  // SVG coordinate transformation for Parabola
  // Center is at (200, 150), scale is 20px per unit
  const toSvgX = (x: number) => 200 + x * 22;
  const toSvgY = (y: number) => 150 - y * 16;

  // Generate smooth path for parabola in x in [-6, 6]
  const pathPoints: string[] = [];
  for (let x = -6; x <= 6; x += 0.2) {
    const y = a * x * x + b * x + c;
    pathPoints.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
  }
  const pathD = `M ${pathPoints.join(' L ')}`;

  const aSliderId = useId();
  const bSliderId = useId();
  const cSliderId = useId();
  const rangeMinId = useId();
  const rangeMaxId = useId();
  const angleId = useId();
  const nValId = useId();
  const kValId = useId();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            幾何與函數直觀模擬器
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            大考最重觀念本質與圖像化思維 · 即時調整參數觀察定理幾何動態
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('parabola')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'parabola'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            二次函數極值
          </button>
          <button
            onClick={() => setActiveTab('triangle')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'triangle'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            三角比與勾股
          </button>
          <button
            onClick={() => setActiveTab('combinatorics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'combinatorics'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            排列組合探析
          </button>
        </div>
      </div>

      {activeTab === 'parabola' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Graph (Left 7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-lg p-4 overflow-hidden flex flex-col items-center relative">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono tabular-nums">
                f(x) = {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
              </span>
              <span className="font-mono text-sky-400">
                對稱軸 x = {vertexX.toFixed(2)}
              </span>
            </div>

            <svg viewBox="0 0 400 300" className="w-full h-64 select-none">
              <defs>
                <pattern id="grid" width="22" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 22 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="#090d16" />
              <rect width="400" height="300" fill="url(#grid)" />

              {/* Axes */}
              <line x1="0" y1="150" x2="400" y2="150" stroke="#334155" strokeWidth="1.5" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="#334155" strokeWidth="1.5" />

              {/* Interval Shading */}
              <rect
                x={toSvgX(rangeMin)}
                y="0"
                width={Math.max(2, toSvgX(rangeMax) - toSvgX(rangeMin))}
                height="300"
                fill="rgba(56, 189, 248, 0.08)"
              />
              <line
                x1={toSvgX(rangeMin)}
                y1="0"
                x2={toSvgX(rangeMin)}
                y2="300"
                stroke="#38bdf8"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <line
                x1={toSvgX(rangeMax)}
                y1="0"
                x2={toSvgX(rangeMax)}
                y2="300"
                stroke="#38bdf8"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />

              {/* Axis of Symmetry */}
              <line
                x1={toSvgX(vertexX)}
                y1="0"
                x2={toSvgX(vertexX)}
                y2="300"
                stroke="#e2e8f0"
                strokeDasharray="2 2"
                strokeWidth="1"
                opacity="0.5"
              />

              {/* Parabola Curve */}
              <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Vertex Point */}
              <circle
                cx={toSvgX(vertexX)}
                cy={toSvgY(vertexY)}
                r="5"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="1.5"
              />

              {/* Interval Boundary Points */}
              <circle cx={toSvgX(rangeMin)} cy={toSvgY(yAtMin)} r="4" fill="#38bdf8" />
              <circle cx={toSvgX(rangeMax)} cy={toSvgY(yAtMax)} r="4" fill="#38bdf8" />
            </svg>

            {/* Interval Key Legend */}
            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                頂點坐標 ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
              </span>
              <span className="flex items-center gap-1.5 text-sky-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-sky-500/30 border border-sky-400 inline-block"></span>
                考察定義域 [{rangeMin}, {rangeMax}]
              </span>
            </div>
          </div>

          {/* Controls & Concept Takeaway (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-800 space-y-3.5">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>參數調節面板</span>
                <span className="text-[11px] text-slate-500">判別式 D = {discriminant}</span>
              </div>

              {/* Slider a */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <label htmlFor={aSliderId}>二次項係數 a (開口與寬窄)</label>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">{a}</span>
                </div>
                <input
                  id={aSliderId}
                  type="range"
                  min="-3"
                  max="3"
                  step="1"
                  value={a}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setA(val === 0 ? 1 : val); // prevent a=0
                  }}
                  className="w-full accent-sky-600"
                />
              </div>

              {/* Slider b */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <label htmlFor={bSliderId}>一次項係數 b (影響對稱軸)</label>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">{b}</span>
                </div>
                <input
                  id={bSliderId}
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={b}
                  onChange={(e) => setB(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-600"
                />
              </div>

              {/* Slider c */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <label htmlFor={cSliderId}>常數項 c (y軸截距)</label>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">{c}</span>
                </div>
                <input
                  id={cSliderId}
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={c}
                  onChange={(e) => setC(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-600"
                />
              </div>

              {/* Range sliders */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <label htmlFor={rangeMinId}>區間左界</label>
                    <span className="font-mono tabular-nums">{rangeMin}</span>
                  </div>
                  <input
                    id={rangeMinId}
                    type="range"
                    min="-5"
                    max={rangeMax - 1}
                    value={rangeMin}
                    onChange={(e) => setRangeMin(parseInt(e.target.value, 10))}
                    className="w-full accent-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <label htmlFor={rangeMaxId}>區間右界</label>
                    <span className="font-mono tabular-nums">{rangeMax}</span>
                  </div>
                  <input
                    id={rangeMaxId}
                    type="range"
                    min={rangeMin + 1}
                    max="5"
                    value={rangeMax}
                    onChange={(e) => setRangeMax(parseInt(e.target.value, 10))}
                    className="w-full accent-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Live Exam Deduction Output */}
            <div className="p-4 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-sky-900 dark:text-sky-300">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                大考破題即時診斷：
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300">
                <p>
                  • 頂點是否在 [{rangeMin}, {rangeMax}] 內？{' '}
                  <span className={`font-semibold ${isVertexInRange ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isVertexInRange ? '在定義域內 (極值由頂點決定)' : '不在定義域內 (極值必發生在端點！)'}
                  </span>
                </p>
                <p>
                  • 區間最大值：<span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{maxVal.toFixed(2)}</span> ({maxAt})
                </p>
                <p>
                  • 區間最小值：<span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{minVal.toFixed(2)}</span> ({minAt})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'triangle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-slate-950 rounded-lg p-6 flex flex-col items-center justify-center min-h-[280px]">
            <svg viewBox="0 0 360 220" className="w-full h-56 select-none">
              {/* Triangle path */}
              <polygon
                points={`40,180 ${40 + adjacent * 22},180 40,${180 - opposite * 22}`}
                fill="rgba(14, 165, 233, 0.15)"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* Right angle marker */}
              <rect
                x="40"
                y={180 - 18}
                width="18"
                height="18"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {/* Angle arc */}
              <path
                d={`M ${40 + adjacent * 22 - 30},180 A 30 30 0 0 0 ${40 + adjacent * 22 - 30 * Math.cos(angleRad)},${180 - 30 * Math.sin(angleRad)}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              {/* Labels */}
              <text x={40 + adjacent * 11} y="200" fill="#94a3b8" fontSize="12" textAnchor="middle" className="font-mono">
                鄰邊 (adjacent) = {adjacent.toFixed(2)}
              </text>
              <text x="20" y={180 - opposite * 11} fill="#94a3b8" fontSize="12" textAnchor="end" className="font-mono">
                對邊 = {opposite.toFixed(2)}
              </text>
              <text
                x={40 + adjacent * 11 + 10}
                y={180 - opposite * 11 - 10}
                fill="#f8fafc"
                fontSize="12"
                textAnchor="middle"
                className="font-mono font-bold"
              >
                斜邊 c = 10
              </text>
              <text
                x={40 + adjacent * 22 - 45}
                y="172"
                fill="#f59e0b"
                fontSize="12"
                className="font-mono font-bold"
              >
                θ = {angleDeg}°
              </text>
            </svg>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                <label htmlFor={angleId}>銳角 θ 旋轉拉桿</label>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 tabular-nums">{angleDeg}°</span>
              </div>
              <input
                id={angleId}
                type="range"
                min="15"
                max="75"
                step="1"
                value={angleDeg}
                onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500">sin θ (對/斜)</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums mt-1">
                  {Math.sin(angleRad).toFixed(3)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500">cos θ (鄰/斜)</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums mt-1">
                  {Math.cos(angleRad).toFixed(3)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500">tan θ (對/鄰)</div>
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums mt-1">
                  {Math.tan(angleRad).toFixed(3)}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">恆等式檢驗：</span> sin²θ + cos²θ = {(Math.sin(angleRad) ** 2 + Math.cos(angleRad) ** 2).toFixed(1)}，勾股定理嚴格成立！
            </div>
          </div>
        </div>
      )}

      {activeTab === 'combinatorics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              排列數 P(n, k) 與 組合數 C(n, k) 根本差異
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              大考排列組合 80% 的錯誤都在於「順序」是否有重複計算。組合就是從排列中消除選出之 k 個元素的內部順序 (<code className="font-mono">÷ k!</code>)。
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500">排列數 P({nVal}, {kVal}) (考慮順序)</div>
                <div className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 my-2 tabular-nums">
                  {pVal}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  = {nVal}! / ({nVal} - {kVal})!
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500">組合數 C({nVal}, {kVal}) (不分順序)</div>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 my-2 tabular-nums">
                  {cVal}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  = P({nVal}, {kVal}) ÷ {kVal}!
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-4 border border-slate-200 dark:border-slate-800 space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <label htmlFor={nValId}>總元素個數 n</label>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">{nVal}</span>
                </div>
                <input
                  id={nValId}
                  type="range"
                  min="2"
                  max="10"
                  value={nVal}
                  onChange={(e) => {
                    const newN = parseInt(e.target.value, 10);
                    setNVal(newN);
                    if (kVal > newN) setKVal(newN);
                  }}
                  className="w-full accent-sky-600"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <label htmlFor={kValId}>選取個數 k</label>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">{kVal}</span>
                </div>
                <input
                  id={kValId}
                  type="range"
                  min="1"
                  max={nVal}
                  value={kVal}
                  onChange={(e) => setKVal(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-sky-800 dark:text-sky-300">破題心法：</span>
              題幹出現「選出委員、分配至相同箱子、抽籤」等無身分次序標籤時，用組合 C；出現「排成一列、指派職位、首日次日」等次序標籤時，用排列 P！
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
