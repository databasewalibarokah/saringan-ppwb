import React, { useState, useEffect } from 'react';
import { Users, Clock, BookOpen, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import MenuLink from '../../components/MenuLink';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const HomePage = ({ onNavigate, user, isAdmin }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ totalSantri: 0, andaSimak: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/saringan/peserta', token);
        const data = response.data || [];

        setStats({
          totalSantri: response.total || data.length || 0,
          andaSimak: data.filter(s => s.telah_disimak).length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {isAdmin && (
        <div className="mb-6">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
            <ArrowLeft size={18} />
            Kembali ke Admin Panel
          </Link>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Assalamualaikum,</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">{user?.nama ? `Ust. ${user.nama}` : 'Ustaz / Ustazah'}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <GlassCard className="p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <Users className="text-emerald-600 dark:text-emerald-400 mb-3" size={28} />
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {isLoading ? '...' : stats.totalSantri}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Santri Aktif</p>
        </GlassCard>

        <GlassCard className="p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <Clock className="text-amber-500 mb-3" size={28} />
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
            {isLoading ? '...' : stats.andaSimak}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Anda Simak</p>
        </GlassCard>
      </div>

      {/* Main Menu */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Menu Penilaian</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MenuLink
          icon={BookOpen}
          colorClass="emerald"
          title="Nilai Penyampaian"
          subtitle="Makna, Keterangan, dsb"
          onClick={() => {
            onNavigate('select', 'penyampaian');
          }}
        />

        <MenuLink
          icon={BookOpen}
          colorClass="cyan"
          title="Nilai Bacaan"
          subtitle="Tajwid, Kelancaran, dsb"
          onClick={() => {
            onNavigate('select', 'bacaan');
          }}
        />

        <MenuLink
          icon={Star}
          colorClass="amber"
          title="Nilai Akhlak"
          subtitle="Adab dan Prilaku Santri"
          onClick={() => {
            onNavigate('select', 'akhlak');
          }}
        />

        <MenuLink
          icon={Users}
          colorClass="blue"
          title="Daftar Peserta"
          subtitle="Lihat seluruh data santri"
          onClick={() => onNavigate('daftar-peserta')}
        />
      </div>
    </div>
  );
};

export default React.memo(HomePage);
