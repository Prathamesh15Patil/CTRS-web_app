/* App.jsx */
import React, { useState, useCallback } from 'react';
import {
  Activity,
  Loader2,
  GitBranch,
  Lightbulb,
  Wand2,
  FileText
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';

import { useCTRData } from './hooks/useCTRData';

import ErrorBoundary from './components/ErrorBoundary';
import LogStream from './components/LogStream';
import StateFlow from './components/StateFlow';
import ReportModal from './components/ReportModal';

function App() {
  const { activeReport, loading, error } = useCTRData();

  const [activeModal, setActiveModal] = useState(null);

  const closeReport = useCallback(() => {
    setActiveModal(null);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-5 bg-[#020617]">
        <Loader2 className="w-7 h-7 text-cyan animate-spin" />

        <p className="text-sm tracking-[0.15em] text-slate-400 font-medium">
          Establishing Connection
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-5 bg-[#020617]">
        <Activity className="w-7 h-7 text-red-500" />

        <p className="text-sm text-red-400 font-medium">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#0b1220,#040816_55%)] text-slate">

      {/* HEADER */}
      <header className="shrink-0 px-8 py-6">
        <div className="surface rounded-3xl px-7 py-5">

          <div className="flex flex-wrap items-center justify-between gap-6">

            {/* LEFT */}
            <div className="flex flex-wrap items-center gap-5">

              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan"></span>
                </span>

                <h1 className="text-xl font-semibold text-white tracking-tight">
                  Cognitive Trance Recognition
                </h1>
              </div>

              <div className="h-5 w-px bg-white/10"></div>

              <span className="font-mono text-sm text-cyan/70">
                SESSION_ID: {activeReport?.session_id || 'NULL'}
              </span>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2 rounded-full bg-cyan/10 border border-cyan/20 px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-cyan"></div>

              <span className="text-xs text-cyan font-medium">
                Live Session
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-7">

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

            <DockButton
              icon={<FileText className="w-4 h-4" />}
              label="Review"
              onClick={() => setActiveModal('report')}
              active={activeModal === 'report'}
            />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex h-[calc(100vh-180px)] gap-5 px-8 pb-8">

        {/* LEFT PANEL */}
        <div className="w-[38%] min-w-[340px]">

          <div className="surface rounded-3xl h-full p-6 overflow-hidden">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Session Stream
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Real-time cognitive processing logs.
              </p>
            </div>

            <div className="h-[calc(100%-70px)] overflow-y-auto">
              <ErrorBoundary>
                <LogStream report={activeReport?.report} />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[62%]">

          <div className="surface rounded-3xl h-full flex flex-col overflow-hidden">

            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Session Synthesis
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Readable analysis, observations, and contextual interpretation.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('report')}
                className="px-5 py-3 rounded-2xl bg-cyan/10 border border-cyan/20 text-cyan text-sm font-medium hover:bg-cyan/15 transition-all"
              >
                Detail Report
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8">

              <ErrorBoundary>
                <div className="prose-synthesis max-w-3xl mx-auto">
                  <ReactMarkdown>
                    {activeReport?.report}
                  </ReactMarkdown>
                </div>
              </ErrorBoundary>

            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {activeModal === 'flow' && (
        <Modal
          title="User Thinking Flow"
          onClose={() => setActiveModal(null)}
        >
          <StateFlow stateFlow={activeReport?.state_flow} />
        </Modal>
      )}

      {activeModal === 'insights' && (
        <Modal
          title="AI Insights"
          onClose={() => setActiveModal(null)}
        >
          <div className="prose-synthesis">
            <ReactMarkdown
              components={{
                li: ({ children }) => (
                  <li className="flex items-start">
                    <span className="cyan-bullet" />
                    <div>{children}</div>
                  </li>
                ),
                ul: ({ children }) => (
                  <ul className="list-none p-0">
                    {children}
                  </ul>
                )
              }}
            >
              {activeReport?.insights}
            </ReactMarkdown>
          </div>
        </Modal>
      )}

      {activeModal === 'suggestions' && (
        <Modal
          title="System Suggestions"
          onClose={() => setActiveModal(null)}
        >
          <div className="prose-synthesis">
            <ReactMarkdown
              components={{
                li: ({ children }) => (
                  <li className="flex items-start">
                    <span className="cyan-bullet" />
                    <div>{children}</div>
                  </li>
                ),
                ul: ({ children }) => (
                  <ul className="list-none p-0">
                    {children}
                  </ul>
                )
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

/* BUTTON */
const DockButton = ({
  icon,
  label,
  onClick,
  active
}) => (
  <button
    onClick={onClick}
    className={`
      inline-flex items-center gap-2 rounded-2xl px-5 py-3
      text-sm font-medium transition-all duration-200
      border

      ${active
        ? 'bg-cyan/15 border-cyan/30 text-white shadow-lg shadow-cyan/10'
        : 'bg-white/[0.04] border-white/5 text-slate hover:bg-white/[0.07] hover:text-white'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* MODAL */
const Modal = ({
  title,
  onClose,
  children
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6">

    <div className="w-full max-w-5xl surface rounded-3xl flex flex-col max-h-[85vh] overflow-hidden">

      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">

        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>

        <button
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        {children}
      </div>
    </div>
  </div>
);

export default App;