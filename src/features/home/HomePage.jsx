import React from 'react';
import { Users, Clock, BookOpen, Star } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import MenuLink from '../../components/MenuLink';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Ahlan wa Sahlan,</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Ust. Ahmad Muzakki</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <GlassCard className="p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
          <Users className="text-emerald-600 dark:text-emerald-400 mb-3" size={28} />
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">142</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Santri Aktif</p>
        </GlassCard>
        
        <GlassCard className="p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          <Clock className="text-amber-500 mb-3" size={28} />
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">12</h3>
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
