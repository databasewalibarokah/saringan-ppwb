import React from 'react';
import { Edit3, Award, Moon, Sun, LogOut } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import MenuLink from '../../components/MenuLink';

const AccountPage = ({ darkMode, toggleDarkMode, user, onLogout }) => {
  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Akun</h1>
      
      <GlassCard className="p-6 mb-8 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/30">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user?.name || 'User'}</h2>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">{(user?.role === 'admin' ? 'Penguji Utama' : 'Penguji') || 'Penguji'} • Camp A</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="overflow-hidden flex flex-col h-full">
          <MenuLink 
            icon={Edit3}
            colorClass="slate"
            title="Edit Profil"
            onClick={() => {}}
          />
          
          <MenuLink 
            icon={Award}
            colorClass="slate"
            title="Riwayat Penilaian"
            onClick={() => {}}
          />

          {/* Custom row with switch for Dark Mode */}
          <div 
            onClick={toggleDarkMode}
            className="p-4 flex items-center gap-4 hover:bg-white/40 dark:hover:bg-slate-800/40 cursor-pointer transition-colors border-slate-100 dark:border-slate-700/50"
          >
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-white">
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Tema Tampilan</h3>
              <p className="text-sm text-slate-500">{darkMode ? 'Mode Gelap' : 'Mode Terang'}</p>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden lg:h-fit">
          <MenuLink 
            icon={LogOut}
            colorClass="red"
            title="Keluar Aplikasi"
            hideChevron={true}
            onClick={onLogout}
          />
        </GlassCard>
      </div>
    </div>
  );
};

export default React.memo(AccountPage);
