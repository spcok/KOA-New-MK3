import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Heart, 
  Scale, 
  Drumstick, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  ArrowUpDown,
  Plus,
  CloudSun,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryTabs } from './CategoryTabs';
import { AnimalTable } from './AnimalTable';

export const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('Owls');
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);
  const [isHealthExpanded, setIsHealthExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateFull = currentTime.toLocaleDateString("en-GB", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedDatePill = currentTime.toLocaleDateString("en-GB", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
          <span>{formattedDateFull}</span>
          <span className="text-slate-300">|</span>
          <CloudSun size={16} className="text-amber-500" />
          <span>14°C Partly Cloudy</span>
        </div>
      </div>

      {/* Rotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pending Duties */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setIsPendingExpanded(!isPendingExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center border border-blue-100">
                <ClipboardList size={16} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">Pending Duties</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">0</div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isPendingExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <AnimatePresence>
            {isPendingExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 border-t border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3">
                    <CheckCircle2 size={20} className="text-green-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">All Duties Satisfied</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Health Rota */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setIsHealthExpanded(!isHealthExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center border border-rose-100">
                <Heart size={16} className="text-rose-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">Health Rota</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-2 py-0.5 bg-rose-50 text-rose-500 text-xs font-medium rounded-full">0</div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isHealthExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <AnimatePresence>
            {isHealthExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 border-t border-slate-100 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-3">
                    <Heart size={20} className="text-rose-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Collection Stable</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#00a651] rounded-lg shadow-sm p-4 flex items-center justify-between text-white">
          <div>
            <p className="text-xs font-medium opacity-90 mb-1">Weighed Today</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">0</span>
              <span className="text-sm font-medium opacity-80">/0 Records</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white">
            <Scale size={20} />
          </div>
        </div>

        <div className="bg-[#f26522] rounded-lg shadow-sm p-4 flex items-center justify-between text-white">
          <div>
            <p className="text-xs font-medium opacity-90 mb-1">Fed Today</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">0</span>
              <span className="text-sm font-medium opacity-80">/0 Records</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white">
            <Drumstick size={20} />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 mr-2">
              <Calendar size={16} className="text-blue-500" />
              <span className="text-sm font-medium">Viewing Date:</span>
            </div>
            
            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 h-9">
              <ChevronLeft size={16} /> Prev
            </button>
            
            <div className="px-4 py-1.5 border border-slate-200 rounded-md text-sm font-semibold text-slate-900 flex items-center gap-2 h-9 bg-slate-50">
              {formattedDatePill}
              <Calendar size={14} className="text-slate-400" />
            </div>

            <button className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 h-9">
              Next <ChevronRight size={16} />
            </button>
            
            <button className="px-4 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors h-9 ml-2 bg-white">
              Today
            </button>
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors h-10">
              <ArrowUpDown size={16} className="text-slate-400" />
              Name (A-Z)
            </button>
            
            <button className="px-3 py-2 border border-slate-200 rounded-md flex items-center justify-center hover:bg-slate-50 transition-colors h-10">
              <Lock size={16} className="text-slate-400" />
            </button>
            
            <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm h-10 border border-blue-700">
              <Plus size={16} />
              Add {activeCategory.slice(0, -1)}
            </button>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="space-y-4 pt-2">
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <h2 className="text-xl font-bold text-slate-900 pt-2">Your {activeCategory}</h2>
        <AnimalTable activeCategory={activeCategory} />
      </div>
    </div>
  );
};
