import React from 'react';
import PropTypes from 'prop-types';

export function EmptyState({ title, description, onAddLink, icon = 'inbox' }) {
  const icons = {
    inbox: (
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    link: (
      <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center selection:bg-emerald-500/20 selection:text-emerald-400">
      
      {/* Icon Container with Glow Effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 bg-[#12151C] border border-white/[0.08] rounded-2xl flex items-center justify-center text-slate-400 shadow-2xl">
          {icons[icon] || icons.inbox}
        </div>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-white mb-2">
        {title}
      </h3>

      <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {onAddLink && (
        <button
          onClick={onAddLink}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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