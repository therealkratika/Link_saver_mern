import React from 'react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-indigo-500/05 blur-[150px] rounded-full" />
      </div>

      <nav className="relative z-50 border-b border-white/[0.08] bg-[#0A0C10]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">LinkSaver</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-white text-slate-950 hover:bg-slate-200 text-sm font-medium rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LinkSaver v2.0 is live
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Your digital workspace for <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
            bookmarks that matter.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Ditch messy browser tabs. Organize research, inspiration, and code snippets into an intelligent, lightning-fast knowledge base.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] text-sm"
          >
            Start Saving Links — Free
          </button>
          <button 
            className="w-full sm:w-auto px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 rounded-lg transition-all text-sm font-medium"
          >
            View Interactive Demo
          </button>
        </div>

        {/* Modern App Preview Component */}
        <div className="mt-16 rounded-xl border border-white/10 bg-[#12151C]/80 backdrop-blur-xl p-3 shadow-2xl shadow-black/80">
          <div className="bg-[#0A0C10] rounded-lg border border-white/[0.05] p-4 sm:p-6 text-left">
            {/* Header / Search bar mock */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4 gap-4">
              <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-md text-xs text-slate-400 flex-1 max-w-xs">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span>Search links or tags...</span>
                <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">⌘K</span>
              </div>
              <div className="flex gap-2">
                <div className="h-7 px-2.5 rounded bg-white/[0.08] border border-white/10 text-[11px] flex items-center text-slate-300">Density View</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { title: "Tailwind CSS - Rapidly build modern websites", domain: "tailwindcss.com", tag: "CSS", tagBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
                { title: "Framer Motion: Production-ready animation library for React", domain: "framer.com", tag: "React", tagBg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                { title: "System Design Primer - Github Repository", domain: "github.com", tag: "Architecture", tagBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-400 flex-shrink-0">
                      {item.domain[0].toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-medium text-slate-200 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{item.domain}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${item.tagBg} hidden sm:block flex-shrink-0`}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.08]">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Engineered for speed and focus.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            Everything you need from a bookmark manager, minus the bloat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-6 rounded-xl bg-[#12151C]/60 border border-white/[0.08] relative overflow-hidden group">
            <div className="mb-6">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">01 / Speed</span>
              <h3 className="text-xl font-semibold text-white mt-1">Command Palette First</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md">Filter tags, open saved links, or trigger instant saves straight from your keyboard without touching your mouse.</p>
            </div>
            <div className="bg-[#0A0C10] p-3 rounded-lg border border-white/10 font-mono text-xs text-slate-400">
              <span className="text-emerald-400">&gt;</span> save https://github.com/developer/project <span className="text-slate-600">--tag=dev</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#12151C]/60 border border-white/[0.08]">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">02 / Metadata</span>
            <h3 className="text-xl font-semibold text-white mt-1">Auto-Previews</h3>
            <p className="text-slate-400 text-sm mt-2">OpenGraph titles, favicons, and descriptions are automatically parsed on URL paste.</p>
          </div>

          <div className="p-6 rounded-xl bg-[#12151C]/60 border border-white/[0.08]">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">03 / Organize</span>
            <h3 className="text-xl font-semibold text-white mt-1">Smart Tags</h3>
            <p className="text-slate-400 text-sm mt-2">Filter multi-category resources with keyboard-friendly tag hierarchies.</p>
          </div>

          <div className="md:col-span-2 p-6 rounded-xl bg-[#12151C]/60 border border-white/[0.08]">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">04 / Security</span>
            <h3 className="text-xl font-semibold text-white mt-1">Private & Encrypted Storage</h3>
            <p className="text-slate-400 text-sm mt-2">Your collection is your personal knowledge base. Encrypted storage guarantees your saved resources remain completely private.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] relative z-10 py-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 LinkSaver. Built for developers and researchers.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#github" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}