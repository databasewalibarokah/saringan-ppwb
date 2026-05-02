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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: '' }

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const guruId = user.person_id || user.id; // Fallback to id if person_id missing
      
      const API_URL = 'https://sistem-ponpes-jagat.test/api/saringan/penilaian-bacaan';
      
      // We will submit each student evaluation sequentially
      for (const student of selectedStudents) {
        const evaluation = allEvaluations[student.id];
        
        const payload = {
          peserta_id: student.id,
          guru_id: evaluation.teacherProxy || guruId,
          nilai: evaluation.nilai, // Sends 'lulus' or 'tidak_lulus'
          materi: evaluation.materi || "Tes Bacaan",
          catatan: evaluation.note,
          kekurangan_tajwid: evaluation.kekurangan_tajwid,
          kekurangan_khusus: evaluation.kekurangan_khusus,
          kekurangan_keserasian: evaluation.kekurangan_keserasian,
          kekurangan_kelancaran: evaluation.kekurangan_kelancaran,
        };

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Gagal menyimpan penilaian untuk ${student.nama || student.name}`);
        }
      }

      setSubmitStatus({ type: 'success', message: 'Semua penilaian berhasil disimpan!' });
      setTimeout(() => {
        onSubmit(allEvaluations);
      }, 1500);
    } catch (err) {
      setSubmitStatus({ type: 'error', message: err.message });
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-32 max-w-3xl mx-auto">
        <PageHeader title="Penilaian Bacaan" onBack={onBack} />

        {/* Status Alert */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold border-2 ${
                submitStatus.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                  : 'bg-rose-50 border-rose-500 text-rose-700'
              }`}
            >
              {submitStatus.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
              {submitStatus.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Students Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {selectedStudents.map((student) => {
            const isActive = student.id === activeStudentId;
            const evalData = allEvaluations[student.id];
            const isDone = evalData.nilai !== null;
            
            return (
              <GlassCard 
                key={student.id} 
                onClick={() => setActiveStudentId(student.id)}
                className={`p-4 min-w-[180px] flex gap-3 cursor-pointer transition-all duration-300 active:scale-95 border-2 ${
                  isActive 
                    ? 'border-cyan-500 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-900/20 dark:to-blue-900/20 ring-4 ring-cyan-500/10' 
                    : 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 border-transparent'
                }`}
              >
                 <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                   isActive 
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 rotate-3' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                 }`}>
                   {(student.nama || student.name || 'S').charAt(0)}
                   {isDone && (
                     <div className={`absolute -top-2 -right-2 w-6 h-6 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-md ${evalData.nilai === 'lulus' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                       {evalData.nilai === 'lulus' ? <CheckCircle size={12} className="text-white" /> : <XCircle size={12} className="text-white" />}
                     </div>
                   )}
                 </div>
                 <div className="overflow-hidden flex-1">
                    <h4 className={`font-black truncate text-sm tracking-tight ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {student.nama || student.name}
                    </h4>
                    <p className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`}>ID: {student.id.substring(0, 5).toUpperCase()}</p>
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
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">{currentStudent.nama || currentStudent.name}</h3>
                    <p className="text-slate-500 font-medium">Santri {currentStudent.jenis_kelamin === 'laki-laki' || currentStudent.gender === 'L' ? 'Putra' : 'Putri'} • {currentStudent.status_mondok || currentStudent.camp}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                      ID: {currentStudent.id.substring(0, 5).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Score and Material Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Materi Bacaan</label>
                    <input 
                      type="text" 
                      value={currentEval.materi}
                      onChange={(e) => updateField('materi', e.target.value)}
                      placeholder="Contoh: Al-Baqarah"
                      className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800 dark:text-white font-bold transition-all"
                    />
                  </div>
                </div>

                {/* Nilai Bacaan (Lulus/Tidak Lulus) */}
                <div className="mb-10">
                  <label className="block text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <CheckCircle className="text-cyan-500" size={14} />
                    Status Kelulusan
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateField('nilai', 'lulus')}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-500 active:scale-95 group overflow-hidden ${
                        currentEval.nilai === 'lulus'
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/40 scale-[1.02]'
                          : 'bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }`}
                    >
                      {currentEval.nilai === 'lulus' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
                      )}
                      <div className={`p-4 rounded-2xl mb-2 transition-transform duration-500 group-hover:scale-110 ${currentEval.nilai === 'lulus' ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'}`}>
                        <CheckCircle size={32} />
                      </div>
                      <span className="font-black text-lg tracking-tight">LULUS</span>
                    </button>
                    
                    <button
                      onClick={() => updateField('nilai', 'tidak_lulus')}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-500 active:scale-95 group overflow-hidden ${
                        currentEval.nilai === 'tidak_lulus'
                          ? 'bg-rose-500 border-rose-400 text-white shadow-xl shadow-rose-500/40 scale-[1.02]'
                          : 'bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-700'
                      }`}
                    >
                      {currentEval.nilai === 'tidak_lulus' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50" />
                      )}
                      <div className={`p-4 rounded-2xl mb-2 transition-transform duration-500 group-hover:scale-110 ${currentEval.nilai === 'tidak_lulus' ? 'bg-white/20 text-white' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'}`}>
                        <XCircle size={32} />
                      </div>
                      <span className="font-black text-lg tracking-tight">TIDAK LULUS</span>
                    </button>
                  </div>
                </div>

                {/* Shortcomings (Modern UI) */}
                <AnimatePresence>
                  {currentEval.nilai === 'tidak_lulus' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-10"
                    >
                      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                            <XCircle className="text-rose-500" size={24} />
                          </div>
                          <div>
                            <h4 className="text-slate-800 dark:text-white font-black text-lg">Detail Kekurangan</h4>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pilih poin yang perlu diperbaiki</p>
                          </div>
                        </div>
                        
                        <div className="space-y-8">
                          {[
                            { 
                              key: 'kekurangan_tajwid', 
                              label: 'Tajwid', 
                              icon: '✨',
                              options: ['Dengung', 'Mad', 'Makhraj', 'Tafkhim-Tarqiq'] 
                            },
                            { 
                              key: 'kekurangan_khusus', 
                              label: 'Khusus', 
                              icon: '🎯',
                              options: ['Harakat', 'Lafadz', 'Lam Jalalah'] 
                            },
                            { 
                              key: 'kekurangan_keserasian', 
                              label: 'Keserasian', 
                              icon: '⚖️',
                              options: ['Panjang Pendek', 'Ikhtilash Huruf Sukun', 'Ikhtilash Huruf Syiddah'] 
                            },
                            { 
                              key: 'kekurangan_kelancaran', 
                              label: 'Kelancaran', 
                              icon: '🚀',
                              options: ['Kecepatan', 'Ketartilan'] 
                            }
                          ].map((cat) => (
                            <div key={cat.key} className="relative">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                  <span className="text-lg grayscale brightness-125">{cat.icon}</span> {cat.label}
                                </h5>
                                {currentEval[cat.key].length > 0 && (
                                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-black animate-in zoom-in">
                                    {currentEval[cat.key].length}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {cat.options.map(option => {
                                  const isSelected = currentEval[cat.key].includes(option);
                                  return (
                                    <button
                                      key={option}
                                      onClick={() => {
                                        const current = currentEval[cat.key];
                                        const next = isSelected 
                                          ? current.filter(i => i !== option) 
                                          : [...current, option];
                                        updateField(cat.key, next);
                                      }}
                                      className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 border-2 flex items-center gap-2 ${
                                        isSelected
                                          ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30 scale-[1.02]'
                                          : 'bg-white/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-200 dark:hover:border-rose-900 active:scale-95'
                                      }`}
                                    >
                                      {option}
                                      {isSelected && <CheckCircle size={14} className="animate-in slide-in-from-left-2" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                    placeholder={`Tambahkan catatan untuk ${currentStudent.nama || currentStudent.name}...`}
                    className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800 dark:text-white resize-none transition-all"
                  ></textarea>
                </div>

                {/* Guru Pengganti (Optional) */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-bold text-lg mb-3 flex items-center gap-2">
                    <UserCheck className="text-cyan-500" size={20} />
                    ID Guru Penguji <span className="text-slate-400 font-normal text-sm ml-1">(Opsional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={currentEval.teacherProxy}
                    onChange={(e) => updateField('teacherProxy', e.target.value)}
                    placeholder="Masukkan ID Guru jika berbeda..."
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
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      allEvaluations[s.id]?.nilai !== null
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                        : 'bg-slate-200 dark:bg-slate-700/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              className={`flex-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/20 border-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || selectedStudents.some(s => allEvaluations[s.id].nilai === null)}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </div>
              ) : (
                <>
                  <Save size={20} />
                  <span>Simpan Semua</span>
                </>
              )}
            </Button>
          </div>
          {!isSubmitting && selectedStudents.some(s => allEvaluations[s.id].nilai === null) && (
            <p className="text-[10px] text-center text-rose-500 font-black mt-2 uppercase tracking-tighter animate-pulse">
              Selesaikan semua penilaian untuk menyimpan
            </p>
          )}
        </StickyBottomBar>
      </div>
    </SwipeToBackWrapper>
  );
};

export default React.memo(BacaanEvaluatePage);
