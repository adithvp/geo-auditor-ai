'use client';
import React, { useState } from 'react';
import { AlertTriangle, Lightbulb, Info, HelpCircle } from 'lucide-react';
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
        return 'bg-rose-950/80 text-rose-300 border-rose-800/60';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort.toUpperCase()) {
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
      case 'MEDIUM':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Monday Morning Optimization Plan
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Prioritized by Impact x Effort. Every issue carries proof and plain-English explanation for business owners.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-gray-900/90 border border-gray-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              filter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setFilter('HIGH')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              filter === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            High Impact
          </button>
          <button
            onClick={() => setFilter('LOW_EFFORT')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              filter === 'LOW_EFFORT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Quick Wins (Low Effort)
          </button>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="space-y-4">
        {filteredIssues.map((issue, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-2xl p-5 sm:p-6 transition-all hover:border-gray-700/80 space-y-4"
          >
            {/* Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                  #{idx + 1}
                </div>
                <h4 className="font-bold text-lg text-white">{issue.title}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${getImpactBadge(issue.impact)}`}>
                  Impact: {issue.impact}
                </span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${getEffortBadge(issue.effort)}`}>
                  Effort: {issue.effort}
                </span>
              </div>
            </div>

            {/* Plain English Business Explanation if present */}
            {issue.jargon_explained && (
              <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-cyan-200">
                <HelpCircle className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-cyan-300">Plain English Business Explanation: </span>
                  <span>{issue.jargon_explained}</span>
                </div>
              </div>
            )}

            {/* Evidence & Why AI Cares */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-gray-300">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>Exact Crawled Evidence:</span>
                </div>
                <p className="text-gray-400 leading-relaxed font-mono text-[11px]">{issue.evidence}</p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800/80 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-gray-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Why Generative AI Engines Care:</span>
                </div>
                <p className="text-gray-400 leading-relaxed">{issue.why_ai_cares}</p>
              </div>
            </div>

            {/* Code Fix */}
            {issue.copy_paste_fix && (
              <FixSnippet fixCode={issue.copy_paste_fix} title={`Handed-To-You Fix: ${issue.title}`} />
            )}
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl text-gray-400">
            <p>No issues match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
