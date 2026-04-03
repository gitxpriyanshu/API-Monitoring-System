import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

export interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  clientId: string;
  token?: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('api-monitor-user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('api-monitor-user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (e) {
      console.error('Backend logout failed', e);
    }
    setUser(null);
    localStorage.removeItem('api-monitor-user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
