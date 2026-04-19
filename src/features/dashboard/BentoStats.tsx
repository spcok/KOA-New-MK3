import React from 'react';
import { ClipboardList, Scale, Utensils } from 'lucide-react';

export const BentoStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Pending Tasks */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-red-50 rounded-lg">
          <ClipboardList className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Tasks</p>
          <p className="text-2xl font-bold text-slate-900">0</p>
        </div>
      </div>

      {/* Weighed Today */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Scale className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Weighed Today</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">0</p>
            <p className="text-sm text-slate-400">/ 0</p>
          </div>
        </div>
      </div>

      {/* Fed Today */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-emerald-50 rounded-lg">
          <Utensils className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Fed Today</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">0</p>
            <p className="text-sm text-slate-400">/ 0</p>
          </div>
        </div>
      </div>
    </div>
  );
};