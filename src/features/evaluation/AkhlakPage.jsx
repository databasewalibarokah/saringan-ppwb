import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, User, Award, MessageSquare } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import StickyBottomBar from '../../components/StickyBottomBar';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import { MOCK_EVALUATION_HISTORY } from '../../data/mockData';

const AkhlakPage = ({ 
  selectedStudents, 
  onBack, 
  onSubmit 
}) => {
  // Initialize notes for all selected students
  const [notes, setNotes] = useState(() => {
    const initial = {};
    selectedStudents.forEach(s => {
      initial[s.id] = '';
    });
    return initial;
  });

  const [activeStudentId, setActiveStudentId] = useState(selectedStudents[0]?.id);

  // Get current student and their note
  const currentStudent = selectedStudents.find(s => s.id === activeStudentId);
  const currentNote = notes[activeStudentId] || '';

  const handleNoteChange = (newNote) => {
    setNotes(prev => ({
      ...prev,
      [activeStudentId]: newNote
    }));
  };

  const handleSubmit = () => {
    onSubmit(notes);
  };

  return (
    <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-32 max-w-3xl mx-auto">
        <PageHeader title="Penilaian Akhlak" onBack={onBack} />

        {/* Selected Students Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
          {selectedStudents.map((student) => {
            const isActive = student.id === activeStudentId;
            const isDone = notes[student.id]?.trim().length > 0;
            
            return (
              <GlassCard 
                key={student.id} 
                onClick={() => setActiveStudentId(student.id)}
                className={`p-4 min-w-[240px] flex gap-3 cursor-pointer transition-all active:scale-95 ${
                  isActive 
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 ring-2 ring-amber-500/20' 
                    : 'opacity-70 grayscale-[0.3]'
                }`}
              >
                 <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-colors ${
                   isActive 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                 }`}>
                   {student.name.charAt(0)}
                   {isDone && (
                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center animate-in zoom-in">
                       <CheckCircle size={10} className="text-white" />
                     </div>
                   )}
                 </div>
                 <div className="overflow-hidden flex-1">
                   <div className="flex justify-between items-start mb-1">
                     <h4 className={`font-bold truncate ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                       {student.name}
                     </h4>
                     {isDone ? (
                       <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-black uppercase whitespace-nowrap ml-2">Sudah</span>
                     ) : (
                       <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-black uppercase whitespace-nowrap ml-2">Belum</span>
                     )}
                   </div>
                   <p className="text-[10px] text-slate-500 uppercase font-semibold">Cocard: {student.cocard}</p>
                 </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Assessment Form for Active Student */}
        <AnimatePresence mode="wait">
          {currentStudent && (
            <motion.div
              key={activeStudentId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <GlassCard className="p-6 mb-6 border-amber-500/20">
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="text-amber-500" size={24} />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Form: {currentStudent.name}</h3>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {currentStudent.camp}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-200 font-medium text-lg mb-2 flex items-center gap-2">
                    <MessageSquare size={18} className="text-slate-400" />
                    Catatan Guru
                  </label>
                  <textarea 
                    rows="6" 
                    value={currentNote}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder={`Tuliskan catatan khusus untuk ${currentStudent.name}...`}
                    className="w-full p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 dark:text-white resize-none text-lg leading-relaxed placeholder:text-slate-400 shadow-inner"
                  ></textarea>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

        {/* History */}
        <div className="flex items-center justify-between mb-4 mt-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Riwayat Catatan</h3>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">3 Catatan Terakhir</span>
        </div>
        
        <div className="space-y-3 mb-8">
          {MOCK_EVALUATION_HISTORY.filter(h => h.type.includes('Akhlak') || h.type.includes('Sikap')).map((hist, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">Catatan {hist.date}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">{hist.teacher}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                "{hist.type === 'Nilai Akhlak' ? 'Santri menunjukkan adab yang sangat baik kepada guru dan sesama teman.' : 'Perlu ditingkatkan lagi kedisiplinannya dalam mengikuti jadwal kegiatan.'}"
              </p>
            </GlassCard>
          ))}
          
          {/* Fallback if no specific akhlak history in mock data */}
          {MOCK_EVALUATION_HISTORY.filter(h => h.type.includes('Akhlak') || h.type.includes('Sikap')).length === 0 && (
            <div className="text-center py-8 opacity-50">
               <p className="text-slate-500 italic">Belum ada riwayat catatan akhlak.</p>
            </div>
          )}
        </div>

        {/* Sticky Bottom Action */}
        <StickyBottomBar>
          <div className="flex gap-4 w-full">
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Progress</span>
              <div className="flex gap-1 mt-1">
                {selectedStudents.map(s => (
                  <div 
                    key={s.id} 
                    className={`h-1.5 flex-1 rounded-full transition-colors ${notes[s.id]?.trim().length > 0 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleSubmit} colorClass="amber" className="flex-1">
              <CheckCircle size={22} />
              Simpan Semua
            </Button>
          </div>
        </StickyBottomBar>
      </div>
    </SwipeToBackWrapper>
  );
};

export default React.memo(AkhlakPage);
