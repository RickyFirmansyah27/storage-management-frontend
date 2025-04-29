
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, login, register, logout, isAuthenticated } from '../utils/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check if user is logged in on page load
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuth(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuth(true);
      return true;
    }
    return false;
  };

  const handleRegister = async (name: string, email: string, password: string): Promise<boolean> => {
    const newUser = register(name, email, password);
    if (newUser) {
      setUser(newUser);
      setIsAuth(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuth(false);
  };

  const value = {
    user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: isAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
