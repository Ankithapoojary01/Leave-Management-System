import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('leaveflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('leaveflow_token');
      const savedUser = localStorage.getItem('leaveflow_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        try {
          // Fetch fresh user profile
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('leaveflow_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session sync error:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('leaveflow_token', receivedToken);
      localStorage.setItem('leaveflow_user', JSON.stringify(receivedUser));
      return receivedUser;
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('leaveflow_token', receivedToken);
      localStorage.setItem('leaveflow_user', JSON.stringify(receivedUser));
      return receivedUser;
    } else {
      throw new Error(res.data.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('leaveflow_token');
    localStorage.removeItem('leaveflow_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('leaveflow_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
