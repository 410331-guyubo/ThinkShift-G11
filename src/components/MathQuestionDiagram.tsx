import React from 'react';

interface MathQuestionDiagramProps {
  questionId: string;
}

export const MathQuestionDiagram: React.FC<MathQuestionDiagramProps> = ({ questionId }) => {
  switch (questionId) {
    // ----------------------------------------------------
    // Q1: ma-g11-01 (三角形邊長與外接圓)
    // ----------------------------------------------------
    case 'ma-g11-01':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📐 題意幾何例圖：△ABC 三邊邊長與外接圓 R</span>
          </div>
          <svg viewBox="0 0 320 200" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* Circumscribed circle */}
            <circle cx="160" cy="100" r="85" fill="none" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
            <circle cx="160" cy="100" r="3" fill="#0284c7" />
            <text x="165" y="96" fill="#0284c7" fontSize="11" fontWeight="bold">外心 O</text>
            <line x1="160" y1="100" x2="235" y2="60" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="200" y="75" fill="#0284c7" fontSize="11" fontWeight="bold">R</text>

            {/* Triangle ABC */}
            <polygon points="120,25 90,165 240,150" fill="rgba(14, 165, 233, 0.1)" stroke="#0369a1" strokeWidth="2.5" />

            {/* Vertices */}
            <circle cx="120" cy="25" r="4" fill="#0369a1" />
            <text x="115" y="16" fill="#0f172a" className="dark:fill-white font-bold" fontSize="12">A</text>

            <circle cx="90" cy="165" r="4" fill="#0369a1" />
            <text x="75" y="175" fill="#0f172a" className="dark:fill-white font-bold" fontSize="12">B</text>

            <circle cx="240" cy="150" r="4" fill="#0369a1" />
            <text x="250" y="155" fill="#0f172a" className="dark:fill-white font-bold" fontSize="12">C</text>

            {/* Side Lengths */}
            <text x="175" y="170" fill="#dc2626" fontSize="11" fontWeight="bold">a = 5 (BC邊)</text>
            <text x="195" y="80" fill="#d97706" fontSize="11" fontWeight="bold">b = 7 (AC邊)</text>
            <text x="75" y="90" fill="#2563eb" fontSize="11" fontWeight="bold">c = 8 (AB邊)</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q2: ma-g11-02 (三角函數疊合與區間極值)
    // ----------------------------------------------------
    case 'ma-g11-02':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📈 函數圖形例圖：f(x) = 2·sin(x - π/6) + 2 在 [0, π] 之極值</span>
          </div>
          <svg viewBox="0 0 340 180" className="w-full max-w-[300px] h-auto overflow-visible">
            {/* Coordinate Axes */}
            <line x1="30" y1="150" x2="310" y2="150" stroke="#64748b" strokeWidth="1.5" />
            <line x1="50" y1="170" x2="50" y2="20" stroke="#64748b" strokeWidth="1.5" />
            <text x="315" y="153" fill="#64748b" fontSize="10">x</text>
            <text x="45" y="16" fill="#64748b" fontSize="10">y</text>

            {/* Reference horizontal guide lines */}
            <line x1="50" y1="40" x2="280" y2="40" stroke="#cbd5e1" strokeDasharray="3 3" />
            <text x="25" y="44" fill="#0284c7" fontSize="10" fontWeight="bold">y = 4</text>
            <line x1="50" y1="120" x2="280" y2="120" stroke="#cbd5e1" strokeDasharray="3 3" />
            <text x="25" y="124" fill="#e11d48" fontSize="10" fontWeight="bold">y = 1</text>

            {/* Curve in [0, pi] */}
            {/* x=0 -> y=1, x=2pi/3 -> y=4, x=pi -> y=3 */}
            <path
              d="M 50,120 Q 140,20 180,40 T 270,70"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
            />

            {/* Peak Max Point */}
            <circle cx="170" cy="40" r="4.5" fill="#0284c7" />
            <text x="145" y="30" fill="#0284c7" fontSize="10" fontWeight="bold">極大值 M = 4</text>

            {/* Min Endpoint */}
            <circle cx="50" cy="120" r="4.5" fill="#e11d48" />
            <text x="60" y="135" fill="#e11d48" fontSize="10" fontWeight="bold">極小值 m = 1 (x = 0)</text>

            {/* x axis ticks */}
            <text x="45" y="165" fill="#64748b" fontSize="10">0</text>
            <text x="160" y="165" fill="#64748b" fontSize="10">2π/3</text>
            <text x="265" y="165" fill="#64748b" fontSize="10">π</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q3: ma-g11-03 (平面向量正射影)
    // ----------------------------------------------------
    case 'ma-g11-03':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📐 幾何向量例圖：向量 u 在向量 v 上之正射影向量</span>
          </div>
          <svg viewBox="0 0 320 190" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* Coordinate axes */}
            <line x1="30" y1="160" x2="290" y2="160" stroke="#94a3b8" strokeWidth="1" />
            <line x1="50" y1="175" x2="50" y2="20" stroke="#94a3b8" strokeWidth="1" />

            {/* Vector v extended direction */}
            <line x1="50" y1="160" x2="270" y2="50" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Vector v = (1, 2) scaled */}
            <line x1="50" y1="160" x2="110" y2="130" stroke="#64748b" strokeWidth="2.5" markerEnd="url(#arrow-slate)" />
            <text x="115" y="138" fill="#64748b" fontSize="11" fontWeight="bold">v=(1, 2)</text>

            {/* Vector u = (3, 4) */}
            <line x1="50" y1="160" x2="200" y2="40" stroke="#2563eb" strokeWidth="3" />
            <polygon points="200,40 188,48 193,56" fill="#2563eb" />
            <text x="205" y="38" fill="#2563eb" fontSize="12" fontWeight="bold">u = (3, 4)</text>

            {/* Projection vector proj */}
            <line x1="50" y1="160" x2="182" y2="94" stroke="#059669" strokeWidth="4" />
            <polygon points="182,94 172,100 174,108" fill="#059669" />
            <text x="100" y="98" fill="#059669" fontSize="11" fontWeight="bold">正射影 (11/5, 22/5)</text>

            {/* Perpendicular drop line */}
            <line x1="200" y1="40" x2="182" y2="94" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="176" y="86" width="7" height="7" fill="none" stroke="#e11d48" strokeWidth="1" transform="rotate(-27, 182, 94)" />
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q4: ma-g11-04 (圓方程式與柯西不等式切線)
    // ----------------------------------------------------
    case 'ma-g11-04':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>⭕ 幾何切線例圖：圓 x² + y² = 5 與切線 2x + y = 5</span>
          </div>
          <svg viewBox="0 0 300 200" className="w-full max-w-[260px] h-auto overflow-visible">
            {/* Coordinate Axes */}
            <line x1="30" y1="100" x2="270" y2="100" stroke="#94a3b8" strokeWidth="1" />
            <line x1="150" y1="180" x2="150" y2="20" stroke="#94a3b8" strokeWidth="1" />
            <text x="275" y="103" fill="#64748b" fontSize="10">x</text>
            <text x="145" y="15" fill="#64748b" fontSize="10">y</text>

            {/* Circle x^2 + y^2 = 5 (r = sqrt(5) ≈ 2.23) */}
            <circle cx="150" cy="100" r="55" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="2" />
            <text x="110" y="130" fill="#3b82f6" fontSize="11" fontWeight="bold">x² + y² = 5</text>

            {/* Tangent line 2x + y = 5 at (2, 1) */}
            <line x1="90" y1="20" x2="240" y2="170" stroke="#dc2626" strokeWidth="2.5" />
            <text x="190" y="50" fill="#dc2626" fontSize="11" fontWeight="bold">2x + y = 5 (最大值)</text>

            {/* Tangency Point (2, 1) */}
            <circle cx="200" cy="75" r="4" fill="#dc2626" />
            <text x="206" y="80" fill="#dc2626" fontSize="10" fontWeight="bold">切點 (2, 1)</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q5: ma-g11-05 (兩向量互相垂直 90 度)
    // ----------------------------------------------------
    case 'ma-g11-05':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📐 坐標幾何例圖：向量 a ⊥ 向量 b (夾角 90°，內積為 0)</span>
          </div>
          <svg viewBox="0 0 300 180" className="w-full max-w-[260px] h-auto overflow-visible">
            {/* Grid & Axes */}
            <line x1="20" y1="100" x2="280" y2="100" stroke="#94a3b8" strokeWidth="1" />
            <line x1="100" y1="170" x2="100" y2="15" stroke="#94a3b8" strokeWidth="1" />

            {/* Vector a = (1.5, 3) */}
            <line x1="100" y1="100" x2="145" y2="25" stroke="#2563eb" strokeWidth="3" />
            <text x="150" y="30" fill="#2563eb" fontSize="11" fontWeight="bold">a = (k, 3)</text>

            {/* Vector b = (4, -2) */}
            <line x1="100" y1="100" x2="220" y2="150" stroke="#059669" strokeWidth="3" />
            <text x="225" y="155" fill="#059669" fontSize="11" fontWeight="bold">b = (4, -2)</text>

            {/* Right Angle Symbol */}
            <path d="M 112,80 L 126,88 L 114,107" fill="none" stroke="#dc2626" strokeWidth="1.5" />
            <text x="125" y="78" fill="#dc2626" fontSize="10" fontWeight="bold">90°</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q6: ma-g11-06 (三角形正弦面積公式)
    // ----------------------------------------------------
    case 'ma-g11-06':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📐 三角形面積例圖：兩邊與夾角 30°</span>
          </div>
          <svg viewBox="0 0 320 180" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* Triangle with base c = 10, side b = 6 at 30 deg */}
            <polygon points="50,140 260,140 170,45" fill="rgba(16, 185, 129, 0.12)" stroke="#059669" strokeWidth="2.5" />

            {/* Vertices */}
            <circle cx="50" cy="140" r="3.5" fill="#059669" />
            <text x="35" y="145" fill="#0f172a" className="dark:fill-white font-bold" fontSize="12">A</text>

            <circle cx="260" cy="140" r="3.5" fill="#059669" />
            <text x="270" y="145" fill="#0f172a" className="dark:fill-white font-bold" fontSize="12">B</text>

            <circle cx="170" cy="45" r="3.5" fill="#059669" />
            <text x="170" y="35" fill="#0f172a" className="dark:fill-white font-bold" fontSize="12">C</text>

            {/* Dimensions */}
            <text x="140" y="158" fill="#2563eb" fontSize="11" fontWeight="bold">c = 10 (AB)</text>
            <text x="90" y="85" fill="#d97706" fontSize="11" fontWeight="bold">b = 6 (AC)</text>

            {/* Angle A Arc */}
            <path d="M 85,140 A 35 35 0 0 0 76,115" fill="none" stroke="#dc2626" strokeWidth="2" />
            <text x="90" y="132" fill="#dc2626" fontSize="11" fontWeight="bold">30°</text>

            {/* Area indicator */}
            <text x="175" y="105" fill="#059669" fontSize="11" fontWeight="bold">面積 = 1/2 · b · c · sin 30°</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q7: ma-g11-07 (廣義角與四象限參考角)
    // ----------------------------------------------------
    case 'ma-g11-07':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>⭕ 單位圓象限例圖：150° (II象限)、240° (III象限)、315° (IV象限)</span>
          </div>
          <svg viewBox="0 0 300 200" className="w-full max-w-[260px] h-auto overflow-visible">
            {/* Unit circle */}
            <circle cx="150" cy="100" r="70" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="40" y1="100" x2="260" y2="100" stroke="#94a3b8" strokeWidth="1" />
            <line x1="150" y1="175" x2="150" y2="25" stroke="#94a3b8" strokeWidth="1" />

            {/* 150 deg (Q2) */}
            <line x1="150" y1="100" x2="90" y2="65" stroke="#2563eb" strokeWidth="2" />
            <circle cx="90" cy="65" r="3.5" fill="#2563eb" />
            <text x="50" y="60" fill="#2563eb" fontSize="10" fontWeight="bold">150° (+1/2)</text>

            {/* 240 deg (Q3) */}
            <line x1="150" y1="100" x2="115" y2="160" stroke="#d97706" strokeWidth="2" />
            <circle cx="115" cy="160" r="3.5" fill="#d97706" />
            <text x="65" y="175" fill="#d97706" fontSize="10" fontWeight="bold">240° (-1/2)</text>

            {/* 315 deg (Q4) */}
            <line x1="150" y1="100" x2="200" y2="150" stroke="#dc2626" strokeWidth="2" />
            <circle cx="200" cy="150" r="3.5" fill="#dc2626" />
            <text x="205" y="160" fill="#dc2626" fontSize="10" fontWeight="bold">315° (-1)</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q8: ma-g11-08 (對數運算性質)
    // ----------------------------------------------------
    case 'ma-g11-08':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>🔢 對數化簡運算流程例圖</span>
          </div>
          <svg viewBox="0 0 340 100" className="w-full max-w-[300px] h-auto overflow-visible">
            {/* Box 1 */}
            <rect x="10" y="25" width="120" height="50" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="20" y="47" fill="#1e40af" fontSize="11" fontWeight="bold">log₂ 12 - log₂ 3</text>
            <text x="35" y="63" fill="#3b82f6" fontSize="10">= log₂(12/3) = 2</text>

            <text x="145" y="55" fill="#0f172a" className="dark:fill-white font-bold" fontSize="16">+</text>

            {/* Box 2 */}
            <rect x="170" y="25" width="100" height="50" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <text x="185" y="47" fill="#065f46" fontSize="11" fontWeight="bold">log₃ 9</text>
            <text x="195" y="63" fill="#10b981" fontSize="10">= log₃(3²) = 2</text>

            <text x="282" y="55" fill="#0f172a" className="dark:fill-white font-bold" fontSize="16">=</text>
            <text x="305" y="58" fill="#e11d48" fontSize="20" fontWeight="bold">4</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q9: ma-g11-09 (常用對數首數與位數估計)
    // ----------------------------------------------------
    case 'ma-g11-09':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📊 常用對數首數與位數對應關係</span>
          </div>
          <svg viewBox="0 0 340 100" className="w-full max-w-[300px] h-auto overflow-visible">
            <rect x="20" y="15" width="300" height="70" rx="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="35" y="40" fill="#92400e" fontSize="11" fontWeight="bold">log₁₀(2⁵⁰) = 50 · log₁₀(2) ≈ 15.05</text>
            <text x="35" y="60" fill="#b45309" fontSize="11">首數 n = 15 (整數部分) ， 尾數 α = 0.05</text>
            <text x="35" y="76" fill="#dc2626" fontSize="11" fontWeight="bold">➤ 總位數 = 首數 + 1 = 15 + 1 = 16 位整數</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q10: ma-g11-10 (換元法解指數方程式)
    // ----------------------------------------------------
    case 'ma-g11-10':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📈 換元法模型：令 t = 2ˣ (t &gt; 0) 之拋物線根檢驗</span>
          </div>
          <svg viewBox="0 0 320 140" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* Axis */}
            <line x1="30" y1="100" x2="290" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="295" y="103" fill="#64748b" fontSize="10">t</text>
            <line x1="120" y1="130" x2="120" y2="15" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="115" y="10" fill="#64748b" fontSize="10">y</text>

            {/* Parabola y = t^2 - 3t - 4 = (t-4)(t+1) */}
            <path d="M 50,20 Q 150,150 250,20" fill="none" stroke="#2563eb" strokeWidth="2.5" />

            {/* Negative root t = -1 (Invalid) */}
            <circle cx="85" cy="100" r="4" fill="#e11d48" />
            <text x="50" y="120" fill="#e11d48" fontSize="10" fontWeight="bold">t = -1 (不合, 2ˣ&gt;0)</text>

            {/* Positive root t = 4 (Valid) */}
            <circle cx="215" cy="100" r="4" fill="#059669" />
            <text x="210" y="120" fill="#059669" fontSize="10" fontWeight="bold">t = 4 ⇒ x = 2 (合)</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q11: ma-g11-11 (向量張成平行四邊形面積)
    // ----------------------------------------------------
    case 'ma-g11-11':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📐 二階行列式幾何例圖：兩向量張成平行四邊形</span>
          </div>
          <svg viewBox="0 0 320 180" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* Grid */}
            <line x1="30" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="1" />
            <line x1="50" y1="170" x2="50" y2="20" stroke="#94a3b8" strokeWidth="1" />

            {/* Parallelogram vertices: O(50, 150), u(190, 130), v(120, 40), u+v(260, 20) */}
            <polygon
              points="50,150 190,130 260,20 120,40"
              fill="rgba(99, 102, 241, 0.15)"
              stroke="#6366f1"
              strokeWidth="2.5"
            />

            {/* Vector u = (4, 1) */}
            <line x1="50" y1="150" x2="190" y2="130" stroke="#3b82f6" strokeWidth="3" />
            <text x="140" y="148" fill="#3b82f6" fontSize="11" fontWeight="bold">u = (4, 1)</text>

            {/* Vector v = (2, 5) */}
            <line x1="50" y1="150" x2="120" y2="40" stroke="#10b981" strokeWidth="3" />
            <text x="60" y="80" fill="#10b981" fontSize="11" fontWeight="bold">v = (2, 5)</text>

            {/* Area value */}
            <text x="150" y="85" fill="#4338ca" fontSize="12" fontWeight="bold">面積 = |det| = 18</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q12: ma-g11-12 (二階反方陣求法)
    // ----------------------------------------------------
    case 'ma-g11-12':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>🔢 二階反矩陣變形公式對照例圖</span>
          </div>
          <svg viewBox="0 0 320 90" className="w-full max-w-[280px] h-auto overflow-visible">
            <rect x="10" y="15" width="300" height="60" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
            <text x="25" y="38" fill="#0f172a" fontSize="11" fontWeight="bold">
              det(A) = 3·2 - 2·1 = 4 ≠ 0
            </text>
            <text x="25" y="60" fill="#0284c7" fontSize="11" fontWeight="bold">
              A⁻¹ = (1/4) · [ [2, -2], [-1, 3] ] （主對角互換，副對角變號）
            </text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q13: ma-g11-13 (馬可夫鏈狀態轉移圖)
    // ----------------------------------------------------
    case 'ma-g11-13':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>🔄 馬可夫鏈狀態轉移圖：晴天 ⇄ 雨天</span>
          </div>
          <svg viewBox="0 0 320 160" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* State Sunny */}
            <circle cx="80" cy="80" r="32" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="65" y="85" fill="#b45309" fontSize="13" fontWeight="bold">晴天</text>

            {/* Self loop Sunny -> Sunny */}
            <path d="M 60,55 C 30,20 100,10 95,50" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="50" y="25" fill="#b45309" fontSize="11" fontWeight="bold">0.8</text>

            {/* State Rainy */}
            <circle cx="240" cy="80" r="32" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
            <text x="225" y="85" fill="#0369a1" fontSize="13" fontWeight="bold">雨天</text>

            {/* Self loop Rainy -> Rainy */}
            <path d="M 220,55 C 220,15 285,15 255,50" fill="none" stroke="#0284c7" strokeWidth="2" />
            <text x="250" y="25" fill="#0369a1" fontSize="11" fontWeight="bold">0.7</text>

            {/* Sunny -> Rainy (0.2) */}
            <path d="M 112,70 Q 160,50 208,70" fill="none" stroke="#64748b" strokeWidth="1.8" />
            <text x="150" y="55" fill="#475569" fontSize="10" fontWeight="bold">0.2</text>

            {/* Rainy -> Sunny (0.3) */}
            <path d="M 208,90 Q 160,110 112,90" fill="none" stroke="#64748b" strokeWidth="1.8" />
            <text x="150" y="112" fill="#475569" fontSize="10" fontWeight="bold">0.3</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q14: ma-g11-14 (空間向量外積與公垂向量)
    // ----------------------------------------------------
    case 'ma-g11-14':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📐 空間向量立體例圖：兩向量 a, b 之法向量 (外積 a × b)</span>
          </div>
          <svg viewBox="0 0 320 180" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* Plane spanned by a and b */}
            <polygon points="60,120 180,150 270,110 150,80" fill="rgba(226, 232, 240, 0.6)" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Vector a = (1, 2, 2) in plane */}
            <line x1="150" y1="115" x2="230" y2="105" stroke="#2563eb" strokeWidth="3" />
            <text x="235" y="110" fill="#2563eb" fontSize="11" fontWeight="bold">a = (1, 2, 2)</text>

            {/* Vector b = (2, 1, 0) in plane */}
            <line x1="150" y1="115" x2="100" y2="135" stroke="#059669" strokeWidth="3" />
            <text x="65" y="150" fill="#059669" fontSize="11" fontWeight="bold">b = (2, 1, 0)</text>

            {/* Normal vector pointing UP */}
            <line x1="150" y1="115" x2="150" y2="30" stroke="#dc2626" strokeWidth="3" />
            <polygon points="150,22 144,35 156,35" fill="#dc2626" />
            <text x="160" y="35" fill="#dc2626" fontSize="11" fontWeight="bold">+n = (-2, 4, -3)</text>

            {/* Normal vector pointing DOWN (±) */}
            <line x1="150" y1="115" x2="150" y2="175" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" />
            <text x="160" y="175" fill="#dc2626" fontSize="10">-n (反向單位向量)</text>
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // Q15: ma-g11-15 (和角公式與正切乘積)
    // ----------------------------------------------------
    case 'ma-g11-15':
      return (
        <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <span>📐 正切和角例圖：α + β = 45° 幾何代數模型</span>
          </div>
          <svg viewBox="0 0 320 160" className="w-full max-w-[280px] h-auto overflow-visible">
            {/* 1x1 Square */}
            <rect x="70" y="20" width="120" height="120" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" strokeWidth="2" />
            <line x1="70" y1="140" x2="190" y2="20" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Angle 45 line */}
            <line x1="70" y1="140" x2="190" y2="70" stroke="#0284c7" strokeWidth="2.5" />
            <text x="100" y="125" fill="#0284c7" fontSize="11" fontWeight="bold">α</text>
            <text x="115" y="105" fill="#d97706" fontSize="11" fontWeight="bold">β</text>
            <text x="135" y="115" fill="#e11d48" fontSize="10" fontWeight="bold">(α + β = 45°)</text>

            <text x="205" y="80" fill="#0f172a" className="dark:fill-white font-bold" fontSize="11">
              (1 + tan α)(1 + tan β) = 2
            </text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
