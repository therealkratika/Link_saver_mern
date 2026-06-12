import React from 'react';

export function Sidebar({
  currentView,
  onViewChange,
  isOpen = true,
  onClose,
  onLogout
}) {

  const handleViewChange = (view) => {
    onViewChange(view);
    onClose?.();
  };

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      id: 'all-links',
      label: 'All Links',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      )
    },
    {
      id: 'tags',
      label: 'Tags',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z"/>
          <path d="M7 7h.01"/>
        </svg>
      )
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && onClose && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`w-64 h-screen bg-[#0A0C10] border-r border-white/[0.08] flex flex-col fixed md:static z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>

        {/* Brand Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>

            <h1 className="font-bold text-xl tracking-tight text-white">
              LinkSaver
            </h1>
          </div>

          <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-semibold">
            Organize your resources
          </p>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map(item => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}

                <span className={`transition-transform duration-200 ${
                  isActive ? 'scale-110 text-emerald-400' : 'group-hover:scale-105 group-hover:text-slate-200'
                }`}>
                  {item.icon}
                </span>

                <span className="text-sm tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-white/[0.08]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400/80 hover:text-rose-300 bg-rose-500/[0.05] hover:bg-rose-500/10 border border-rose-500/10 transition-all text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m16 17 5-5-5-5"></path>
              <path d="M21 12H9"></path>
              <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"></path>
            </svg>

            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}