import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, CheckCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StickyBottomBar from '../../components/StickyBottomBar';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import { FILTER_OPTIONS } from '../../data/mockData';

const SelectStudentPage = ({ 
  selectedStudents, 
  toggleStudent, 
  onBack, 
  onContinue 
}) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const API_URL = 'https://sistem-ponpes-jagat.test/api/saringan/peserta';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Ponpes-Id': '01JGFJJZ000000000000000001', // Example ID
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data peserta saringan');
      }

      const result = await response.json();
      setStudents(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery]);

  // Memoized filter calculation for performance on large lists
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];
    
    return students.filter(s => {
      const name = (s.nama || s.name || '').toLowerCase();
      const cocard = (s.cocard || s.id || '').toString();
      const search = searchQuery.toLowerCase();
      
      return name.includes(search) || cocard.includes(search);
    });
  }, [students, searchQuery]);

  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(0, visibleCount);
  }, [filteredStudents, visibleCount]);

  return (
    <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-32">
        <PageHeader title="Pilih Santri" onBack={onBack} />

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama atau no. cocard..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-lg"
            />
          </div>
          <button 
            aria-label="Filter"
            className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl text-slate-600 dark:text-slate-300 shadow-sm active:scale-95 transition-transform"
          >
            <Filter size={24} />
          </button>
        </div>

        {/* Filters Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_OPTIONS.map((filter, i) => (
            <button 
              key={i} 
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors 
                ${i === 0 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-white/50 dark:border-slate-700/50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Student List Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
              <p className="font-bold">Mengambil data santri...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-16 px-6 text-center">
              <div className="inline-flex p-4 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Gagal Memuat Data</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
              <button 
                onClick={fetchStudents}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
              >
                <RefreshCw size={18} />
                Coba Lagi
              </button>
            </div>
          ) : paginatedStudents.length > 0 ? (
            paginatedStudents.map(student => {
              const isSelected = selectedStudents.some(s => s.id === student.id);
              const displayName = student.nama || student.name;
              const displayGender = student.jenis_kelamin === 'laki-laki' || student.gender === 'L' ? 'Ikhwan' : 'Akhwat';
              const displayInfo = `${displayGender} • ${student.status_mondok || student.camp || 'Reguler'}`;
              
              return (
                <GlassCard 
                  key={student.id} 
                  onClick={() => toggleStudent(student)}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${isSelected ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                    {(displayName || 'S').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight truncate">{displayName}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-black tracking-widest truncate">{displayInfo}</p>
                  </div>
                  <div className="text-slate-300 flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle className="text-emerald-500" size={28} strokeWidth={2.5} />
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                </GlassCard>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white/30 dark:bg-slate-800/30 rounded-3xl border border-white/50 dark:border-slate-700/50 backdrop-blur-sm">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {searchQuery ? 'Tidak ada santri yang cocok dengan pencarian.' : 'Belum ada data peserta saringan.'}
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredStudents.length > visibleCount && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="w-full sm:w-auto px-8"
            >
              Muat Lebih Banyak ({filteredStudents.length - visibleCount} lagi)
            </Button>
          </div>
        )}

        {/* Selected Bottom Bar */}
        {selectedStudents.length > 0 && (
          <StickyBottomBar>
            <div className="flex justify-between w-full items-center mb-3 px-2">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Terpilih: <strong className="text-emerald-600 dark:text-emerald-400 text-lg">{selectedStudents.length}</strong> santri
              </span>
              <div className="flex -space-x-3">
                {selectedStudents.slice(0, 3).map((s, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {(s.nama || s.name || 'S').charAt(0)}
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={onContinue}>
              Mulai Penilaian
            </Button>
          </StickyBottomBar>
        )}
      </div>
    </SwipeToBackWrapper>
  );
};

export default React.memo(SelectStudentPage);
