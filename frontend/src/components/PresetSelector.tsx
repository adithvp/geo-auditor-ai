import React from 'react';
import { Globe, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  onSelectUrl: (url: string) => void;
  disabled?: boolean;
}

const PRESETS = [
  { name: 'Stripe', url: 'https://stripe.com' },
  { name: 'Vercel', url: 'https://vercel.com' },
  { name: 'Linear', url: 'https://linear.app' },
  { name: 'GitHub', url: 'https://github.com' },
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectUrl, disabled }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        Sample Real Business Audits:
      </span>
      {PRESETS.map((preset) => (
        <button
          key={preset.url}
          type="button"
          disabled={disabled}
          onClick={() => onSelectUrl(preset.url)}
          className="text-xs px-2.5 py-1 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 hover:border-cyan-500/40 transition-all flex items-center gap-1 disabled:opacity-50"
        >
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>{preset.name}</span>
        </button>
      ))}
    </div>
  );
};
