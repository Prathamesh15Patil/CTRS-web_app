import React, { useState, useCallback, useEffect } from 'react';
import { Activity, Loader2, GitBranch, Lightbulb, Wand2, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCTRData } from './hooks/useCTRData';
import ErrorBoundary from './components/ErrorBoundary';
import LogStream from './components/LogStream';
import StateFlow from './components/StateFlow';
import InsightsPanel from './components/InsightsPanel';
import SuggestionsPanel from './components/SuggestionsPanel';
import ReportModal from './components/ReportModal';

function App() {
  const { reports, activeReport, selectReport, loading, error } = useCTRData();
  const [activeModal, setActiveModal] = useState(null); // 'flow', 'insights', 'suggestions', 'report'

  const closeReport = useCallback(() => setActiveModal(null), []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-midnight">
        <Loader2 className="w-6 h-6 text-cyan animate-spin" />
        <p className="text-slate text-[10px] tracking-[0.3em] font-bold">ESTABLISHING CONNECTION</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-midnight">
        <Activity className="w-6 h-6 text-red-500" />
        <p className="text-red-500 text-xs font-bold tracking-widest">{error.toUpperCase()}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-midnight text-slate font-mono selection:bg-cyan/30 overflow-hidden">
      
      {/* ═══════════ HEADER ═══════════ */}
      <header className="shrink-0 px-6 py-3 border-b border-cyan/10 flex items-center justify-between glass z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
            </span>
            <h1 className="text-[11px] font-black tracking-[0.4em] text-white uppercase">
              CTR: COGNITIVE TRANCE RECOGNITION
            </h1>
          </div>
          <div className="h-4 w-[1px] bg-cyan/20"></div>
          <span className="text-[10px] text-cyan/60 tracking-wider">
            SESSION_ID: {activeReport?.session_id || 'NULL'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan tracking-[0.2em]">LIVE</span>
          </div>
        </div>
      </header>

      {/* ═══════════ MAIN WORKSPACE ═══════════ */}
      <main className="flex-1 flex min-h-0 overflow-hidden relative">
        
        {/* Left Column (40%): Live Report Stream */}
        <div className="w-[40%] h-full border-r border-cyan/10 min-h-0">
          <ErrorBoundary>
            <LogStream report={activeReport?.report} />
          </ErrorBoundary>
        </div>

        {/* Right Column (60%): Session Synthesis */}
        <div className="w-[60%] h-full flex flex-col min-h-0">
          <div className="px-6 py-4 border-b border-cyan/5 glass shrink-0 flex justify-between items-center">
            <h2 className="text-[10px] font-bold tracking-[0.3em] text-white/80 uppercase">Session Synthesis</h2>
            <button 
              onClick={() => setActiveModal('report')}
              className="text-[9px] px-3 py-1 border-thin text-cyan hover:bg-cyan/10 transition-all font-bold tracking-widest uppercase"
            >
              Get Detail Report
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <ErrorBoundary>
              <div className="prose-synthesis max-w-3xl mx-auto">
                <ReactMarkdown>{activeReport?.report}</ReactMarkdown>
              </div>
            </ErrorBoundary>
          </div>
        </div>

        {/* ═══════════ NAVIGATION DOCK ═══════════ */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-midnight/80 border-thin glass backdrop-blur-xl z-20">
          <DockButton 
            icon={<GitBranch className="w-4 h-4" />} 
            label="Thinking Flow" 
            onClick={() => setActiveModal('flow')} 
            active={activeModal === 'flow'}
          />
          <DockButton 
            icon={<Lightbulb className="w-4 h-4" />} 
            label="Insights" 
            onClick={() => setActiveModal('insights')}
            active={activeModal === 'insights'}
          />
          <DockButton 
            icon={<Wand2 className="w-4 h-4" />} 
            label="Suggestions" 
            onClick={() => setActiveModal('suggestions')}
            active={activeModal === 'suggestions'}
          />
          <div className="w-[1px] h-4 bg-cyan/10 mx-1"></div>
          <DockButton 
            icon={<FileText className="w-4 h-4" />} 
            label="Review" 
            onClick={() => setActiveModal('report')}
            active={activeModal === 'report'}
          />
        </div>
      </main>

      {/* ═══════════ MODALS ═══════════ */}
      {activeModal === 'flow' && (
        <Modal title="User Thinking Flow" onClose={() => setActiveModal(null)}>
          <StateFlow stateFlow={activeReport?.state_flow} />
        </Modal>
      )}
      {activeModal === 'insights' && (
        <Modal title="AI Insights" onClose={() => setActiveModal(null)}>
          <div className="prose-synthesis">
            <ReactMarkdown 
              components={{
                li: ({children}) => <li className="flex items-start mb-4"><span className="cyan-bullet mt-1.5 shrink-0" /><div>{children}</div></li>,
                ul: ({children}) => <ul className="list-none p-0">{children}</ul>
              }}
            >
              {activeReport?.insights}
            </ReactMarkdown>
          </div>
        </Modal>
      )}
      {activeModal === 'suggestions' && (
        <Modal title="System Suggestions" onClose={() => setActiveModal(null)}>
          <div className="prose-synthesis">
            <ReactMarkdown
              components={{
                li: ({children}) => <li className="flex items-start mb-4"><span className="cyan-bullet mt-1.5 shrink-0" /><div>{children}</div></li>,
                ul: ({children}) => <ul className="list-none p-0">{children}</ul>
              }}
            >
              {activeReport?.suggestions}
            </ReactMarkdown>
          </div>
        </Modal>
      )}
      {activeModal === 'report' && (
        <ReportModal
          report={activeReport?.report}
          sessionId={activeReport?.session_id}
          onClose={closeReport}
        />
      )}
    </div>
  );
}

const DockButton = ({ icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-center gap-1.5 px-4 py-2 transition-all group relative
      ${active ? 'text-cyan bg-cyan/5' : 'text-slate hover:text-white hover:bg-white/5'}
    `}
  >
    {icon}
    <span className="text-[8px] font-bold tracking-[0.2em] uppercase">{label}</span>
    {active && <div className="absolute -top-[1px] left-0 w-full h-[1px] bg-cyan shadow-[0_0_8px_rgba(34,211,238,0.5)]" />}
  </button>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/90 backdrop-blur-md p-6">
    <div className="w-full max-w-4xl bg-midnight border-thin glass flex flex-col max-h-[80vh] relative">
      <div className="px-6 py-4 border-b border-cyan/10 flex justify-between items-center glass">
        <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase">{title}</h3>
        <button onClick={onClose} className="text-slate hover:text-white transition-colors">
          <span className="text-[10px] font-bold tracking-widest uppercase">[ Close ]</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

export default App;
