import React from 'react';
import { Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * Section 4 — Suggestions
 * Renders the `suggestions` markdown field as actionable items.
 */
const SuggestionsPanel = ({ suggestions, onOpenReport }) => {
  return (
    <div className="h-full flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Wand2 className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold tracking-widest text-text uppercase">
            Suggestions
          </span>
        </div>
        <button
          onClick={onOpenReport}
          className="px-3 py-1.5 text-xs font-semibold tracking-wider rounded-lg
                     bg-accent/10 text-accent border border-accent/20
                     hover:bg-accent/20 hover:border-accent/40
                     transition-colors cursor-pointer"
        >
          GET DETAIL REPORT
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {suggestions ? (
          <div className="prose-card text-sm text-text/90">
            <ReactMarkdown>{suggestions}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-text-muted text-sm">No suggestions available</p>
        )}
      </div>
    </div>
  );
};

export default SuggestionsPanel;
