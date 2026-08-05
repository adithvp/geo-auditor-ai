'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ScoreCard } from '@/components/ScoreCard';
import { IssuesTable } from '@/components/IssuesTable';
import { PresetSelector } from '@/components/PresetSelector';
import { downloadHtmlReport, downloadJsonReport } from '@/utils/reportGenerator';
import { Search, Loader2, Sparkles, AlertCircle, ArrowRight, Download, FileText, Printer, Shield, Cpu, Activity, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);

  const runAudit = async (targetUrl?: string) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) {
      setError('Please enter a valid website URL (e.g. https://stripe.com)');
      return;
    }

    setUrl(finalUrl);
    setLoading(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Failed to analyze website' }));
        throw new Error(errData.detail || `Server returned ${res.status}`);
      }

      const data = await res.json();
      setReport(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Error running audit. Ensure FastAPI backend is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060811] text-gray-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Hero & Search Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto print:hidden relative">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Hero Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-lg shadow-cyan-950/50">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Generative Engine Optimization (GEO) Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Audit Your Website for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              AI Search Visibility
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Uncover how <strong className="text-gray-200">ChatGPT</strong>, <strong className="text-gray-200">Perplexity</strong>, <strong className="text-gray-200">Claude</strong>, and <strong className="text-gray-200">Google AI Overviews</strong> read, cite, and rank your business. Get evidence-backed clarity scores and handed-to-you code fixes.
          </p>

          {/* Search Input Box */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAudit();
              }}
              className="relative"
            >
              <div className="relative flex items-center">
                <div className="absolute left-5 pointer-events-none text-gray-400">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Enter website URL (e.g. https://stripe.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#0A0E1A]/90 border border-gray-800 focus:border-cyan-500/80 rounded-2xl pl-13 pr-36 py-4.5 text-sm text-white placeholder-gray-500 shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium"
                />

                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="absolute right-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Sample Presets */}
              <PresetSelector onSelectUrl={(presetUrl) => runAudit(presetUrl)} disabled={loading} />
            </form>
          </div>
        </section>

        {/* Error Alert Banner */}
        {error && (
          <div className="max-w-3xl mx-auto bg-rose-950/60 border border-rose-800/80 rounded-2xl p-5 flex items-start gap-4 text-rose-300 text-xs sm:text-sm shadow-2xl print:hidden animate-in fade-in duration-300">
            <div className="p-2 rounded-xl bg-rose-900/50 border border-rose-700/50 text-rose-300 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-rose-100">Audit Request Exception</h4>
              <p className="text-rose-300/90 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton & Progress */}
        {loading && (
          <div className="glass-panel-glow rounded-3xl p-10 sm:p-14 text-center space-y-6 max-w-3xl mx-auto print:hidden relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Extracting DOM & Running Generative AI Analysis</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                Fetching HTML markup, inspecting robots.txt AI bot disallows, parsing JSON-LD schema blocks, and calculating direct-answer passage chunking...
              </p>
            </div>

            {/* Simulated Multi-Step Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 flex items-center gap-2 text-gray-300">
                <Activity className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <span>1. DOM Crawler Active</span>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 flex items-center gap-2 text-gray-300">
                <Cpu className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                <span>2. JSON-LD Parser</span>
              </div>
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 flex items-center gap-2 text-gray-300">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                <span>3. Evaluating AI Rank</span>
              </div>
            </div>
          </div>
        )}

        {/* Audit Report Display Dashboard */}
        {report && !loading && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Download & Export Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 glass-panel rounded-2xl border border-white/[0.08] print:hidden">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Audit Successfully Generated
                </div>
                <div className="text-base font-extrabold text-white">
                  Target Domain: <span className="font-mono text-cyan-300">{report.domain}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => downloadHtmlReport(report)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Report (.html)</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all duration-200"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadJsonReport(report)}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 text-xs font-semibold flex items-center gap-2 transition-all duration-200"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>Raw JSON</span>
                </button>
              </div>
            </div>

            {/* Score Cards & Evaluation Engine Component */}
            <ScoreCard report={report} />

            {/* Actionable Issues Matrix */}
            {report.issues && report.issues.length > 0 ? (
              <IssuesTable issues={report.issues} />
            ) : (
              <div className="glass-panel rounded-2xl p-10 text-center text-gray-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Optimal AI Visibility</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  No critical GEO issues detected for this domain. Content is well-structured for machine indexation.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-white/[0.06] bg-[#05070E] py-8 text-center text-xs text-gray-500 print:hidden mt-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>GEO Search Auditor &copy; 2026 Phaze AI Product Developer Submission</span>
          </div>
          <div className="text-gray-500 font-mono text-[11px]">
            Stack: Python FastAPI + Next.js (TypeScript & Tailwind CSS)
          </div>
        </div>
      </footer>
    </div>
  );
}
