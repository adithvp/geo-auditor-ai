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
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mr-1">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        Sample Live Business Presets:
      </span>
      {PRESETS.map((preset) => (
        <button
          key={preset.url}
          type="button"
          disabled={disabled}
          onClick={() => onSelectUrl(preset.url)}
          className="text-xs px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 hover:border-cyan-500/50 shadow-sm transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="font-medium">{preset.name}</span>
        </button>
      ))}
    </div>
  );
};
