import React from 'react';
import PageHeader from '../../components/PageHeader';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import StudentSearch from './components/StudentSearch';
import StudentFilter from './components/StudentFilter';
import StudentCard from './components/StudentCard';
import SelectedStudentsPanel from './components/SelectedStudentsPanel';
import { useStudentFilter } from './hooks/useStudentFilter';
import { MOCK_STUDENTS, FILTER_OPTIONS } from '../../data/mockData';

const DaftarPesertaPage = ({ 
  selectedStudents, 
  toggleStudent, 
  onBack, 
  onContinue 
}) => {
  // Use custom hook for search and filtering logic
  const { 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter, 
    filteredStudents 
  } = useStudentFilter(MOCK_STUDENTS);

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
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <p>Tidak ada santri yang cocok dengan pencarian.</p>
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
