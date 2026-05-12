import React from 'react';

export function EmptyState({ title, description, onAddLink, icon = 'inbox' }) {
  const icons = {
    inbox: (
      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    link: (
      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
        {icons[icon] || icons.inbox}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {onAddLink && (
        <button
          onClick={onAddLink}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 font-bold active:scale-95"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Your First Link
        </button>
      )}
    </div>
  );
}
EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onAddLink: PropTypes.func,
  icon: PropTypes.string,
};