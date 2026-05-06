import React, { useEffect, useRef } from 'react';
import { X, Download, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * Report Preview Modal
 * Full-screen overlay that displays the complete report markdown.
 * Cyber-industrial minimalist aesthetic.
 */
const ReportModal = ({ report, sessionId, onClose }) => {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDownload = () => {
    const blob = new Blob([report || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CTR_DETAILED_REPORT_${sessionId || 'SYSTEM'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col bg-midnight font-mono"
    >
      {/* Header */}
      <header className="shrink-0 px-8 py-6 border-b border-cyan/10 flex items-center justify-between glass">
        <div className="flex items-center gap-4">
          <div className="p-2 border-thin bg-cyan/5">
            <FileText className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <h2 className="text-[12px] font-black tracking-[0.5em] text-white uppercase">Detailed Behavior Report</h2>
            <p className="text-[10px] text-cyan/60 mt-1 tracking-widest font-bold">SOURCE: {sessionId || 'SYSTEM_LOG'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-[0.3em] 
                       border-thin text-cyan hover:bg-cyan/10 transition-all uppercase"
          >
            <Download className="w-4 h-4" />
            Download MD
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-[10px] font-black tracking-[0.3em] border-thin 
                       text-slate hover:text-white hover:bg-white/5 transition-all uppercase"
          >
            [ Close ]
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto prose-synthesis">
          {report ? (
            <ReactMarkdown>{report}</ReactMarkdown>
          ) : (
            <div className="h-full flex items-center justify-center text-slate/20 italic tracking-widest uppercase">
              No report data found in buffer.
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Decoration */}
      <footer className="h-1 bg-gradient-to-r from-transparent via-cyan/20 to-transparent"></footer>
    </div>
  );
};

export default ReportModal;
