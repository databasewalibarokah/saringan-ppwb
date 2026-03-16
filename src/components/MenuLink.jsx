import React from 'react';
import { ChevronRight } from 'lucide-react';
import GlassCard from './GlassCard';

/**
 * A reusable menu item row with icon, title, subtitle, and chevron.
 * Extracted to reduce duplication in Home and Account pages.
 */
const MenuLink = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  colorClass = 'emerald', // emerald, amber, blue, purple, red, slate
  hideChevron = false
}) => {
  // Map color names to Tailwind utility class strings
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      hover: 'group-hover:text-emerald-500',
      hoverBg: ''
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/50',
      text: 'text-amber-600 dark:text-amber-400',
      hover: 'group-hover:text-amber-500',
      hoverBg: ''
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/50',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'group-hover:text-blue-500',
      hoverBg: ''
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/50',
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'group-hover:text-purple-500',
      hoverBg: ''
    },
    slate: {
      bg: 'bg-slate-100 dark:bg-slate-700',
      text: 'text-slate-600 dark:text-white',
      hover: '',
      hoverBg: 'hover:bg-white/40 dark:hover:bg-slate-800/40' // Used in AccountPage
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600',
      hover: '',
      hoverBg: 'hover:bg-red-50 dark:hover:bg-red-900/10' // Used for Logout
    }
  };

  const style = colorStyles[colorClass] || colorStyles.emerald;

  // Render as GlassCard for Home page style, or simple div for Account page style
  if (colorClass === 'slate' || colorClass === 'red' || colorClass === 'purple') {
    return (
      <div 
        onClick={onClick}
        className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${style.hoverBg} ${colorClass === 'red' ? 'text-red-600' : 'border-b border-slate-100 dark:border-slate-700/50'}`}
      >
        <div className={`p-3 rounded-xl ${style.bg} ${style.text}`}>
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${colorClass === 'red' ? '' : 'text-slate-800 dark:text-white'}`}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        {!hideChevron && <ChevronRight className="text-slate-400" />}
      </div>
    );
  }

  // Home page style
  return (
    <GlassCard onClick={onClick} className="p-5 flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${style.bg} ${style.text}`}>
          <Icon size={26} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {!hideChevron && <ChevronRight className={`text-slate-400 transition-colors ${style.hover}`} />}
    </GlassCard>
  );
};

export default React.memo(MenuLink);
