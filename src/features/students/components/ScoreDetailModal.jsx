import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, BarChart3 } from 'lucide-react';

const ScoreDetailModal = ({ 
  isOpen, 
  onClose, 
  teacherName, 
  scores 
}) => {
  if (!scores) return null;

  // Mock mapping if scores aren't provided in full
  const breakdown = [
    { label: 'Makna', value: scores.makna || 85, color: 'emerald' },
    { label: 'Keterangan', value: scores.keterangan || 80, color: 'blue' },
    { label: 'Penjelasan', value: scores.penjelasan || 90, color: 'amber' },
    { label: 'Pemahaman', value: scores.pemahaman || 85, color: 'rose' },
  ];

  const total = Math.round(breakdown.reduce((acc, curr) => acc + curr.value, 0) / breakdown.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-700/50 w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-0 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">Detail Penilaian</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{teacherName}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Score List */}
            <div className="p-8 space-y-6">
              {breakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{item.value}</span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                      className={`h-full bg-${item.color}-500 rounded-full`}
                    />
                  </div>
                </div>
              ))}
              
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rata-rata Nilai</span>
                <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                  {total}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/40 text-center">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-[0.98]"
              >
                Tutup Detail
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScoreDetailModal;
