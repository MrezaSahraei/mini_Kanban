import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, setToken, removeToken, isAuthenticated as checkAuth } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const login = (token: string, user: string) => {
    setToken(token);
    localStorage.setItem('username', user);
    setUsername(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('username');
    setUsername(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
