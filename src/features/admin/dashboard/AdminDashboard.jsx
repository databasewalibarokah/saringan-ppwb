import React, { useState, useEffect } from 'react';
import { Users, Calendar, ShieldCheck, BarChart3, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import GlassCard from '../../../components/GlassCard';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    totalSantri: 0,
    periodeAktif: '...',
    sudahDites: 0,
    rataRata: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we'd have a dedicated stats endpoint
        // For now, let's fetch students to get a count
        const students = await api.get('/saringan/peserta', token);
        setStats({
          totalSantri: students.total || students.data?.length || 0,
          periodeAktif: 'Gelombang 1 2026',
          sudahDites: students.data?.filter(s => s.status_penilaian === 'lengkap').length || 0,
          rataRata: 85.5
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const cards = [
    { label: 'Total Peserta', value: stats.totalSantri, icon: Users, color: 'emerald', trend: '+12% dari kemarin' },
    { label: 'Periode Aktif', value: stats.periodeAktif, icon: Calendar, color: 'blue', trend: 'Sedang Berjalan' },
    { label: 'Sudah Dinilai', value: stats.sudahDites, icon: ShieldCheck, color: 'amber', trend: `${Math.round((stats.sudahDites / stats.totalSantri) * 100) || 0}% Progres` },
    { label: 'Rata-rata Nilai', value: stats.rataRata, icon: BarChart3, color: 'rose', trend: 'Sangat Baik' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Selamat datang kembali, {user?.nama}</p>
        </div>
        <Badge variant="emerald" className="py-2 px-4 text-sm">Sistem Online</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <GlassCard key={i} className="p-6 border-white/40 dark:border-slate-700/40 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${card.color}-500/10 text-${card.color}-600 dark:text-${card.color}-400`}>
                <card.icon size={24} />
              </div>
              <ArrowUpRight className="text-slate-300" size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
              {isLoading ? '...' : card.value}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <TrendingUp size={14} className="text-emerald-500" />
              {card.trend}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Aktivitas Terbaru</h2>
            <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-4">
             {[1, 2, 3].map((item) => (
               <GlassCard key={item} className="p-5 flex items-center justify-between border-transparent bg-white/50 dark:bg-slate-800/50">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden border-2 border-white dark:border-slate-600">
                     <img src={`https://i.pravatar.cc/150?u=${item}`} alt="user" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800 dark:text-white">
                        <span className="text-emerald-600">Admin</span> melakukan penilaian kepada <span className="text-blue-600">Santri Ahmad</span>
                     </p>
                     <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">15 Menit Yang Lalu</span>
                     </div>
                   </div>
                 </div>
                 <Badge variant="blue">Penilaian</Badge>
               </GlassCard>
             ))}
          </div>
        </div>

        {/* Quick Links / Info */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-slate-800 dark:text-white">Informasi Sistem</h2>
           <GlassCard className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-xl shadow-emerald-500/20">
              <h3 className="text-lg font-black mb-2">Periode Saringan</h3>
              <p className="text-sm text-emerald-50 font-medium opacity-90 mb-6">
                Pendaftaran dan penilaian Gelombang 1 tahun 2026 sedang berlangsung hingga 30 Juni.
              </p>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span>Progres Kelulusan</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-white rounded-full shadow-lg" />
                </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
