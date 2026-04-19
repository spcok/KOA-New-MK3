import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { BentoStats } from './BentoStats';
import { CategoryTabs } from './CategoryTabs';
import { AnimalTable } from './AnimalTable';

export const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('Owls');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium">Sanctuary Overview</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            Add Animal
          </button>
        </div>
      </div>

      <BentoStats />

      <div className="space-y-4">
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <AnimalTable />
      </div>
    </div>
  );
};