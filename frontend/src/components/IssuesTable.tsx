'use client';
import React, { useState } from 'react';
import { AlertTriangle, Lightbulb, Info, HelpCircle, Filter, CheckCircle, Sparkles } from 'lucide-react';
import { FixSnippet } from './FixSnippet';

export interface Issue {
  id: string;
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  effort: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  evidence: string;
  jargon_explained?: string;
  why_ai_cares: string;
  copy_paste_fix: string;
}

interface IssuesTableProps {
  issues: Issue[];
}

export const IssuesTable: React.FC<IssuesTableProps> = ({ issues }) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'LOW_EFFORT'>('ALL');

  const filteredIssues = issues.filter((issue) => {
    if (filter === 'HIGH') return issue.impact.toUpperCase() === 'HIGH';
    if (filter === 'LOW_EFFORT') return issue.effort.toUpperCase() === 'LOW';
    return true;
  });

  const getImpactBadge = (impact: string) => {
    switch (impact.toUpperCase()) {
      case 'HIGH':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/60 shadow-rose-950/40';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60 shadow-amber-950/40';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60 shadow-blue-950/40';
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort.toUpperCase()) {
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60 shadow-emerald-950/40';
      case 'MEDIUM':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/60 shadow-purple-950/40';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Action Matrix</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Monday Morning Optimization Plan
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl leading-relaxed">
            Prioritized by Impact × Effort. Every issue carries proof and plain-English explanation for business owners.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-950/80 border border-gray-800/90 p-1.5 rounded-2xl text-xs shrink-0">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 ${
              filter === 'ALL'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>All ({issues.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('HIGH')}
            className={`px-3.5 py-2 rounded-xl transition-all font-semibold ${
              filter === 'HIGH'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            High Impact
          </button>
          <button
            type="button"
            onClick={() => setFilter('LOW_EFFORT')}
            className={`px-3.5 py-2 rounded-xl transition-all font-semibold ${
              filter === 'LOW_EFFORT'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            Quick Wins (Low Effort)
          </button>
        </div>
      </div>

      {/* Issues Cards List */}
      <div className="space-y-5">
        {filteredIssues.map((issue, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:border-gray-700/80 hover:shadow-2xl space-y-5 relative overflow-hidden group"
          >
            {/* Top Bar: Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-900 border border-gray-700/80 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shadow-inner">
                  #{idx + 1}
                </div>
                <h4 className="font-bold text-lg sm:text-xl text-white tracking-tight">{issue.title}</h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-xl border ${getImpactBadge(issue.impact)}`}>
                  Impact: {issue.impact}
                </span>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-xl border ${getEffortBadge(issue.effort)}`}>
                  Effort: {issue.effort}
                </span>
              </div>
            </div>

            {/* Plain English Business Explanation */}
            {issue.jargon_explained && (
              <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-cyan-200 shadow-sm">
                <div className="p-1 rounded-lg bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="leading-relaxed">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider block mb-0.5">
                    Plain English Business Explanation
                  </span>
                  <span className="text-cyan-100">{issue.jargon_explained}</span>
                </div>
              </div>
            )}

            {/* Evidence & Why AI Cares Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-950/70 border border-gray-800/80 rounded-2xl p-4 space-y-1.5 shadow-inner">
                <div className="flex items-center gap-2 font-bold text-gray-200 uppercase tracking-wider text-[11px]">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>Exact Crawled Evidence</span>
                </div>
                <p className="text-gray-300 leading-relaxed font-mono text-[11px] bg-gray-900/90 p-2.5 rounded-xl border border-gray-800">
                  {issue.evidence}
                </p>
              </div>

              <div className="bg-gray-950/70 border border-gray-800/80 rounded-2xl p-4 space-y-1.5 shadow-inner">
                <div className="flex items-center gap-2 font-bold text-gray-200 uppercase tracking-wider text-[11px]">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Why Generative AI Engines Care</span>
                </div>
                <p className="text-gray-300 leading-relaxed bg-gray-900/90 p-2.5 rounded-xl border border-gray-800">
                  {issue.why_ai_cares}
                </p>
              </div>
            </div>

            {/* Handed-To-You Fix Code Snippet */}
            {issue.copy_paste_fix && (
              <FixSnippet fixCode={issue.copy_paste_fix} title={`Handed-To-You Solution: ${issue.title}`} />
            )}
          </div>
        ))}

        {/* Empty Filter State */}
        {filteredIssues.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-2xl text-gray-400 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white">No Issues Match Selection</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              There are no audit findings matching the selected filter criteria for this website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
