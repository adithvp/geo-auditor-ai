import React from 'react';
import { Activity, CheckCircle2, FileText, Code2, HelpCircle, Cpu, Zap, Sparkles, Server } from 'lucide-react';

interface ScoreCardProps {
  report: {
    overall_score: number;
    grade?: string;
    status_label?: string;
    score_formula: string;
    is_mocked?: boolean;
    engine_used?: string;
    breakdown: {
      clarity_score: number;
      citation_score: number;
      schema_score: number;
      eeat_score?: number;
      robots_score?: number;
      sitemap_score?: number;
      metadata_score?: number;
      internal_links_score?: number;
    };
    summary: string;
    qna_coverage: string;
    domain: string;
    meta?: {
      has_schema: boolean;
      schema_count: number;
      headings_count: number;
      tables_count?: number;
    };
  };
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ report }) => {
  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: report.status_label || 'Optimal AI Visibility', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (score >= 60) return { label: report.status_label || 'Moderate AI Indexation', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { label: report.status_label || 'Low AI Citation Rank', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  const badge = getScoreBadge(report.overall_score);

  return (
    <div className="space-y-6">
      {/* Redesigned Evaluation Engine Status Card */}
      <div
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl border ${
          report.is_mocked
            ? 'bg-gradient-to-br from-gray-900/95 via-amber-950/20 to-gray-900/95 border-amber-500/30 hover:border-amber-500/50 shadow-lg shadow-amber-500/5'
            : 'bg-gradient-to-br from-gray-900/95 via-emerald-950/20 to-gray-900/95 border-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/5'
        }`}
      >
        {/* Glow ambient background highlight */}
        <div
          className={`absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            report.is_mocked ? 'bg-amber-500/10' : 'bg-emerald-500/10'
          }`}
        />

        <div className="relative z-10 space-y-4">
          {/* Top Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  report.is_mocked
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}
              >
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  ⚙️ Evaluation Engine
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {report.is_mocked ? 'Deterministic Heuristic Mode' : 'LLM Generative Intelligence Mode'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {report.is_mocked ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  🟠 Fallback Engine
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  🟢 AI Powered
                </span>
              )}
            </div>
          </div>

          {/* Engine Model Name & Explanation Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Engine Badge:</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-mono font-semibold ${
                    report.is_mocked
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  }`}
                >
                  {report.engine_used || (report.is_mocked ? 'Rule-Based GEO Engine' : 'OpenAI GPT-4o')}
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                {report.is_mocked
                  ? 'OpenAI evaluation was unavailable. Results were generated using the built-in GEO heuristic engine.'
                  : `Website evaluation completed using ${report.engine_used || 'OpenAI GPT-4o'} with AI-powered GEO analysis.`}
              </p>
            </div>
          </div>

          {/* 4-Column Responsive Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-2.5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Engine Used</span>
              <span className="text-xs font-bold text-white truncate block mt-0.5">
                {report.is_mocked ? 'Rule-Based Engine' : (report.engine_used || 'OpenAI GPT-4o')}
              </span>
            </div>

            <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-2.5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Status</span>
              <span className={`text-xs font-bold block mt-0.5 ${report.is_mocked ? 'text-amber-400' : 'text-emerald-400'}`}>
                {report.is_mocked ? 'Fallback' : 'AI Powered'}
              </span>
            </div>

            <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-2.5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Analysis Type</span>
              <span className="text-xs font-bold text-white block mt-0.5">
                {report.is_mocked ? 'Offline Rule Engine' : 'Live LLM Analysis'}
              </span>
            </div>

            <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-2.5">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Evaluation Mode</span>
              <span className="text-xs font-bold text-cyan-400 block mt-0.5">
                {report.is_mocked ? '7-Point Heuristic' : '7-Check AI Evaluation'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Header Score Card */}
      <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Main Ring Score */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-800"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(report.overall_score / 100) * 263.8} 263.8`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {report.overall_score}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badge.bg}`}>
                  {badge.label}
                </span>
                {report.grade && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-800 text-cyan-400 border border-gray-700">
                    Grade {report.grade}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">GEO Visibility Index</h2>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                {report.score_formula}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Q&A Intent</span>
              </div>
              <div className="text-lg font-bold text-white">{report.qna_coverage}</div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 mb-1">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Schemas</span>
              </div>
              <div className="text-lg font-bold text-white">
                {report.meta?.schema_count ?? (report.breakdown.schema_score > 0 ? 1 : 0)}
              </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 mb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Headings</span>
              </div>
              <div className="text-lg font-bold text-white">{report.meta?.headings_count ?? 'OK'}</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-6 pt-6 border-t border-gray-800/80">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Executive Synthesis
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{report.summary}</p>
        </div>
      </div>

      {/* Breakdown Grid: 3 Deep Checks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Check 1: Schema Infrastructure */}
        <div className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Pillar 1: Schema Entity (40%)</span>
              <div className="text-2xl font-extrabold text-white mt-1">{report.breakdown.schema_score}<span className="text-xs text-gray-500">/100</span></div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {report.breakdown.schema_score > 0 ? "JSON-LD schema detected. Provides machine-readable facts." : "No JSON-LD schema detected. Increases hallucination risk."}
          </p>
          <div className="mt-3 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: `${report.breakdown.schema_score}%` }} />
          </div>
        </div>

        {/* Check 2: Direct-Answer Chunking */}
        <div className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Pillar 2: Direct Chunking (35%)</span>
              <div className="text-2xl font-extrabold text-white mt-1">{report.breakdown.clarity_score}<span className="text-xs text-gray-500">/100</span></div>
            </div>
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Evaluates question heading anchors and direct passage answer readability for RAG retrieval.
          </p>
          <div className="mt-3 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${report.breakdown.clarity_score}%` }} />
          </div>
        </div>

        {/* Check 3: Citation & Verifiability */}
        <div className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Pillar 3: Verifiability (25%)</span>
              <div className="text-2xl font-extrabold text-white mt-1">{report.breakdown.citation_score}<span className="text-xs text-gray-500">/100</span></div>
            </div>
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Probability of Perplexity & ChatGPT referencing this page as an authoritative cited source.
          </p>
          <div className="mt-3 w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" style={{ width: `${report.breakdown.citation_score}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
