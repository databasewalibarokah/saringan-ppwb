import React from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const PonpesSwitcher = ({ className = '' }) => {
  const { user, selectedPonpesId, selectPonpes, accessiblePonpes } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Get ponpes details from user data
  const ponpesList = user?.ponpes_aktif?.filter(p => accessiblePonpes.includes(p.id)) || [];
  const selectedPonpes = ponpesList.find(p => p.id === selectedPonpesId);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPonpes = (ponpesId) => {
    selectPonpes(ponpesId);
    setIsOpen(false);
    // Refresh the page to reload data with new ponpes context
    window.location.reload();
  };

  if (ponpesList.length <= 1) {
    // Only one ponpes, no need to show switcher
    return null;
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all text-sm font-medium"
      >
        <Building2 size={16} className="text-emerald-500" />
        <span className="text-slate-700 dark:text-slate-200 truncate max-w-[150px]">
          {selectedPonpes?.nama || 'Pilih Ponpes'}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilih Pondok Pesantren</p>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {ponpesList.map((ponpes) => (
              <button
                key={ponpes.id}
                onClick={() => handleSelectPonpes(ponpes.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left ${
                  selectedPonpesId === ponpes.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${selectedPonpesId === ponpes.id ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span className={`font-medium ${selectedPonpesId === ponpes.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {ponpes.nama}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PonpesSwitcher;