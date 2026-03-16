import React from 'react';
import GlassCard from './GlassCard';
import { NAV_TABS } from '../constants/navigation';

const BottomNavigation = ({ currentTab, onTabChange }) => (
  <div className="fixed bottom-0 left-0 right-0 max-w-6xl mx-auto z-40 px-6 sm:px-10 md:px-14 lg:px-20 pb-6 pt-4 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent">
    <GlassCard className="flex justify-around items-center p-2 px-4 shadow-xl shadow-emerald-900/5">
      {NAV_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.key;
        
        return (
          <button 
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-20 
              ${isActive 
                ? 'text-emerald-600 dark:text-emerald-400 scale-110 font-bold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            aria-label={tab.label}
          >
            <Icon size={24} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </GlassCard>
  </div>
);

export default React.memo(BottomNavigation);
