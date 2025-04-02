import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, LoginData, RegisterData } from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // TODO: 사용자 정보 조회 API 호출
    }
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await authApi.login(data);
      localStorage.setItem('token', response.data.access_token);
      setIsAuthenticated(true);
      // TODO: 사용자 정보 조회 API 호출
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      localStorage.setItem('token', response.data.access_token);
      setIsAuthenticated(true);
      // TODO: 사용자 정보 조회 API 호출
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
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