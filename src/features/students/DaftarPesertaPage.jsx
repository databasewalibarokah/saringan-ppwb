import React from 'react';
import PageHeader from '../../components/PageHeader';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import StudentSearch from './components/StudentSearch';
import StudentFilter from './components/StudentFilter';
import StudentCard from './components/StudentCard';
import SelectedStudentsPanel from './components/SelectedStudentsPanel';
import { useStudentFilter } from './hooks/useStudentFilter';
import { useStudents } from './hooks/useStudents';
import { FILTER_OPTIONS as MOCK_FILTER_OPTIONS } from '../../data/mockData';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const DaftarPesertaPage = ({ 
  selectedStudents, 
  toggleStudent, 
  onBack, 
  onContinue 
}) => {
  const { students, loading, error, refresh } = useStudents();

  // Use custom hook for search and filtering logic
  const { 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter, 
    filteredStudents 
  } = useStudentFilter(students);

  // If there's no camp data in API, we might want to filter by status or gender only
  // For now, keep mock filters but handle them gracefully in the filter logic
  const filterOptions = MOCK_FILTER_OPTIONS;

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
            options={filterOptions} 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </div>

        {/* State Handling (Loading/Error/Empty) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-in fade-in duration-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
            <p className="font-medium">Memuat daftar peserta...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Terjadi Kesalahan</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">{error}</p>
            <button 
              onClick={refresh}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw size={18} />
              Coba Lagi
            </button>
          </div>
        ) : (
          /* Student List Module */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.length > 0 ? (
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
              <div className="flex flex-col items-center justify-center py-16 col-span-full text-slate-500 dark:text-slate-400">
                <p className="text-lg font-medium">Tidak ada peserta ditemukan.</p>
                <p className="text-sm">Coba sesuaikan pencarian atau filter Anda.</p>
              </div>
            )}
          </div>
        )}

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
