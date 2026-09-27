import React, { useState } from 'react';
import { VolumeDataPoint } from '../../data/mockAnalytics';
import { useApp } from '../../context/AppContext';

interface VolumeChartProps {
  data: VolumeDataPoint[];
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
  const { refreshAnalytics } = useApp();
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('7days');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleFilterChange = (filter: 'today' | '7days' | '30days') => {
    setTimeFilter(filter);
    refreshAnalytics(filter);
  };

  const chartData = data && Array.isArray(data) ? data : [];
  const maxTotal = Math.max(...chartData.map((d) => d.total || 0), 10);

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Conversation Volume</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            AI Automated vs Human-Agent conversations
          </p>
        </div>

        {/* Time filters & Legend */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
              <span className="text-slate-600 text-[11px] font-medium">AI Handled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-300" />
              <span className="text-slate-600 text-[11px] font-medium">Human Agent</span>
            </div>
          </div>

          <div className="flex p-0.5 rounded-xl bg-slate-100 border border-slate-200/60 text-xs">
            {(['today', '7days', '30days'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  timeFilter === filter
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filter === 'today' ? 'Today' : filter === '7days' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Bar Visualization */}
      <div className="relative pt-6 pb-2">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {data.map((item, idx) => {
            const aiHeightPct = (item.ai / maxTotal) * 100;
            const humanHeightPct = (item.human / maxTotal) * 100;

            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-medium shadow-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
                    <span className="font-bold text-emerald-400">{item.ai} AI</span> · {item.human} Human ({item.total} Total)
                  </div>
                )}

                {/* Stacked Bars */}
                <div className="w-full max-w-[36px] flex flex-col justify-end h-full gap-0.5">
                  {/* Human portion */}
                  <div
                    style={{ height: `${humanHeightPct}%` }}
                    className="w-full bg-slate-300 rounded-t-sm transition-all duration-300 group-hover:brightness-95"
                  />
                  {/* AI portion */}
                  <div
                    style={{ height: `${aiHeightPct}%` }}
                    className="w-full bg-emerald-500 rounded-b-sm transition-all duration-300 group-hover:bg-emerald-600"
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
        <span className="text-[11px]">Meta Cloud API throughput: 99.98% delivery rate</span>
        <span className="text-[11px] font-semibold text-emerald-600">Peak automation window: 7:00 PM – 10:00 PM</span>
      </div>
    </div>
  );
};
