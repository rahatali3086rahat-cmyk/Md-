import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VolumeChart } from '../dashboard/VolumeChart';
import { LeadChart } from '../dashboard/LeadChart';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Bot,
  Users2,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { analyticsData } = useApp();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const topProducts = [
    { name: 'Modern L Sofa', share: 42, inquiries: 524 },
    { name: 'Luxury Bedroom Set', share: 28, inquiries: 349 },
    { name: 'Marble Dining Table', share: 18, inquiries: 224 },
    { name: 'Ergonomic Office Chair', share: 8, inquiries: 99 },
    { name: 'Minimalist TV Unit', share: 4, inquiries: 52 },
  ];

  const peakHours = [
    { time: '9 AM – 12 PM', volume: '18%', label: 'Morning Peak' },
    { time: '12 PM – 3 PM', volume: '22%', label: 'Afternoon' },
    { time: '3 PM – 7 PM', volume: '24%', label: 'Evening Surge' },
    { time: '7 PM – 11 PM', volume: '36%', label: 'Night Peak (Highest WhatsApp)' },
  ];

  const handoffReasons = [
    { reason: 'Price negotiation / Bulk order quote', pct: 44 },
    { reason: 'Custom dimensions or bespoke upholstery', pct: 29 },
    { reason: 'Customer requested human agent explicitly', pct: 18 },
    { reason: 'Showroom VIP appointment booking', pct: 9 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Analytics & Performance Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep dive into WhatsApp automation throughput, AI resolution efficacy, and lead conversions.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === p ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Autonomous Resolution Rate</span>
          <p className="text-2xl font-black text-emerald-700 tracking-tight mt-1">78.7%</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+4.2% month-over-month</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Avg First Response Time</span>
          <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">8.4 sec</p>
          <span className="text-[10px] text-emerald-600 font-semibold">92% answered in &lt;15s</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Lead Conversion Rate</span>
          <p className="text-2xl font-black text-purple-700 tracking-tight mt-1">54.2%</p>
          <span className="text-[10px] text-purple-600 font-semibold">Inquiries to qualified lead</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Human Agent Hand-offs</span>
          <p className="text-2xl font-black text-amber-700 tracking-tight mt-1">3.7%</p>
          <span className="text-[10px] text-slate-500 font-semibold">Only 47 handoffs needed</span>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analyticsData && <VolumeChart data={analyticsData.volume} />}
        {analyticsData && <LeadChart data={analyticsData.leads} />}
      </div>

      {/* Breakdown Rows: Top Inquired Products & Peak WhatsApp Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Inquired */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Most Inquired Products</h3>
          <p className="text-xs text-slate-500 mb-4">
            Catalog items generating the highest customer questions on WhatsApp
          </p>

          <div className="space-y-3.5">
            {topProducts.map((prod) => (
              <div key={prod.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{prod.name}</span>
                  <span className="font-mono text-slate-500">{prod.inquiries} inquiries ({prod.share}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${prod.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak WhatsApp Activity Hours */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Peak WhatsApp Traffic Hours</h3>
          <p className="text-xs text-slate-500 mb-4">
            Distribution of incoming customer messages throughout the day
          </p>

          <div className="grid grid-cols-2 gap-3">
            {peakHours.map((slot) => (
              <div key={slot.time} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500">{slot.time}</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{slot.volume}</p>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>AI automatically covers off-hours and night surges</span>
            <span className="font-semibold text-emerald-600">24/7 Availability</span>
          </div>
        </div>
      </div>

      {/* Human Handoff Reasons */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Human Handoff Root Causes</h3>
        <p className="text-xs text-slate-500 mb-4">
          Why conversations were escalated from the AI to a human representative
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {handoffReasons.map((h) => (
            <div key={h.reason} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <p className="text-xs font-semibold text-slate-800 mb-2 leading-relaxed">{h.reason}</p>
              <div>
                <p className="text-2xl font-black text-amber-600">{h.pct}%</p>
                <span className="text-[10px] text-slate-400">of all 47 handoffs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
