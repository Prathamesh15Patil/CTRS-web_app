import React from 'react';
import { Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * Section 3 — AI Insights
 * Renders the `insights` markdown field as styled bullet points.
 */
const InsightsPanel = ({ insights }) => {
  return (
    <div className="h-full flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2.5 shrink-0">
        <Lightbulb className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold tracking-widest text-text uppercase">
          AI Insights
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {insights ? (
          <div className="prose-card text-sm text-text/90">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-text-muted text-sm">No insights available</p>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
