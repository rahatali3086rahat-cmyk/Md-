import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            <div className="w-12 h-4 bg-slate-100 rounded-full" />
          </div>
          <div className="w-20 h-6 bg-slate-200 rounded mb-2" />
          <div className="w-28 h-3.5 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="w-32 h-5 bg-slate-200 rounded" />
        <div className="w-24 h-4 bg-slate-100 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2.5">
          <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-1/3 h-4 bg-slate-200 rounded" />
            <div className="w-2/3 h-3 bg-slate-100 rounded" />
          </div>
          <div className="w-20 h-6 bg-slate-100 rounded-full" />
        </div>
      ))}
    </div>
  );
};
