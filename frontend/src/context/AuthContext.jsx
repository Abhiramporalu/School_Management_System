import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('sms_token');
      if (token) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          if (profile.role === 'parent' && profile.children && profile.children.length > 0) {
            setActiveChild(profile.children[0]);
          }
        } catch (err) {
          console.warn('Failed to verify token on startup:', err);
          localStorage.removeItem('sms_token');
          localStorage.removeItem('sms_user');
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (username, password) => {
    const data = await api.login({ username, password });
    localStorage.setItem('sms_token', data.token);
    localStorage.setItem('sms_user', JSON.stringify(data.user));
    setUser(data.user);
    if (data.user.role === 'parent' && data.user.children && data.user.children.length > 0) {
      setActiveChild(data.user.children[0]);
    }
    return data.user;
  };

  const register = async (formData) => {
    const data = await api.register(formData);
    localStorage.setItem('sms_token', data.token);
    localStorage.setItem('sms_user', JSON.stringify(data.user));
    setUser(data.user);
    if (data.user.role === 'parent' && data.user.children && data.user.children.length > 0) {
      setActiveChild(data.user.children[0]);
    }
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    setUser(null);
    setActiveChild(null);
  };

  const switchActiveChild = (child) => {
    setActiveChild(child);
  };

  const quickDemoLogin = async (roleKey) => {
    const credentials = {
      admin: { username: 'admin', password: 'admin123' },
      teacher: { username: 'teacher', password: 'teacher123' },
      student: { username: 'student', password: 'student123' },
      parent: { username: 'parent', password: 'parent123' },
      accountant: { username: 'accountant', password: 'accountant123' },
      librarian: { username: 'librarian', password: 'librarian123' },
      transport: { username: 'transport', password: 'transport123' }
    };

    const creds = credentials[roleKey] || credentials.admin;
    return await login(creds.username, creds.password);
  };

  return (
    <AuthContext.Provider value={{
      user,
      activeChild,
      loading,
      login,
      register,
      logout,
      switchActiveChild,
      quickDemoLogin,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
