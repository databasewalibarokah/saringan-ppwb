import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StickyBottomBar from '../../components/StickyBottomBar';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import { MOCK_STUDENTS, FILTER_OPTIONS } from '../../data/mockData';

const SelectStudentPage = ({ 
  selectedStudents, 
  toggleStudent, 
  onBack, 
  onContinue 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Memoized filter calculation for performance on large lists
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.cocard.includes(searchQuery)
    );
  }, [searchQuery]);

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
          {filteredStudents.map(student => {
            const isSelected = selectedStudents.some(s => s.id === student.id);
            return (
              <GlassCard 
                key={student.id} 
                onClick={() => toggleStudent(student)}
                className={`p-4 flex items-center gap-4 ${isSelected ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{student.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cocard: {student.cocard} • {student.camp}</p>
                </div>
                <div className="text-slate-300">
                  {isSelected ? (
                    <CheckCircle className="text-emerald-500" size={28} />
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Selected Bottom Bar */}
        {selectedStudents.length > 0 && (
          <StickyBottomBar>
            <div className="flex justify-between w-full items-center mb-3 px-2">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Terpilih: <strong className="text-emerald-600 dark:text-emerald-400 text-lg">{selectedStudents.length}</strong> santri
              </span>
              <div className="flex -space-x-3">
                {selectedStudents.slice(0, 3).map((s, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-700">
                    {s.name.charAt(0)}
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
