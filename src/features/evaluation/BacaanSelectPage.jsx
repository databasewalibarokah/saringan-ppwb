import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, CheckCircle, Users, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StickyBottomBar from '../../components/StickyBottomBar';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';

const BacaanSelectPage = ({ 
  selectedStudents, 
  toggleStudent, 
  onBack, 
  onContinue 
}) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('Semua'); // Semua, L, P
  const [simakanFilter, setSimakanFilter] = useState('Semua'); // Semua, 0, 1, 2, 3+
  const [visibleCount, setVisibleCount] = useState(20);

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
          'X-Ponpes-Id': '01JGFJJZ000000000000000001',
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

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [searchQuery, genderFilter, simakanFilter]);

  // Memoized filter calculation
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];

    return students.filter(s => {
      const name = (s.nama || s.name || '').toLowerCase();
      const cocard = (s.cocard || s.id || '').toString();
      const search = searchQuery.toLowerCase();
      
      const matchesSearch = name.includes(search) || cocard.includes(search);
      
      // Map API gender (laki-laki/perempuan) to filter value (L/P)
      const apiGender = s.jenis_kelamin === 'laki-laki' ? 'L' : (s.jenis_kelamin === 'perempuan' ? 'P' : s.gender);
      const matchesGender = genderFilter === 'Semua' || apiGender === genderFilter;
      
      // Determine simakan count from API (might be jumlah_simakan or length of evaluasi array)
      const simakanCount = s.jumlah_simakan !== undefined ? s.jumlah_simakan : (s.evaluasi_bacaan?.length || 0);
      
      let matchesSimakan = true;
      if (simakanFilter !== 'Semua') {
        if (simakanFilter === '3+') {
          matchesSimakan = simakanCount >= 3;
        } else {
          matchesSimakan = simakanCount === parseInt(simakanFilter);
        }
      }

      return matchesSearch && matchesGender && matchesSimakan;
    });
  }, [students, searchQuery, genderFilter, simakanFilter]);

  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(0, visibleCount);
  }, [filteredStudents, visibleCount]);

  const genderOptions = [
    { label: 'Semua', value: 'Semua' },
    { label: 'Putra', value: 'L' },
    { label: 'Putri', value: 'P' }
  ];

  const simakanOptions = ['Semua', '0', '1', '2', '3+'];

  return (
    <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-32">
        <PageHeader title="Pilih Santri (Tes Bacaan)" onBack={onBack} />

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama atau no. cocard..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-lg"
          />
        </div>

        {/* Filters Section */}
        <div className="space-y-4 mb-8">
          {/* Gender Filter */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Filter Gender</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {genderOptions.map((opt) => (
                <button 
                  key={opt.value} 
                  onClick={() => setGenderFilter(opt.value)}
                  className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all border
                    ${genderFilter === opt.value 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105' 
                      : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-white/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simakan Filter */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Jumlah Simakan</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {simakanOptions.map((opt) => (
                <button 
                  key={opt} 
                  onClick={() => setSimakanFilter(opt)}
                  className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all border
                    ${simakanFilter === opt 
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-md scale-105' 
                      : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-white/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80'
                    }`}
                >
                  {opt === 'Semua' ? 'Semua' : `${opt} Kali`}
                </button>
              ))}
            </div>
          </div>
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
              const displayGender = student.jenis_kelamin === 'laki-laki' || student.gender === 'L' ? 'Putra' : 'Putri';
              const simakanCount = student.jumlah_simakan !== undefined ? student.jumlah_simakan : (student.evaluasi_bacaan?.length || 0);

              return (
                <GlassCard 
                  key={student.id} 
                  onClick={() => toggleStudent(student)}
                  className={`p-4 flex items-center gap-4 transition-all cursor-pointer active:scale-[0.98] ${isSelected ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                    {(displayName || 'S').charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden min-w-0">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight truncate">{displayName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap">
                        {displayGender}
                      </span>
                      <span className="text-[10px] bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap">
                        {simakanCount} Simakan
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">ID: {student.id.substring(0, 5).toUpperCase()}</p>
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
            <div className="col-span-full py-20 text-center bg-white/30 dark:bg-slate-800/30 rounded-3xl border border-white/50 dark:border-slate-700/50 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <Users className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tidak ada santri ditemukan</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
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
                {selectedStudents.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    +{selectedStudents.length - 3}
                  </div>
                )}
              </div>
            </div>
            <Button onClick={onContinue}>
              Lanjut ke Penilaian
            </Button>
          </StickyBottomBar>
        )}
      </div>
    </SwipeToBackWrapper>
  );
};

export default React.memo(BacaanSelectPage);
