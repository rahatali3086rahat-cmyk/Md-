import React, { useState } from 'react';
import { LeadTrendPoint } from '../../data/mockAnalytics';

interface LeadChartProps {
  data: LeadTrendPoint[];
}

export const LeadChart: React.FC<LeadChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartData = data && Array.isArray(data) ? data : [];
  const maxVal = Math.max(...chartData.map((d) => d.leads || 0), 10);

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Lead Generation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total WhatsApp inquiries vs Qualified high-intent leads
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-slate-600 text-[11px] font-medium">Inquiries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-600 text-[11px] font-medium">Qualified</span>
          </div>
        </div>
      </div>

      {/* SVG Trend Line / Visual Bars */}
      <div className="relative pt-6 pb-2">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-3 px-2">
          {data.map((item, idx) => {
            const leadsHeight = (item.leads / maxVal) * 100;
            const qualHeight = (item.qualified / maxVal) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-medium shadow-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                    <span className="font-bold text-emerald-400">{item.qualified} Qualified</span> · {item.leads} Inquiries
                  </div>
                )}

                <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                  <div
                    style={{ height: `${leadsHeight}%` }}
                    className="w-1/2 bg-teal-200/80 rounded-t-sm group-hover:bg-teal-300 transition-all duration-300"
                  />
                  <div
                    style={{ height: `${qualHeight}%` }}
                    className="w-1/2 bg-emerald-600 rounded-t-sm group-hover:bg-emerald-700 transition-all duration-300"
                  />
                </div>

                <span className="text-[11px] font-medium text-slate-400 mt-2 truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">Average qualification rate: 54.2%</span>
        <span className="text-[11px] font-semibold text-emerald-600">+9.2% week over week</span>
      </div>
    </div>
  );
};
