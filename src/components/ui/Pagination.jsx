import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  onItemsPerPageChange,
  totalItems
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = 5;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Menampilkan <span className="font-bold text-slate-700 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-slate-700 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="font-bold text-slate-700 dark:text-slate-200">{totalItems}</span> data
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Baris per halaman:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/50 cursor-pointer font-bold py-1.5 px-2 outline-none transition-all"
          >
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
              currentPage === page 
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-500' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
