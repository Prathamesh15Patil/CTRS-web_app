import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/**
 * Section 1 — Live Log Stream
 * Streams the `report` field line-by-line in a terminal-style panel.
 * Cyber-industrial minimalist aesthetic: thin borders, monospace font.
 */
const LogStream = memo(({ report }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [streamDone, setStreamDone] = useState(false);
  const containerRef = useRef(null);
  const prevReportRef = useRef(null);
  const intervalRef = useRef(null);

  const allLines = useMemo(() => {
    if (!report) return [];
    return report
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l) => l.length > 0);
  }, [report]);

  useEffect(() => {
    if (report === prevReportRef.current) return;
    prevReportRef.current = report;
    setVisibleCount(0);
    setStreamDone(false);
  }, [report]);

  useEffect(() => {
    if (allLines.length === 0 || streamDone) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next >= allLines.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setStreamDone(true);
          return allLines.length;
        }
        return next;
      });
    }, 150); // Slightly slower for readability in terminal style

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [allLines, streamDone]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCount]);

  const visibleLines = allLines.slice(0, visibleCount);

  return (
    <div className="h-full flex flex-col bg-midnight/50 border-thin overflow-hidden">
      <div className="px-3 py-2 border-b border-cyan/20 flex items-center gap-2 shrink-0 glass">
        <Terminal className="w-3 h-3 text-cyan" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-cyan uppercase">
          Live Report Stream
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 custom-scrollbar"
      >
        {visibleCount === 0 && (
          <div className="text-slate/40 italic flex items-center gap-2">
            <span>Initializing stream...</span>
            <span className="animate-blink">_</span>
          </div>
        )}
        {visibleLines.map((line, i) => (
          <div key={i} className="animate-none prose-terminal text-slate">
            <ReactMarkdown>
              {line}
            </ReactMarkdown>
          </div>
        ))}
        {!streamDone && visibleCount > 0 && (
          <span className="text-cyan animate-blink">_</span>
        )}
      </div>
    </div>
  );
});

LogStream.displayName = 'LogStream';

export default LogStream;
