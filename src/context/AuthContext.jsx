import { createContext, useContext, useState, useEffect } from 'react';
import { saveToken, getToken, saveUser, getUser, clearAuth } from '../utils/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(getUser);
  const [token,   setToken]   = useState(getToken);
  const [loading, setLoading] = useState(false);

  const login = (responseData) => {
    saveToken(responseData.token);
    const userData = {
      userId:    responseData.userId,
      email:     responseData.email,
      role:      responseData.role,
      tokenType: responseData.tokenType,
    };
    saveUser(userData);
    setToken(responseData.token);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const isAdmin   = () => user?.role === 'ADMIN';
  const isStudent = () => user?.role === 'STUDENT';
  const isCompany = () => user?.role === 'COMPANY';

  return (
    <AuthContext.Provider value={{ user, token, loading, setLoading, login, logout, isAdmin, isStudent, isCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
