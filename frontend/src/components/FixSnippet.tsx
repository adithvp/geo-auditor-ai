'use client';
import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

interface FixSnippetProps {
  fixCode: string;
  title?: string;
}

export const FixSnippet: React.FC<FixSnippetProps> = ({ fixCode, title = "Copy-Paste Fix Solution" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isJsonLd = fixCode.includes('application/ld+json') || fixCode.includes('{');

  return (
    <div className="mt-4 rounded-2xl border border-gray-800/90 bg-[#090D16] overflow-hidden shadow-xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/95 border-b border-gray-800/90 text-xs">
        <div className="flex items-center gap-2 text-gray-300 font-mono">
          <div className="p-1 rounded bg-gray-800 text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-gray-200">{title}</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-[10px] font-mono text-cyan-300 border border-cyan-800/50">
            {isJsonLd ? 'JSON-LD Schema' : 'HTML Anchor Chunk'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold shadow-sm ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Code Body */}
      <div className="relative">
        <pre className="p-4 text-xs font-mono text-cyan-300 bg-[#070A12] overflow-x-auto whitespace-pre-wrap leading-relaxed selection:bg-cyan-500/30 selection:text-white">
          {fixCode}
        </pre>
      </div>
    </div>
  );
};
