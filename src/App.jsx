import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, SuperAdminRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import AdminLayout from './components/Layout/AdminLayout';

// Lazy load feature pages
const LoginPage = React.lazy(() => import('./features/auth/LoginPage'));
const GuruApp = React.lazy(() => import('./pages/app/GuruApp'));

// Admin Panel Features
const AdminDashboard = React.lazy(() => import('./features/admin/dashboard/AdminDashboard'));
const StudentsPage = React.lazy(() => import('./features/admin/students/StudentsPage'));
const ReportsPage = React.lazy(() => import('./features/admin/reports/ReportsPage'));
const UsersPage = React.lazy(() => import('./features/admin/users/UsersPage'));
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
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? '/admin/dashboard' : '/app'} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Guru Flow */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <GuruApp />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel — menggunakan Outlet, bukan nested <Routes> */}
        <Route path="/admin" element={<AdminLayoutWrapper />}>
          {/* /admin → redirect ke /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="murid" element={<StudentsPage />} />
          <Route
            path="penilaian"
            element={
              <div className="p-10 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center font-bold text-slate-400 italic">
                Fitur Penilaian Detail Sedang Dalam Pengembangan
              </div>
            }
          />
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
              <Navigate to={isAdmin ? '/admin/dashboard' : '/app'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/app') : '/login'} replace />}
        />
      </Routes>
    </Suspense>
  );
}
