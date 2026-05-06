import React from 'react';
import MermaidChart from './MermaidChart';

/**
 * User Thinking Flow Component
 * Renders the Mermaid flowchart from the state_flow data.
 * Designed to fit within the system's high-contrast modals.
 */
const StateFlow = ({ stateFlow }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
      {stateFlow ? (
        <MermaidChart code={stateFlow} />
      ) : (
        <div className="text-slate/20 italic tracking-widest uppercase">
          No flow data found in current session.
        </div>
      )}
    </div>
  );
};

export default StateFlow;
