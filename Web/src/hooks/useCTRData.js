import { useState, useEffect, useRef, useCallback } from 'react';
import { sql } from '../db';

export function useCTRData() {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestIdRef = useRef(null);
  const activeIdRef = useRef(null);

  const fetchReports = useCallback(async () => {
    try {
      const result = await sql`
        SELECT id, user_id, session_id, report, insights, state_flow, suggestions
        FROM ctr_report
        ORDER BY id DESC
        LIMIT 10
      `;

      if (!result || result.length === 0) {
        setLoading(false);
        return;
      }

      // Only update reports state if the latest id changed (avoids unnecessary re-renders)
      const newestId = result[0].id;
      if (newestId !== latestIdRef.current) {
        latestIdRef.current = newestId;
        setReports(result);

        // Auto-select newest if nothing is selected yet
        if (!activeIdRef.current) {
          activeIdRef.current = newestId;
          setActiveReport(result[0]);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('DB fetch error:', err);
      setError(err.message || 'Failed to connect');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 6000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  const selectReport = useCallback((report) => {
    activeIdRef.current = report.id;
    setActiveReport(report);
  }, []);

  return { reports, activeReport, selectReport, loading, error, refetch: fetchReports };
}
