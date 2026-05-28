import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Building2, Globe, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

const SuperAdminPonpesSwitcher = ({ className = '' }) => {
  const { token, selectedPonpesId, selectPonpes } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [ponpesList, setPonpesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset search query when dropdown closes
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchPonpes = async () => {
      if (!token) return;
      try {
        const response = await api.get('/options/ponpes', token);
        setPonpesList(response.data || response);
      } catch (err) {
        console.error('Failed to fetch ponpes list', err);
      }
    };
    fetchPonpes();
  }, [token]);

  useEffect(() => {
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

  const selectedPonpes = ponpesList.find(p => p.id === selectedPonpesId);

  const filteredPonpesList = ponpesList.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all text-sm font-bold shadow-sm"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedPonpesId === 'all' ? (
            <Globe size={18} className="text-emerald-500 flex-shrink-0" />
          ) : (
            <Building2 size={18} className="text-emerald-500 flex-shrink-0" />
          )}
          <span className="text-slate-700 dark:text-slate-200 truncate">
            {selectedPonpesId === 'all' ? 'Semua Pondok' : (selectedPonpes?.nama || 'Pilih Ponpes')}
          </span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full lg:w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2">Filter Pondok (Super Admin)</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Cari pondok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-emerald-500 transition-colors text-xs font-bold text-slate-700 dark:text-slate-200"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-2 px-2 space-y-1">
            {/* Opsi Semua Pondok */}
            {(!searchQuery || 'semua pondok'.includes(searchQuery.toLowerCase())) && (
              <>
                <button
                  onClick={() => handleSelectPonpes('all')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left ${
                    selectedPonpesId === 'all' ? 'bg-emerald-50 dark:bg-emerald-900/20 shadow-sm border border-emerald-100 dark:border-emerald-800/50' : 'border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedPonpesId === 'all' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <Globe size={16} />
                  </div>
                  <span className={`font-bold ${selectedPonpesId === 'all' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    Semua Pondok
                  </span>
                </button>
                <div className="my-2 border-b border-slate-100 dark:border-slate-700/50"></div>
              </>
            )}

            {/* Opsi Per Pondok */}
            {filteredPonpesList.length > 0 ? (
              filteredPonpesList.map((ponpes) => (
                <button
                  key={ponpes.id}
                  onClick={() => handleSelectPonpes(ponpes.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left ${
                    selectedPonpesId === ponpes.id ? 'bg-emerald-50 dark:bg-emerald-900/20 shadow-sm border border-emerald-100 dark:border-emerald-800/50' : 'border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedPonpesId === ponpes.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <Building2 size={16} />
                  </div>
                  <div className="truncate">
                    <span className={`font-bold text-sm block truncate ${selectedPonpesId === ponpes.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {ponpes.nama}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs font-bold text-slate-400">Pondok tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPonpesSwitcher;
