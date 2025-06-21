import React from 'react';
import { Search, Filter } from 'lucide-react';
import { EventCategory } from '../types/calendar';

interface SearchAndFilterProps {
  searchQuery: string;
  selectedCategories: EventCategory[];
  onSearchChange: (query: string) => void;
  onCategoriesChange: (categories: EventCategory[]) => void;
}

const categories: { value: EventCategory; label: string; color: string }[] = [
  { value: 'work', label: 'Work', color: 'bg-blue-500' },
  { value: 'personal', label: 'Personal', color: 'bg-emerald-500' },
  { value: 'health', label: 'Health', color: 'bg-red-500' },
  { value: 'social', label: 'Social', color: 'bg-purple-500' },
  { value: 'education', label: 'Education', color: 'bg-indigo-500' },
  { value: 'family', label: 'Family', color: 'bg-pink-500' },
  { value: 'travel', label: 'Travel', color: 'bg-orange-500' },
  { value: 'other', label: 'Other', color: 'bg-gray-500' },
];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  selectedCategories,
  onSearchChange,
  onCategoriesChange,
}) => {
  const handleCategoryToggle = (category: EventCategory) => {
    const isSelected = selectedCategories.includes(category);
    if (isSelected) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" size={16} />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 bg-white/20 text-white placeholder-blue-200 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-64"
        />
      </div>

      {/* Filter */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg border border-white/30 hover:bg-white/30 transition-colors">
          <Filter size={16} />
          Filter ({selectedCategories.length})
        </button>
        
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => handleCategoryToggle(category.value)}
                  className="rounded"
                />
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="text-gray-700">{category.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};