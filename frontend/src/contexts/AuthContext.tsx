import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register } from '../api/auth';

interface AuthContextType {
  user: any; // Replace 'any' with your user type
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Replace 'any' with your user type

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginHandler = async (email: string, password: string) => {
    const userData = await login(email, password);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const registerHandler = async (email: string, password: string) => {
    const userData = await register(email, password);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login: loginHandler, register: registerHandler, logout: logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};