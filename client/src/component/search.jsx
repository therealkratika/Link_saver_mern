import React from 'react';

export function SearchBar({ value, onChange, onFilterClick }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search links, tags, or URLs..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
        />
      </div>

      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className="p-3 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          aria-label="Filter"
        >
        </button>
      )}
    </div>
  );
}