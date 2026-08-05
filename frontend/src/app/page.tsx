'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ScoreCard } from '@/components/ScoreCard';
import { IssuesTable } from '@/components/IssuesTable';
import { PresetSelector } from '@/components/PresetSelector';
import { downloadHtmlReport, downloadJsonReport } from '@/utils/reportGenerator';
import { Search, Loader2, Sparkles, AlertCircle, ArrowRight, Download, FileText, Printer } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-[#070A11]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Hero & Search Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generative Engine Optimization (GEO)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Audit Your Website for{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              AI Search Visibility
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Uncover how ChatGPT, Perplexity, Claude, and Google AI Overviews read, cite, and rank your business. Get evidence-backed clarity scores and handed-to-you code fixes.
          </p>

          {/* Search Bar Input */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAudit();
              }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-gray-400">
                  <Search className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  placeholder="Enter website URL (e.g. https://stripe.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#0D121F] border border-gray-800 focus:border-cyan-500/80 rounded-2xl pl-12 pr-36 py-4 text-sm text-white placeholder-gray-500 shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all"
                />

                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="absolute right-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Sample Preset Buttons */}
              <PresetSelector onSelectUrl={(presetUrl) => runAudit(presetUrl)} disabled={loading} />
            </form>
          </div>
        </section>

        {/* Error Banner */}
        {error && (
          <div className="max-w-3xl mx-auto bg-rose-950/50 border border-rose-800/80 rounded-2xl p-4 flex items-start gap-3 text-rose-300 text-xs sm:text-sm print:hidden">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Crawl & Audit Error</p>
              <p className="mt-0.5 text-rose-300/90">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-4 max-w-3xl mx-auto print:hidden">
            <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white">Extracting & Evaluating Website Data</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Fetching HTML DOM markup, parsing JSON-LD schema objects, and analyzing direct-answer chunking structure...
            </p>
          </div>
        )}

        {/* Audit Report Display */}
        {report && !loading && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Download Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-900/90 border border-gray-800 rounded-2xl print:hidden">
              <div>
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Report Generated</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Target Domain: <span className="font-mono text-cyan-300">{report.domain}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => downloadHtmlReport(report)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Professional Report (.html)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => downloadJsonReport(report)}
                  className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 text-xs flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>Raw JSON</span>
                </button>
              </div>
            </div>

            {/* Score Metrics */}
            <ScoreCard report={report} />

            {/* Actionable Issues Matrix & Fixes */}
            {report.issues && report.issues.length > 0 ? (
              <IssuesTable issues={report.issues} />
            ) : (
              <div className="glass-panel rounded-2xl p-8 text-center text-gray-400">
                <p>No critical GEO issues detected for this domain.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-[#0B0F19] py-6 text-center text-xs text-gray-500 print:hidden">
        <p>GEO Search Auditor &copy; 2026 Phaze AI Take-Home Submission. Built with FastAPI + Next.js.</p>
      </footer>
    </div>
  );
}
