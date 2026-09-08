import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function EnhancedRevenueChart({
  title = "Revenue & Sales Chart",
  subtitle = "Store sales and order performance summary",
  initialMetric = "revenue", // 'revenue' | 'orders' | 'aov'
  colorScheme = "indigo", // 'indigo' | 'emerald' | 'purple'
}) {
  const [timeframe, setTimeframe] = useState("7d");
const [activeMetric, setActiveMetric] = useState(initialMetric);
const [chartType, setChartType] = useState("area");
const [hoveredPoint, setHoveredPoint] = useState(null);

const [chartData, setChartData] = useState([]);
const [loading, setLoading] = useState(true);
const [percentageChange, setPercentageChange] = useState(0);
const [conversionRate, setConversionRate] = useState(0);
useEffect(() => {
  const fetchRevenueData = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/admin/revenue?timeframe=${timeframe}`
      );

      if (response.data.success) {
        setChartData(response.data.data);
        setPercentageChange(response.data.percentageChange);
      }
    } catch (error) {
      console.error("Revenue analytics error:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  fetchRevenueData();
}, [timeframe]);

  // Timeframe Data Sets
  const currentData = chartData;
  // Compute key stats dynamically
  const values = currentData.length
  ? currentData.map((d) => d[activeMetric])
  : [0];
  const maxValue = Math.max(...values, 1);
  const totalVolume = values.reduce((sum, v) => sum + v, 0);
  const avgValue = (totalVolume / values.length).toFixed(1);

  // Peak index
  const peakIndex = values.indexOf(Math.max(...values));
  const peakItem = currentData[peakIndex];

  // Colors config
  const theme = {
    indigo: {
      gradientStart: "#6366f1",
      gradientEnd: "#a855f7",
      fillStart: "#4f46e5",
      stroke: "#4f46e5",
      accentBg: "bg-indigo-50",
      accentText: "text-indigo-600",
      accentBorder: "border-indigo-200",
      pillActive: "bg-indigo-600 text-white",
    },
    emerald: {
      gradientStart: "#10b981",
      gradientEnd: "#06b6d4",
      fillStart: "#059669",
      stroke: "#059669",
      accentBg: "bg-emerald-50",
      accentText: "text-emerald-600",
      accentBorder: "border-emerald-200",
      pillActive: "bg-emerald-600 text-white",
    },
    purple: {
      gradientStart: "#8b5cf6",
      gradientEnd: "#ec4899",
      fillStart: "#7c3aed",
      stroke: "#7c3aed",
      accentBg: "bg-purple-50",
      accentText: "text-purple-600",
      accentBorder: "border-purple-200",
      pillActive: "bg-purple-600 text-white",
    },
  }[colorScheme] || {
    gradientStart: "#6366f1",
    gradientEnd: "#a855f7",
    fillStart: "#4f46e5",
    stroke: "#4f46e5",
    accentBg: "bg-indigo-50",
    accentText: "text-indigo-600",
    accentBorder: "border-indigo-200",
    pillActive: "bg-indigo-600 text-white",
  };

  // Generate SVG coordinates for Area Chart
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 30;
  const paddingY = 25;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const points = currentData.map((d, i) => {
    const x = paddingX + (i / (currentData.length - 1 || 1)) * chartW;
    const normalizedY = (d[activeMetric] / (maxValue * 1.15)) * chartH;
    const y = svgHeight - paddingY - normalizedY;
    return { x, y, data: d, val: d[activeMetric] };
  });

  // Construct smooth bezier curve path
  const curvePath = points.reduce((path, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${path} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = `${curvePath} L ${points[points.length - 1]?.x || 0} ${
    svgHeight - paddingY
  } L ${points[0]?.x || 0} ${svgHeight - paddingY} Z`;

  const formatMetricValue = (val) => {
    if (activeMetric === "revenue" || activeMetric === "aov") {
      return `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${Number(val).toLocaleString()} orders`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:border-slate-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
              {title}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange}% vs last period
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
        </div>

        {/* Metric & Timeframe Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveMetric("revenue")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeMetric === "revenue" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setActiveMetric("orders")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeMetric === "orders" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Orders (Qty)
            </button>
            <button
              onClick={() => setActiveMetric("aov")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeMetric === "aov" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Avg Order Value
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {["24h", "7d", "30d", "90d", "1y"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  timeframe === tf ? "bg-indigo-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              title="Area Curve View"
              onClick={() => setChartType("area")}
              className={`p-1.5 rounded-lg text-xs transition ${
                chartType === "area" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-800"
              }`}
            >
              📈
            </button>
            <button
              title="Bar Chart View"
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded-lg text-xs transition ${
                chartType === "bar" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-800"
              }`}
            >
              📊
            </button>
          </div>
        </div>
      </div>

      {/* Summary Highlight Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total {activeMetric.toUpperCase()}
          </span>
          <span className="text-base font-black text-slate-900 mt-0.5 block">
            {formatMetricValue(totalVolume)}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Period Average
          </span>
          <span className="text-base font-black text-slate-900 mt-0.5 block">
            {formatMetricValue(avgValue)}
          </span>
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
            🏆 Peak Interval
          </span>
          <span className="text-base font-black text-amber-900 mt-0.5 block truncate">
            {peakItem?.label}: {formatMetricValue(peakItem ? peakItem[activeMetric] : 0)}
          </span>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Conversion Rate
          </span>
          <span className="text-base font-black text-emerald-900 mt-0.5 block">
            {conversionRate}%<span className="text-[10px] font-semibold text-emerald-600">(Healthy)</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Chart Canvas */}
      <div className="relative w-full overflow-hidden pt-2">
        {/* Floating Tooltip if Hovered */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white px-3.5 py-2 rounded-2xl shadow-2xl border border-slate-700 text-xs transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(hoveredPoint.index / (currentData.length - 1 || 1)) * 100}%`,
              top: "10%",
            }}
          >
            <div className="font-bold text-[11px] text-slate-300 mb-0.5">
              {hoveredPoint.data.fullDate || hoveredPoint.data.label}
            </div>
            <div className="text-sm font-black text-emerald-400">
              {activeMetric === "revenue"
                ? `$${hoveredPoint.data.revenue.toLocaleString()}`
                : activeMetric === "orders"
                ? `${hoveredPoint.data.orders} Orders`
                : `$${hoveredPoint.data.aov} Avg Value`}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Rev: ${hoveredPoint.data.revenue}</span>
              <span>•</span>
              <span>Orders: {hoveredPoint.data.orders}</span>
            </div>
          </div>
        )}

        {/* 1. AREA CURVE CHART */}
        {chartType === "area" ? (
          <div className="relative h-52 sm:h-56 w-full">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.gradientStart} stopOpacity="0.35" />
                  <stop offset="70%" stopColor={theme.gradientEnd} stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={theme.gradientStart} />
                  <stop offset="100%" stopColor={theme.gradientEnd} />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Guidelines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1={paddingX} y1={paddingY + chartH * 0.33} x2={svgWidth - paddingX} y2={paddingY + chartH * 0.33} stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1={paddingX} y1={paddingY + chartH * 0.66} x2={svgWidth - paddingX} y2={paddingY + chartH * 0.66} stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Shaded Area Fill */}
              <path d={areaPath} fill="url(#areaGradient)" />

              {/* Smooth Spline Stroke */}
              <path
                d={curvePath}
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Dots & Hover Guides */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPoint?.index === idx;
                const isPeak = idx === peakIndex;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ ...pt, index: idx })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Vertical guideline on hover */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={paddingY}
                        x2={pt.x}
                        y2={svgHeight - paddingY}
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Outer pulse circle for peak */}
                    {isPeak && !isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="#f59e0b"
                        fillOpacity="0.2"
                        className="animate-ping"
                      />
                    )}

                    {/* Inner core circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "7" : isPeak ? "5.5" : "4.5"}
                      className={`transition-all duration-200 ${
                        isPeak
                          ? "fill-amber-500 stroke-white stroke-[2.5]"
                          : "fill-indigo-600 stroke-white stroke-[2.5]"
                      }`}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* 2. DYNAMIC MODERN BAR CHART */
          <div className="h-52 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 pb-3 pt-6">
            {currentData.map((d, idx) => {
              const val = d[activeMetric];
              const heightPercent = Math.max(12, (val / (maxValue * 1.1)) * 100);
              const isPeak = idx === peakIndex;
              const isHovered = hoveredPoint?.index === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  onMouseEnter={() => setHoveredPoint({ data: d, index: idx })}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <span
                    className={`text-[10px] font-black transition-all ${
                      isHovered || isPeak ? "text-indigo-600 opacity-100 font-bold scale-105" : "opacity-0"
                    }`}
                  >
                    {activeMetric === "revenue" ? `$${val}` : val}
                  </span>

                  <div className="w-full bg-slate-100 rounded-2xl h-40 flex items-end overflow-hidden p-0.5 border border-slate-100 group-hover:border-indigo-200 transition">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-xl transition-all duration-300 ${
                        isPeak
                          ? "bg-gradient-to-t from-amber-500 to-orange-400 group-hover:brightness-110 shadow-sm"
                          : "bg-gradient-to-t from-indigo-600 to-purple-500 group-hover:from-indigo-700 group-hover:to-purple-600 shadow-sm"
                      }`}
                    />
                  </div>

                  <span className={`text-xs font-bold truncate max-w-full ${isHovered ? "text-indigo-600" : "text-slate-500"}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* X-Axis Labels for Area Chart */}
        {chartType === "area" && (
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold pt-3">
            {currentData.map((d, idx) => (
              <span
                key={idx}
                className={`transition-colors ${
                  hoveredPoint?.index === idx ? "text-indigo-600 font-black" : ""
                }`}
              >
                {d.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Legend & Insight Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="font-semibold text-slate-700">Gross Trend</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-semibold text-slate-700">Peak Period Record</span>
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          💡 Hover over chart points or bars to see breakdown details
        </div>
      </div>
    </div>
  );
}
