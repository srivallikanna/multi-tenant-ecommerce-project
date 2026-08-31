import React, { useState } from "react";

export default function CategoryBreakdownChart({
  title = "Category Sales Share",
  subtitle = "Performance distribution across departments",
}) {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { name: "Electronics & Audio", share: 38, revenue: 5643, color: "from-indigo-600 to-indigo-400", hex: "#4f46e5", icon: "🎧" },
    { name: "Luxury Watches", share: 24, revenue: 3564, color: "from-amber-500 to-amber-300", hex: "#f59e0b", icon: "⌚" },
    { name: "Tech & Accessories", share: 18, revenue: 2673, color: "from-cyan-500 to-cyan-300", hex: "#06b6d4", icon: "💻" },
    { name: "Streetwear & Fashion", share: 12, revenue: 1782, color: "from-emerald-500 to-emerald-300", hex: "#10b981", icon: "👕" },
    { name: "Fitness & Living", share: 8, revenue: 1188, color: "from-pink-500 to-rose-400", hex: "#ec4899", icon: "👟" },
  ];

  const totalRevenue = categories.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-slate-900 text-base">{title}</h3>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            ${totalRevenue.toLocaleString()} Total
          </span>
        </div>

        {/* Multi-Segment Color Distribution Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5 mb-6 border border-slate-200/60 shadow-inner">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              style={{ width: `${cat.share}%` }}
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`h-full rounded-full bg-gradient-to-r ${cat.color} cursor-pointer transition-all duration-200 hover:brightness-115 hover:scale-y-110`}
              title={`${cat.name}: ${cat.share}% ($${cat.revenue})`}
            />
          ))}
        </div>

        {/* Categories Progress List */}
        <div className="space-y-3.5">
          {categories.map((cat, idx) => {
            const isHovered = activeCategory?.name === cat.name;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveCategory(cat)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer border ${
                  isHovered
                    ? "bg-slate-50 border-indigo-200 shadow-xs"
                    : "bg-transparent border-transparent hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="font-bold text-slate-900">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-black">
                    <span className="text-slate-900">${cat.revenue.toLocaleString()}</span>
                    <span className="text-slate-400 font-normal">({cat.share}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.share}%` }}
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-300`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-4 text-center">
        <span className="text-[11px] font-semibold text-slate-400">
          💡 Click or hover any segment to inspect sales share
        </span>
      </div>
    </div>
  );
}
