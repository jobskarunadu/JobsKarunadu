import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface AuthContextType {
  isAdmin: boolean;
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  token: null,
  username: null,
  login: () => {},
  logout: () => {},
  isChecking: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('job_aggregator_admin_token'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('job_aggregator_admin_user'));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    async function verify() {
      if (token) {
        const valid = await api.adminVerifySession(token);
        if (valid) {
          setIsAdmin(true);
        } else {
          // Token expired or invalid
          setToken(null);
          setUsername(null);
          setIsAdmin(false);
          localStorage.removeItem('job_aggregator_admin_token');
          localStorage.removeItem('job_aggregator_admin_user');
        }
      } else {
        setIsAdmin(false);
      }
      setIsChecking(false);
    }
    verify();
  }, [token]);

  const login = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAdmin(true);
    localStorage.setItem('job_aggregator_admin_token', newToken);
    localStorage.setItem('job_aggregator_admin_user', newUsername);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setIsAdmin(false);
    localStorage.removeItem('job_aggregator_admin_token');
    localStorage.removeItem('job_aggregator_admin_user');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, username, login, logout, isChecking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
