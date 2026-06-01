import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPonpesId, setSelectedPonpesId] = useState(() => {
    const saved = localStorage.getItem('selected_ponpes_id');
    return saved !== null ? saved : null;
  });

  // Role helpers
  const isSuperAdmin = user?.is_super_admin;
  const isAdmin = user?.roles?.some(role => role.toLowerCase().includes('admin')) || isSuperAdmin;
  const isGuru = user?.roles?.some(role => role.toLowerCase().includes('guru'));

  // Guru Saringan: either has a 'guru' role OR has been assigned to at least one ponpes as guru saringan
  const accessiblePonpes = user?.guru_saringan_ponpes_ids || [];
  const isGuruSaringan = isGuru || accessiblePonpes.length > 0;

  // Default Super Admin to 'all' if no ponpes is selected
  useEffect(() => {
    if (isSuperAdmin && !selectedPonpesId && isAuthenticated) {
      setSelectedPonpesId('all');
    }
  }, [isSuperAdmin, selectedPonpesId, isAuthenticated]);

  // Simpan ponpes_id yang dipilih ke localStorage
  useEffect(() => {
    if (selectedPonpesId) {
      localStorage.setItem('selected_ponpes_id', selectedPonpesId);
    } else {
      localStorage.removeItem('selected_ponpes_id');
    }
  }, [selectedPonpesId]);

  const login = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    localStorage.setItem('isLoggedIn', 'true');
  }, []);

  const selectPonpes = useCallback((ponpesId) => {
    setSelectedPonpesId(ponpesId);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (token) {
        await fetch('https://generus.app/api/auth/logout', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setSelectedPonpesId(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('selected_ponpes_id');
      setIsLoading(false);
    }
  }, [token]);

  // Dapatkan daftar ponpes yang bisa diakses user sebagai Guru Saringan
  // (sudah dideklarasikan di atas bersama isGuruSaringan)

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      selectPonpes,
      selectedPonpesId,
      setSelectedPonpesId,
      isSuperAdmin,
      isAdmin,
      isGuru,
      isGuruSaringan,
      accessiblePonpes,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
