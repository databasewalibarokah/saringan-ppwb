import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import StudentSearch from './components/StudentSearch';
import StudentFilter from './components/StudentFilter';
import StudentCard from './components/StudentCard';
import SelectedStudentsPanel from './components/SelectedStudentsPanel';
import { useStudentFilter } from './hooks/useStudentFilter';
import { FILTER_OPTIONS } from '../../data/mockData';

const DaftarPesertaPage = ({ 
  selectedStudents, 
  toggleStudent, 
  onBack, 
  onContinue 
}) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this would be an environment variable
      const API_URL = 'https://sistem-ponpes-jagat.test/api/saringan/peserta';
      
      // Get token from localStorage (assuming Sanctum/Bearer token)
      const token = localStorage.getItem('token') || ''; // Adjust based on where you store the token

      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Ponpes-Id': '01JGFJJZ000000000000000001', // Replace with real Ponpes ID or get from user context
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Gagal mengambil data peserta`);
      }

      const result = await response.json();
      // The API returns a paginated object, so the data is in result.data
      setStudents(result.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Use custom hook for search and filtering logic on the fetched data
  const { 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter, 
    filteredStudents 
  } = useStudentFilter(students);

  return (
    <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-32">
        <PageHeader title="Daftar Peserta" onBack={onBack} />

        {/* Search Module */}
        <div className="mb-6">
          <StudentSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filter Module */}
        <div className="mb-6">
          <StudentFilter 
            options={FILTER_OPTIONS} 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </div>

        {/* Student List Module */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
              <p className="font-medium">Mengambil data peserta...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-16 px-6 text-center">
              <div className="inline-flex p-4 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Terjadi Kesalahan</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
              <button 
                onClick={fetchStudents}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
              >
                <RefreshCw size={18} />
                Coba Lagi
              </button>
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const isSelected = selectedStudents.some(s => s.id === student.id);
              return (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  isSelected={isSelected} 
                  onToggleSelect={toggleStudent} 
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white/30 dark:bg-slate-800/30 rounded-3xl border border-white/50 dark:border-slate-700/50 backdrop-blur-sm">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {searchQuery || activeFilter !== 'Semua' 
                  ? 'Tidak ada santri yang cocok dengan pencarian.' 
                  : 'Belum ada data peserta untuk periode ini.'}
              </p>
            </div>
          )}
        </div>

        {/* Selected Students Panel / Action Bar */}
        <SelectedStudentsPanel 
          selectedStudents={selectedStudents} 
          onStartEvaluation={onContinue} 
        />
      </div>
    </SwipeToBackWrapper>
  );
};

export default React.memo(DaftarPesertaPage);
