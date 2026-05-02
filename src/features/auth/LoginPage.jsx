import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { api } from '../../services/api';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await api.post('/auth/login-credential', { username, password });

      // Determine if admin or guru
      const isAdmin = result.user.roles.some(role => 
        role.toLowerCase().includes('admin') || role.toLowerCase().includes('super admin')
      );

      login(result.user, result.token);
      
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/app');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl mb-4 shadow-2xl shadow-emerald-900/20"
          >
            <ShieldCheck className="text-emerald-400" size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">SARINGAN PPWB</h1>
          <p className="text-emerald-100/70 font-medium">Sistem Penilaian Santri Baru</p>
        </div>

        <GlassCard className="p-8 shadow-2xl border-white/20">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-200 text-sm font-medium flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-100 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/50 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="masukkan username anda"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Lupa Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/50 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all text-lg"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-200/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-600 focus:ring-emerald-500" />
              <label htmlFor="remember" className="text-sm text-emerald-100/70 font-medium">Ingat saya di perangkat ini</label>
            </div>

            <Button 
              type="submit" 
              className={`w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-xl shadow-emerald-900/40 text-lg font-black transition-all active:scale-95 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn size={22} />
                  <span>MASUK SEKARANG</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-emerald-100/50 text-sm font-medium">
              Belum punya akun? <button className="text-emerald-400 font-bold hover:underline">Hubungi Admin IT</button>
            </p>
          </div>
        </GlassCard>
        
        <p className="text-center mt-8 text-emerald-100/30 text-xs font-bold uppercase tracking-[0.2em]">
          &copy; 2026 PP. Wali Barokah - Kediri
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
