'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Advisor {
  id: string;
  email: string;
  name: string;
  organization: string | null;
  role: string;
  isProtectedDeveloper?: boolean;
  projectCount?: number;
}

interface AuthContextType {
  advisor: Advisor | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: { email: string; password: string; name: string; organization?: string; inviteCode: string }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setAdvisor(data.advisor);
    } catch {
      setAdvisor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Login failed' };
      }

      setAdvisor(data.advisor);
      return {};
    } catch {
      return { error: 'Network error' };
    }
  };

  const register = async (data: { email: string; password: string; name: string; organization?: string; inviteCode: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Registration failed' };
      }

      setAdvisor(result.advisor);
      return {};
    } catch {
      return { error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setAdvisor(null);
    }
  };

  return (
    <AuthContext.Provider value={{ advisor, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
