import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, CheckCircle, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StickyBottomBar from '../../components/StickyBottomBar';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';

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
  const [genderFilter, setGenderFilter] = useState('Semua');
  const [simakanFilter, setSimakanFilter] = useState('Semua');
  
  // Pagination and Scroll State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const API_URL = 'https://generus.app/api/saringan/peserta';
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

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genderFilter, simakanFilter]);

  // Memoized filter calculation for performance on large lists
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
      const simakanCount = s.jumlah_simakan !== undefined ? s.jumlah_simakan : (s.evaluasi_penyampaian?.length || s.evaluasi_bacaan?.length || 0);

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

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredStudents, currentPage]);

  const genderOptions = [
    { label: 'Semua', value: 'Semua' },
    { label: 'Putra', value: 'L' },
    { label: 'Putri', value: 'P' }
  ];

  const simakanOptions = ['Semua', '0', '1', '2', '3+'];

  return (
    <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-32">
        <PageHeader title="Pilih Santri" onBack={onBack} />

        {/* Sticky Search & Filter Container */}
        <div className="sticky top-0 z-30 pt-2 pb-4 mb-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 -mx-4 px-4 sm:-mx-8 sm:px-8">
          {/* Search */}
          <div className="mb-4 relative">
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
          <div className="space-y-4">
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
              const simakanCount = student.jumlah_simakan !== undefined ? student.jumlah_simakan : (student.evaluasi_penyampaian?.length || student.evaluasi_bacaan?.length || 0);

              return (
                <GlassCard
                  key={student.id}
                  onClick={() => toggleStudent(student)}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${isSelected ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10' : ''}`}
                >
                  {student.foto_identitas ? (
                    <img 
                      src={student.foto_identitas} 
                      alt={displayName}
                      className={`w-12 h-12 flex-shrink-0 rounded-full object-cover transition-all 
                        ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 shadow-sm' : 'border border-slate-200 dark:border-slate-700'}`}
                    />
                  ) : (
                    <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${isSelected ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                      {(displayName || 'S').charAt(0)}
                    </div>
                  )}
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
            <div className="col-span-full text-center py-20 bg-white/30 dark:bg-slate-800/30 rounded-3xl border border-white/50 dark:border-slate-700/50 backdrop-blur-sm">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {searchQuery ? 'Tidak ada santri yang cocok dengan pencarian.' : 'Belum ada data peserta saringan.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="col-span-full flex items-center justify-between mt-8 bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/60 dark:border-slate-700/60 backdrop-blur-sm">
            <button 
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm font-medium text-sm"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Hal <span className="text-slate-800 dark:text-white font-bold">{currentPage}</span> / {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm font-medium text-sm"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-28 right-6 p-3 bg-emerald-600 text-white rounded-full shadow-xl hover:bg-emerald-500 active:scale-95 transition-all z-40 flex items-center justify-center"
            aria-label="Kembali ke atas"
          >
            <ArrowUp size={24} />
          </button>
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
