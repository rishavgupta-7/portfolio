import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('stark_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('stark_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.admin) {
          setAdmin(res.admin);
          localStorage.setItem('stark_admin_user', JSON.stringify(res.admin));
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.token && res.admin) {
      setToken(res.token);
      setAdmin(res.admin);
      localStorage.setItem('stark_admin_token', res.token);
      localStorage.setItem('stark_admin_user', JSON.stringify(res.admin));
      return res;
    }
    throw new Error('Authentication failed');
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      setToken(null);
      setAdmin(null);
      localStorage.removeItem('stark_admin_token');
      localStorage.removeItem('stark_admin_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin && !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
