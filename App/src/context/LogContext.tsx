import React, { createContext, useContext, ReactNode, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { sendLogToBackend } from '../services/apiService';

interface LogContextType {
  logAction: (action: string) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const useLogger = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogger must be used within a LogProvider');
  }
  return context;
};

interface LogProviderProps {
  children: ReactNode;
}

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  const { user, token } = useAuth();

  // Create a constant session ID for the lifecycle of the app
  const sessionIdRef = useRef(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  
  const logQueueRef = useRef<any[]>([]);

  useEffect(() => {
    if (token && logQueueRef.current.length > 0) {
      logQueueRef.current.forEach(payload => {
        sendLogToBackend(payload, token);
      });
      logQueueRef.current = [];
    }
  }, [token]);

  const logAction = useCallback((action: string) => {
    const now = new Date();
    
    // Format DD-MM-YYYY HH:mm
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    
    // If not logged in yet, we can default to "User" or check the action
    const username = user?.name || 'User';

    const logMessage = `${formattedDate} : ${username} ${action}`;
    
    console.log(logMessage); // For local debugging
    
    const payload = {
      log: logMessage,
      session_id: sessionIdRef.current,
      timestamp: now.toISOString()
    };
    
    if (token) {
      sendLogToBackend(payload, token);
    } else {
      logQueueRef.current.push(payload);
    }
  }, [user, token]);

  return (
    <LogContext.Provider value={{ logAction }}>
      {children}
    </LogContext.Provider>
  );
};
