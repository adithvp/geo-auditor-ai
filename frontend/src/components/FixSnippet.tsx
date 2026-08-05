'use client';
import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

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
    <div className="mt-3 rounded-xl border border-gray-800 bg-[#0B0F19] overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900/90 border-b border-gray-800 text-xs">
        <div className="flex items-center gap-2 text-gray-400 font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>{title}</span>
          <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">
            {isJsonLd ? 'JSON-LD Schema' : 'Markdown HTML'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all text-xs font-medium ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Fix</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Code Body */}
      <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
        {fixCode}
      </pre>
    </div>
  );
};
