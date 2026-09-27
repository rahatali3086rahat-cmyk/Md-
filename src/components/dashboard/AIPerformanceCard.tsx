import React from 'react';
import { Bot, Clock, ThumbsUp, Zap, ArrowUpRight } from 'lucide-react';

interface AIPerformanceCardProps {
  resolutionRate: string;
  responseTime: string;
  satisfaction: number;
}

export const AIPerformanceCard: React.FC<AIPerformanceCardProps> = ({
  resolutionRate = '78.7%',
  responseTime = '8.4 sec',
  satisfaction = 94,
}) => {
  return (
    <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Agent Performance</h3>
              <p className="text-[11px] text-slate-400">Self-optimizing customer bot</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Zap className="w-3 h-3" />
            Healthy
          </span>
        </div>

        {/* 3 Core Performance Metrics */}
        <div className="grid grid-cols-3 gap-3 py-2">
          {/* Resolution Rate */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-medium uppercase tracking-wider">Resolution</span>
              <Bot className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {resolutionRate}
            </p>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" /> +4.2%
            </span>
          </div>

          {/* Response Time */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-medium uppercase tracking-wider">Response</span>
              <Clock className="w-3 h-3 text-blue-400" />
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {responseTime}
            </p>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" /> -1.2s faster
            </span>
          </div>

          {/* CSAT */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-medium uppercase tracking-wider">CSAT Score</span>
              <ThumbsUp className="w-3 h-3 text-amber-400" />
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {satisfaction}%
            </p>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" /> Top 5% tier
            </span>
          </div>
        </div>
      </div>

      {/* Progress detail */}
      <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Daily Autonomous Handling Goal</span>
          <span className="text-white font-semibold text-[11px]">982 / 1,248 (78.7%)</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            style={{ width: '78.7%' }}
          />
        </div>
      </div>
    </div>
  );
};
