import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthSDK } from "../Api/AuthSDK";

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await AuthSDK.login({ email, password });
      navigate("/dashboard");
      globalThis.location.reload();
    }catch (err) {
  const message = err.msg || err.message || "Login failed. Please check your credentials.";

  setError(message);

  if (message.toLowerCase().includes("verify your email")) {
    setShowResend(true);
  } else {
    setShowResend(false);
  }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-400">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-indigo-500/05 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <div 
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-3 cursor-pointer group mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <span className="font-semibold text-2xl tracking-tight text-white">LinkSaver</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to access your saved resources
          </p>
        </div>
        <div className="bg-[#12151C]/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl shadow-black/80">
            {error && (
            <div className="mb-6 p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 border bg-rose-500/10 text-rose-400 border-rose-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="email"
                className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-300 tracking-wide"
                >
                  Password
                </label>
                <button 
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 rounded-lg text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors ml-1"
            >
              Create an account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}