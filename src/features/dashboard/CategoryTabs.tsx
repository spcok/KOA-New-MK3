import React from 'react';

const categories = ['Owls', 'Raptors', 'Mammals', 'Exotics', 'Archived'];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="w-full flex items-center border border-slate-200 rounded-md bg-white p-1 shadow-sm overflow-x-auto scrollbar-hide">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`flex-1 min-w-[100px] px-4 py-2 text-sm font-medium rounded transition-all ${
              isActive
                ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
