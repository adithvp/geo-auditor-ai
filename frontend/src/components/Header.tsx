import React from 'react';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-white/[0.07] bg-[#070B14]/85 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#090D1A] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans">
              GEO Auditor
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 uppercase">
              <Cpu className="w-3 h-3" /> Enterprise Platform
            </span>
          </div>
        </div>

        {/* Right Status Badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-2 bg-gray-900/90 border border-gray-800 rounded-xl px-3 py-1.5 text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium text-gray-300">ChatGPT · Perplexity · Claude Ready</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/50 rounded-xl px-3 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>v1.0 Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
