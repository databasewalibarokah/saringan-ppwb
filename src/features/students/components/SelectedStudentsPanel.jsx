import React from 'react';
import StickyBottomBar from '../../../components/StickyBottomBar';
import Button from '../../../components/Button';

const SelectedStudentsPanel = ({ selectedStudents, onStartEvaluation }) => {
  if (selectedStudents.length === 0) return null;

  return (
    <StickyBottomBar>
      <div className="flex justify-between w-full items-center mb-3 px-2">
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          Terpilih: <strong className="text-emerald-600 dark:text-emerald-400 text-lg">{selectedStudents.length}</strong> santri
        </span>
        <div className="flex -space-x-3">
          {selectedStudents.slice(0, 3).map((s, i) => (
            <div 
              key={i} 
              className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 shadow-sm"
            >
              {(s.nama || s.name || 'S').charAt(0)}
            </div>
          ))}
          {selectedStudents.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
              +{selectedStudents.length - 3}
            </div>
          )}
        </div>
      </div>
      <Button onClick={onStartEvaluation}>
        Lihat Detail
      </Button>
    </StickyBottomBar>
  );
};

export default React.memo(SelectedStudentsPanel);
