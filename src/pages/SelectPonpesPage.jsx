import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';

const SelectPonpesPage = () => {
  const { user, selectPonpes, logout, accessiblePonpes } = useAuth();
  const navigate = useNavigate();

  // Get ponpes details from user data
  const ponpesList = user?.ponpes_aktif?.filter(p => accessiblePonpes.includes(p.id)) || [];

  const handleSelect = (ponpesId) => {
    selectPonpes(ponpesId);
    // Redirect based on role
    const isAdmin = user?.roles?.some(role =>
      role.toLowerCase().includes('admin') || role.toLowerCase().includes('super admin')
    );
    navigate(isAdmin ? '/admin/dashboard' : '/app');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl mb-4 shadow-2xl shadow-emerald-900/20"
          >
            <Building2 className="text-emerald-400" size={40} />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Selamat Datang!</h1>
          <p className="text-emerald-100/70 font-medium">
            Halo, {user?.nama || 'Guru Saringan'}
          </p>
          <p className="text-emerald-100/50 text-sm mt-2">
            Anda memiliki akses di {ponpesList.length} Pondok Pesantren
          </p>
        </div>

        <GlassCard className="p-6 shadow-2xl border-white/20">
          <p className="text-sm font-bold text-emerald-100 uppercase tracking-widest mb-4 text-center">
            Pilih Pondok Pesantren
          </p>

          <div className="space-y-3">
            {ponpesList.map((ponpes, index) => (
              <motion.button
                key={ponpes.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                onClick={() => handleSelect(ponpes.id)}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="text-emerald-400" size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">{ponpes.nama}</p>
                    <p className="text-emerald-200/50 text-xs">Klik untuk memilih</p>
                  </div>
                </div>
                <ChevronRight className="text-emerald-400/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" size={24} />
              </motion.button>
            ))}
          </div>
        </GlassCard>

        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-emerald-100/50 hover:text-emerald-100 font-medium text-sm transition-colors"
          >
            <LogOut size={16} />
            Login dengan akun lain
          </button>
        </div>

        <p className="text-center mt-8 text-emerald-100/30 text-xs font-bold uppercase tracking-[0.2em]">
          &copy; 2026 PP. Wali Barokah - Kediri
        </p>
      </motion.div>
    </div>
  );
};

export default SelectPonpesPage;