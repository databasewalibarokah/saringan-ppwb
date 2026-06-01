import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  ShieldCheck,
  UserCircle,
  MonitorPlay
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import PonpesSwitcher from '../../components/PonpesSwitcher';
import SuperAdminPonpesSwitcher from '../../components/SuperAdminPonpesSwitcher';

const AdminLayout = ({ children }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manajemen Murid', href: '/admin/murid', icon: Users },
    { name: 'Penilaian', href: '/admin/penilaian', icon: BarChart3 },
    { name: 'Laporan', href: '/admin/laporan', icon: Calendar },
    { name: 'Periode Saringan', href: '/admin/periode', icon: ShieldCheck },
  ];

  if (isSuperAdmin) {
    navigation.push({ name: 'Manajemen Admin', href: '/admin/users', icon: Settings });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogoutMobile = async () => {
    setIsSidebarOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed h-full z-20">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white leading-tight">SARINGAN</h1>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
          {/* Ponpes Switcher */}
          {isSuperAdmin ? <SuperAdminPonpesSwitcher /> : <PonpesSwitcher />}
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 space-y-2">
          <Link
            to="/app"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-200"
          >
            <MonitorPlay size={22} />
            Buka Mode Pengetesan
          </Link>
          <div className="flex items-center gap-3 p-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden border-2 border-white dark:border-slate-600">
               {user?.foto_identitas ? <img src={user.foto_identitas} alt="avatar" /> : <UserCircle size={24} />}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-800 dark:text-white truncate">{user?.nama || 'Admin'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{isSuperAdmin ? 'Super Admin' : 'Administrator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200"
          >
            <LogOut size={22} />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={18} />
          </div>
          <h1 className="font-black text-slate-800 dark:text-white">SARINGAN</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-500 dark:text-slate-400"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-slate-800 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex flex-col gap-4 border-b dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-xl font-black text-slate-800 dark:text-white">Admin Panel</h1>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
                    <X size={24} />
                  </button>
                </div>
                {/* Ponpes Switcher */}
                {isSuperAdmin ? <SuperAdminPonpesSwitcher /> : <PonpesSwitcher />}
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <item.icon size={22} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-6 border-t dark:border-slate-700 space-y-3">
                <Link
                  to="/app"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all"
                >
                  <MonitorPlay size={22} />
                  Buka Mode Pengetesan
                </Link>
                <button
                  onClick={handleLogoutMobile}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50"
                >
                  <LogOut size={22} />
                  Keluar Sistem
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
