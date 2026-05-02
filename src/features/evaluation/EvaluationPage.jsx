import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Loader2, AlertCircle, RefreshCw, Save, MessageSquare, UserCheck, BookOpen } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StickyBottomBar from '../../components/StickyBottomBar';
import ScoreCardInput from './components/ScoreCardInput';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import { MOCK_EVALUATION_HISTORY, INITIAL_SCORES } from '../../data/mockData';

const EvaluationPage = ({ 
  selectedStudents, 
  onBack, 
  onSubmit 
}) => {
  // Initialize scores for all selected students
  const [allEvaluations, setAllEvaluations] = useState(() => {
    const initial = {};
    selectedStudents.forEach(s => {
      initial[s.id] = { 
        ...INITIAL_SCORES, 
        materi: '',
        note: '',
        teacherProxy: '',
        isDirty: false // to track completion
      };
    });
    return initial;
  });

  const [activeStudentId, setActiveStudentId] = useState(selectedStudents[0]?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  // Get current student and their evaluation data
  const currentStudent = selectedStudents.find(s => s.id === activeStudentId);
  const currentEval = allEvaluations[activeStudentId] || { ...INITIAL_SCORES, note: '', teacherProxy: '', materi: '' };

  const updateScore = useCallback((field, val) => {
    setAllEvaluations(prev => ({
      ...prev,
      [activeStudentId]: {
        ...prev[activeStudentId],
        [field]: val,
        isDirty: true
      }
    }));
  }, [activeStudentId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const guruId = user.person_id || user.id;
      
      const API_URL = 'https://sistem-ponpes-jagat.test/api/saringan/penilaian-penyampaian';
      
      // We will submit each student evaluation sequentially
      for (const student of selectedStudents) {
        const evaluation = allEvaluations[student.id];
        
        const payload = {
          peserta_id: student.id,
          guru_id: evaluation.teacherProxy || guruId,
          materi: evaluation.materi || "Penyampaian",
          catatan: evaluation.note || "",
          nilai_makna: evaluation.makna || 0,
          nilai_keterangan: evaluation.keterangan || 0,
          nilai_penjelasan: evaluation.penjelasan || 0,
          nilai_pemahaman: evaluation.pemahaman || 0
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

      setSubmitStatus({ type: 'success', message: 'Semua penilaian penyampaian berhasil disimpan!' });
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
        <PageHeader title="Penilaian Penyampaian" onBack={onBack} />

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
              {submitStatus.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              {submitStatus.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Students Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {selectedStudents.map((student) => {
            const isActive = student.id === activeStudentId;
            const evalData = allEvaluations[student.id];
            const isDone = evalData?.makna !== null && 
                           evalData?.keterangan !== null && 
                           evalData?.penjelasan !== null && 
                           evalData?.pemahaman !== null;
            
            return (
              <GlassCard 
                key={student.id} 
                onClick={() => setActiveStudentId(student.id)}
                className={`p-4 min-w-[200px] flex gap-3 cursor-pointer transition-all active:scale-95 ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/20' 
                    : 'opacity-70 grayscale-[0.3]'
                }`}
              >
                 <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-colors ${
                   isActive 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                 }`}>
                   {(student.nama || student.name || 'S').charAt(0)}
                   {isDone && (
                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center animate-in zoom-in">
                       <CheckCircle size={10} className="text-white" />
                     </div>
                   )}
                 </div>
                 <div className="overflow-hidden flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold truncate ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {student.nama || student.name}
                      </h4>
                      {isDone ? (
                        <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-black uppercase whitespace-nowrap ml-2">Sudah</span>
                      ) : (
                        <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-black uppercase whitespace-nowrap ml-2">Belum</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">ID: {student.id.substring(0, 5).toUpperCase()}</p>
                 </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Evaluation Form for Active Student */}
        <AnimatePresence mode="wait">
          {currentStudent && (
            <motion.div
              key={activeStudentId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <GlassCard className="p-6 mb-6">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Form: {currentStudent.nama || currentStudent.name}</h3>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-500 uppercase">
                    {currentStudent.status_mondok || currentStudent.camp || 'Reguler'}
                  </span>
                </div>

                {/* Materi Input */}
                <div className="mb-8">
                  <label className="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                    <BookOpen size={16} /> Materi Penyampaian
                  </label>
                  <input 
                    type="text" 
                    value={currentEval.materi}
                    onChange={(e) => updateScore('materi', e.target.value)}
                    placeholder="Contoh: Al-Baqarah"
                    className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white font-bold transition-all"
                  />
                </div>
                
                <div className="space-y-6">
                  <ScoreCardInput 
                    label="Nilai Makna" 
                    value={currentEval.makna} 
                    onChange={(val) => updateScore('makna', val)} 
                  />
                  <ScoreCardInput 
                    label="Nilai Keterangan" 
                    value={currentEval.keterangan} 
                    onChange={(val) => updateScore('keterangan', val)} 
                  />
                  <ScoreCardInput 
                    label="Nilai Penjelasan" 
                    value={currentEval.penjelasan} 
                    onChange={(val) => updateScore('penjelasan', val)} 
                  />
                  <ScoreCardInput 
                    label="Nilai Pemahaman" 
                    value={currentEval.pemahaman} 
                    onChange={(val) => updateScore('pemahaman', val)} 
                  />
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-bold text-lg mb-3 flex items-center gap-2">
                      <MessageSquare className="text-emerald-500" size={20} />
                      Catatan Penguji <span className="text-slate-400 font-normal text-sm ml-1">(Opsional)</span>
                    </label>
                    <textarea 
                      rows="3" 
                      value={currentEval.note}
                      onChange={(e) => updateScore('note', e.target.value)}
                      placeholder={`Tambahkan catatan khusus untuk ${currentStudent.nama || currentStudent.name}...`}
                      className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white resize-none transition-all"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-bold text-lg mb-3 flex items-center gap-2">
                      <UserCheck className="text-emerald-500" size={20} />
                      ID Guru Penguji <span className="text-slate-400 font-normal text-sm ml-1">(Opsional)</span>
                    </label>
                    <input 
                      type="text" 
                      value={currentEval.teacherProxy}
                      onChange={(e) => updateScore('teacherProxy', e.target.value)}
                      placeholder="Masukkan ID Guru jika mewakili..."
                      className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* History - Showing global history but could be filtered if we had per-student mock history */}
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 mt-8 flex items-center gap-2">
                <Calendar className="text-emerald-500" size={22} /> Riwayat Penilaian Terbaru
              </h3>
              <div className="space-y-3 mb-8">
                {MOCK_EVALUATION_HISTORY.map((hist, i) => (
                  <GlassCard key={i} className="p-4 flex justify-between items-center">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Calendar size={20} className="text-slate-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{hist.type}</h4>
                        <p className="text-xs text-slate-500">{hist.date} • {hist.teacher}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400">{hist.avg}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Bottom Action */}
        <StickyBottomBar>
          <div className="flex gap-4 w-full">
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Progress</span>
              <div className="flex gap-1 mt-1">
                {selectedStudents.map(s => (
                  <div 
                    key={s.id} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      allEvaluations[s.id]?.makna !== null && 
                      allEvaluations[s.id]?.keterangan !== null && 
                      allEvaluations[s.id]?.penjelasan !== null && 
                      allEvaluations[s.id]?.pemahaman !== null 
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <Button 
              onClick={handleSubmit} 
              className={`flex-1 bg-emerald-600 hover:bg-emerald-500 ${isSubmitting ? 'opacity-70' : ''}`}
              disabled={isSubmitting || selectedStudents.some(s => 
                allEvaluations[s.id]?.makna === null || 
                allEvaluations[s.id]?.keterangan === null || 
                allEvaluations[s.id]?.penjelasan === null || 
                allEvaluations[s.id]?.pemahaman === null
              )}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {isSubmitting ? 'Menyimpan...' : 'Submit Semua'}
            </Button>
          </div>
        </StickyBottomBar>
      </div>
    </SwipeToBackWrapper>
  );
};

export default React.memo(EvaluationPage);
