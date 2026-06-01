import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, SuperAdminRoute, GuruRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import AdminLayout from './components/Layout/AdminLayout';

// Lazy load feature pages
const LoginPage = React.lazy(() => import('./features/auth/LoginPage'));
const GuruApp = React.lazy(() => import('./pages/app/GuruApp'));
const SelectPonpesPage = React.lazy(() => import('./pages/SelectPonpesPage'));

// Admin Panel Features
const AdminDashboard = React.lazy(() => import('./features/admin/dashboard/AdminDashboard'));
const StudentsPage = React.lazy(() => import('./features/admin/students/StudentsPage'));
const ReportsPage = React.lazy(() => import('./features/admin/reports/ReportsPage'));
const UsersPage = React.lazy(() => import('./features/admin/users/UsersPage'));
const AdminPenyampaianPage = React.lazy(() => import('./features/admin/evaluations/AdminPenyampaianPage'));
const AdminPeriodePage = React.lazy(() => import('./features/admin/AdminPeriodePage'));

const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Layout wrapper yang menggunakan <Outlet> agar child routes bisa dirender
const AdminLayoutWrapper = () => (
  <AdminRoute>
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  </AdminRoute>
);

export default function App() {
  const { isAuthenticated, isAdmin, selectedPonpesId, user, accessiblePonpes } = useAuth();

  const getAuthenticatedRedirectPath = () => {
    // Superadmin bypasses ponpes selection and goes straight to dashboard
    if (user?.is_super_admin) {
      return '/admin/dashboard';
    }

    // Admin Saringan → panel admin
    if (isAdmin) {
      return '/admin/dashboard';
    }

    // Guru Saringan → halaman pengetesan
    const needsToSelect = !selectedPonpesId && accessiblePonpes?.length > 1;
    if (needsToSelect) {
      return '/select-ponpes';
    }
    return '/app';
  };

  const authRedirectPath = getAuthenticatedRedirectPath();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={authRedirectPath} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Select Ponpes Route */}
        <Route
          path="/select-ponpes"
          element={
            isAuthenticated ? (
              <SelectPonpesPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Guru Flow — hanya Guru Saringan dan Super Admin */}
        <Route
          path="/app/*"
          element={
            <GuruRoute>
              <GuruApp />
            </GuruRoute>
          }
        />

        {/* Admin Panel — menggunakan Outlet, bukan nested <Routes> */}
        <Route path="/admin" element={<AdminLayoutWrapper />}>
          {/* /admin → redirect ke /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="murid" element={<StudentsPage />} />
          <Route path="penilaian" element={<AdminPenyampaianPage />} />
          <Route path="laporan" element={<ReportsPage />} />
          <Route path="periode" element={<AdminPeriodePage onBack={() => {}} />} />
          <Route
            path="users"
            element={
              <SuperAdminRoute>
                <UsersPage />
              </SuperAdminRoute>
            }
          />
        </Route>

        {/* Catch all */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={authRedirectPath} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? authRedirectPath : '/login'} replace />}
        />
      </Routes>
    </Suspense>
  );
}
