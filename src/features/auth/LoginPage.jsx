import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { login, clearError } from '../../store/slices/authSlice';
import GlassCard from '../../components/GlassCard';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isAnimating, setIsAnimating] = useState(false);
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Show animation on mount
    setIsAnimating(true);
    // Clear any previous errors when mounting
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md transition-all duration-700 transform ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* App Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30 mb-4 animate-bounce-subtle">
            <LogIn className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Masuk ke Aplikasi</h1>
          <p className="text-slate-500 dark:text-slate-400">Gunakan akun Anda untuk melanjutkan</p>
        </div>

        {/* Login Card */}
        <GlassCard className="p-8 border-white/20 dark:border-slate-700/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">Lupa password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Masuk</span>
                  <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Footer Info */}
        <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
          Saringan PPWB &copy; {new Date().getFullYear()} • Premium Experience
        </p>
      </div>
      
      {/* Decorative Blobs (Mirroring AppLayout but simplified for Login) */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default LoginPage;
