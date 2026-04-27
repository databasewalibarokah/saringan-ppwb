import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, UserCheck, MessageSquare, Save } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StickyBottomBar from '../../components/StickyBottomBar';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import { BACAAN_INITIAL_STATE } from '../../data/mockData';

const BacaanEvaluatePage = ({ 
  selectedStudents, 
  onBack, 
  onSubmit 
}) => {
  // Initialize evaluations for all selected students
  const [allEvaluations, setAllEvaluations] = useState(() => {
    const initial = {};
    selectedStudents.forEach(s => {
      initial[s.id] = { ...BACAAN_INITIAL_STATE };
    });
    return initial;
  });

  const [activeStudentId, setActiveStudentId] = useState(selectedStudents[0]?.id);

  // Get current student and their evaluation data
  const currentStudent = selectedStudents.find(s => s.id === activeStudentId);
  const currentEval = allEvaluations[activeStudentId] || { ...BACAAN_INITIAL_STATE };

  const updateField = useCallback((field, val) => {
    setAllEvaluations(prev => ({
      ...prev,
      [activeStudentId]: {
        ...prev[activeStudentId],
        [field]: val
      }
    }));
  }, [activeStudentId]);

  const handleSubmit = () => {
    onSubmit(allEvaluations);
  };

  return (
    <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-32 max-w-3xl mx-auto">
        <PageHeader title="Penilaian Bacaan" onBack={onBack} />

        {/* Selected Students Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {selectedStudents.map((student) => {
            const isActive = student.id === activeStudentId;
            const evalData = allEvaluations[student.id];
            const isDone = evalData.passed !== null;
            
            return (
              <GlassCard 
                key={student.id} 
                onClick={() => setActiveStudentId(student.id)}
                className={`p-4 min-w-[180px] flex gap-3 cursor-pointer transition-all active:scale-95 ${
                  isActive 
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20 ring-2 ring-cyan-500/20' 
                    : 'opacity-70'
                }`}
              >
                 <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                   isActive 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                 }`}>
                   {student.name.charAt(0)}
                   {isDone && (
                     <div className={`absolute -top-1 -right-1 w-5 h-5 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center animate-in zoom-in ${evalData.passed ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                       {evalData.passed ? <CheckCircle size={10} className="text-white" /> : <XCircle size={10} className="text-white" />}
                     </div>
                   )}
                 </div>
                 <div className="overflow-hidden flex-1">
                    <h4 className={`font-bold truncate text-sm ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {student.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Cocard: {student.cocard}</p>
                 </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Evaluation Form */}
        <AnimatePresence mode="wait">
          {currentStudent && (
            <motion.div
              key={activeStudentId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-6 mb-6">
                <div className="flex justify-between items-start mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">{currentStudent.name}</h3>
                    <p className="text-slate-500 font-medium">Santri {currentStudent.gender === 'L' ? 'Putra' : 'Putri'} • {currentStudent.camp}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                      Cocard: {currentStudent.cocard}
                    </span>
                  </div>
                </div>

                {/* Nilai Bacaan (Lulus/Tidak Lulus) */}
                <div className="mb-10">
                  <label className="block text-slate-700 dark:text-slate-200 font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="text-cyan-500" size={20} />
                    Nilai Bacaan
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateField('passed', true)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 ${
                        currentEval.passed === true
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }`}
                    >
                      <CheckCircle size={32} className={currentEval.passed === true ? 'text-white' : 'text-emerald-500'} />
                      <span className="mt-2 font-bold text-lg">LULUS</span>
                    </button>
                    <button
                      onClick={() => updateField('passed', false)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 ${
                        currentEval.passed === false
                          ? 'bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/20'
                          : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-700'
                      }`}
                    >
                      <XCircle size={32} className={currentEval.passed === false ? 'text-white' : 'text-rose-500'} />
                      <span className="mt-2 font-bold text-lg">TIDAK LULUS</span>
                    </button>
                  </div>
                </div>

                {/* Catatan (Optional) */}
                <div className="mb-8">
                  <label className="block text-slate-700 dark:text-slate-200 font-bold text-lg mb-3 flex items-center gap-2">
                    <MessageSquare className="text-cyan-500" size={20} />
                    Catatan <span className="text-slate-400 font-normal text-sm ml-1">(Opsional)</span>
                  </label>
                  <textarea 
                    rows="3" 
                    value={currentEval.note}
                    onChange={(e) => updateField('note', e.target.value)}
                    placeholder={`Tambahkan catatan untuk ${currentStudent.name}...`}
                    className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800 dark:text-white resize-none transition-all"
                  ></textarea>
                </div>

                {/* Guru Pengganti (Optional) */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-bold text-lg mb-3 flex items-center gap-2">
                    <UserCheck className="text-cyan-500" size={20} />
                    Guru Pengganti <span className="text-slate-400 font-normal text-sm ml-1">(Opsional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={currentEval.teacherProxy}
                    onChange={(e) => updateField('teacherProxy', e.target.value)}
                    placeholder="Nama guru penguji jika berbeda..."
                    className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800 dark:text-white transition-all"
                  />
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Bottom Action */}
        <StickyBottomBar>
          <div className="flex gap-4 w-full">
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progres</span>
              <div className="flex gap-1 mt-1">
                {selectedStudents.map(s => (
                  <div 
                    key={s.id} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      allEvaluations[s.id]?.passed !== null
                        ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              disabled={selectedStudents.some(s => allEvaluations[s.id].passed === null)}
            >
              <Save size={20} />
              Simpan Semua
            </Button>
          </div>
          {selectedStudents.some(s => allEvaluations[s.id].passed === null) && (
            <p className="text-[10px] text-center text-rose-500 font-bold mt-2 uppercase animate-pulse">
              Selesaikan semua penilaian untuk menyimpan
            </p>
          )}
        </StickyBottomBar>
      </div>
    </SwipeToBackWrapper>
  );
};

export default React.memo(BacaanEvaluatePage);
