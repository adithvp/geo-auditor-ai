import React from 'react';
import { Search, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0D121F] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              GEO Auditor
            </span>
            <span className="ml-2 text-[10px] font-semibold tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 uppercase">
              AI Engine Optimization
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="hidden sm:flex items-center gap-2 bg-gray-900/90 border border-gray-800 rounded-lg px-3 py-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Targeting ChatGPT, Perplexity & Claude</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-2.5 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>v1.0 Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
