import React from 'react';

const categories = ['Owls', 'Raptors', 'Mammals', 'Exotics', 'Archived'];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
            activeCategory === cat
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};