'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getOrCreateSessionId } from '@/lib/session';

interface SessionContextType {
  sessionId: string;
  onboardingComplete: boolean;
  setOnboardingComplete: (value: boolean) => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  sessionId: '',
  onboardingComplete: false,
  setOnboardingComplete: () => {},
  isLoading: true,
});

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState('');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initSession = useCallback(async () => {
    try {
      const id = getOrCreateSessionId();
      setSessionId(id);

      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        setOnboardingComplete(data.onboardingComplete);
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <SessionContext.Provider
      value={{ sessionId, onboardingComplete, setOnboardingComplete, isLoading }}
    >
      {children}
    </SessionContext.Provider>
  );
}
