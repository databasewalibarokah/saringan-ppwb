import React from 'react';
import { CheckCircle } from 'lucide-react';
import GlassCard from '../../../components/GlassCard';

/**
 * Modern card layout for displaying student information.
 * Supports multi-select checkbox behavior.
 */
const StudentCard = ({ student, isSelected, onToggleSelect }) => {
  // Map API fields if present, otherwise fallback to mock fields
  const displayName = student.nama || student.name;
  const displayGender = student.jenis_kelamin === 'laki-laki' || student.gender === 'L' ? 'Ikhwan' : 'Akhwat';
  const displayCamp = student.camp || student.status_mondok || 'Reguler';
  const displayCocard = student.cocard || student.id.substring(0, 5).toUpperCase();
  const isEvaluated = student.telah_disimak !== undefined ? student.telah_disimak : (student.id % 2 === 0);

  return (
    <GlassCard 
      onClick={() => onToggleSelect(student)}
      className={`p-4 flex items-center gap-4 transition-all duration-300 relative overflow-hidden group 
        ${isSelected ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-md shadow-emerald-500/10' : ''}`}
    >
      {/* Decorative gradient blob for selected state */}
      {isSelected && (
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></div>
      )}

      {/* Avatar */}
      {student.foto_identitas ? (
        <img 
          src={student.foto_identitas} 
          alt={displayName}
          className={`w-12 h-12 flex-shrink-0 rounded-full object-cover transition-all 
            ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 shadow-lg shadow-emerald-500/30' : 'border border-slate-200 dark:border-slate-700'}`}
        />
      ) : (
        <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-lg font-bold transition-colors 
          ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}
        >
          {displayName.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight truncate">
          {displayName}
        </h3>
        
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {displayCocard}
          </span>
          <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {displayGender}
          </span>
          <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {displayCamp}
          </span>
        </div>

        {/* Evaluation Status Badge */}
        <div className="mt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
            ${isEvaluated 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' 
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
            }`}
          >
            {isEvaluated ? 'Sudah Disimak' : 'Belum Disimak'}
          </span>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex-shrink-0 pl-2">
        {isSelected ? (
          <CheckCircle className="text-emerald-500" size={28} strokeWidth={2.5} />
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-300 transition-colors" />
        )}
      </div>
    </GlassCard>
  );
};

export default React.memo(StudentCard);
