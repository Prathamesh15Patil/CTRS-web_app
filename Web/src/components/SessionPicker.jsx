import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Session picker — horizontal scrollable list of available sessions.
 * Used in the header to switch between different CTR reports.
 */
const SessionPicker = ({ reports, activeReport, onSelect }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 px-1">
      {reports.map((r) => {
        const isActive = activeReport?.id === r.id;
        // Shorten session ID for display
        const label = r.session_id
          ? r.session_id.replace('session_', '').slice(0, 10) + '…'
          : `#${r.id}`;

        return (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className={`
              shrink-0 px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer
              ${
                isActive
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-transparent border-border text-text-muted hover:border-accent/20 hover:text-text'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default SessionPicker;
