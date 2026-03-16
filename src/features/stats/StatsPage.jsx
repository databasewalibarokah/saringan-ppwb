import React from 'react';
import { TrendingUp } from 'lucide-react';
import GlassCard from '../../components/GlassCard';

const StatsPage = () => {
  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Statistik</h1>
      
      {/* Overview Cards */}
      <GlassCard className="p-6 mb-6 bg-gradient-to-br from-emerald-600 to-emerald-800 border-none text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10">
           <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.2H4.8L12 5.8z"/></svg>
        </div>
        <div className="relative z-10">
          <p className="text-emerald-100 font-medium mb-1">Total Santri Dinilai (Bulan Ini)</p>
          <div className="flex items-end gap-3">
            <h2 className="text-5xl font-bold">84</h2>
            <span className="flex items-center text-sm bg-white/20 px-2 py-1 rounded-full mb-2">
              <TrendingUp size={14} className="mr-1" /> +12%
            </span>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Rata-rata Makna</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white text-emerald-600 dark:text-emerald-400">82.5</h3>
        </GlassCard>
        <GlassCard className="p-5 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Rata-rata Akhlak</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white text-amber-500">88.0</h3>
        </GlassCard>
      </div>

      {/* Chart Simulation */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Grafik Perkembangan</h2>
      <GlassCard className="p-6">
        <div className="flex items-end justify-between h-48 pb-6 border-b border-slate-200 dark:border-slate-700 gap-2">
          {[60, 75, 65, 80, 85, 82, 90].map((h, i) => (
            <div key={i} className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-t-md relative group">
              <div 
                className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md transition-all duration-1000 group-hover:bg-emerald-400"
                style={{ height: `${h}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs text-slate-400 font-medium">
          <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Aha</span>
        </div>
      </GlassCard>
    </div>
  );
};

export default React.memo(StatsPage);
