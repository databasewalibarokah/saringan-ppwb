import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * GuruRoute: hanya bisa diakses oleh Guru Saringan dan Super Admin.
 * Admin Saringan biasa (yang bukan guru) akan diarahkan ke /admin/dashboard.
 */
export const GuruRoute = ({ children }) => {
  const { isAuthenticated, isSuperAdmin, isGuruSaringan } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin && !isGuruSaringan) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

/**
 * AdminRoute: hanya bisa diakses oleh Admin Saringan dan Super Admin.
 * Guru Saringan (yang bukan admin) akan diarahkan ke /app.
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
