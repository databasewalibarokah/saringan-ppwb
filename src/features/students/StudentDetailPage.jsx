import React, { useState } from 'react';
import { User, BookOpen, Star, Calendar, ArrowLeft, Award, TrendingUp, MessageCircle, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import PageHeader from '../../components/PageHeader';
import SwipeToBackWrapper from '../../components/SwipeToBackWrapper';
import { MOCK_EVALUATION_HISTORY } from '../../data/mockData';
import ScoreDetailModal from './components/ScoreDetailModal';

const StudentDetailPage = ({ 
  selectedStudents, 
  onBack 
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  // For simplicity in this demo, we'll focus on the first selected student if multiple are selected, 
  // or show a warning if none. In a real app, you'd probably navigate to a specific ID.
  const student = selectedStudents[0];

  if (!student) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500">Pilih santri terlebih dahulu untuk melihat detail.</p>
        <button onClick={onBack} className="mt-4 text-emerald-600 font-bold">Kembali</button>
      </div>
    );
  }

  // Mock score breakdown for the student
  const scoreSummary = [
    { label: 'Makna', score: 85, color: 'bg-emerald-500' },
    { label: 'Keterangan', score: 78, color: 'bg-blue-500' },
    { label: 'Penjelasan', score: 92, color: 'bg-amber-500' },
    { label: 'Pemahaman', score: 80, color: 'bg-rose-500' },
  ];

  return (
    <>
      <SwipeToBackWrapper onBack={onBack}>
      <div className="pb-24 max-w-4xl mx-auto">
        <PageHeader title="Detail Santri" onBack={onBack} />

        {/* Profile Section */}
        <section className="mb-8">
          <GlassCard className="p-6 overflow-hidden relative border-emerald-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-4xl font-bold shadow-inner">
                {student.name.charAt(0)}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{student.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Award size={14} className="text-emerald-500" />
                    Cocard: {student.cocard}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400">
                    <User size={14} className="text-blue-500" />
                    {student.gender === 'L' ? 'Putra' : 'Putri'}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400">
                    <TrendingUp size={14} className="text-amber-500" />
                    {student.camp}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </section>
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-emerald-500" size={22} />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Ringkasan Nilai Penyampaian</h3>
          </div>
          
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {scoreSummary.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.label}</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">{item.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full`} 
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-5 flex flex-col justify-center items-center border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Rata-rata Total</span>
                <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">84</span>
                <span className="mt-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full uppercase">Sangat Baik</span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Teacher Scores Breakdown Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-blue-500" size={22} />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Rincian Nilai per Guru</h3>
          </div>
          
          <div className="space-y-3">
            {MOCK_EVALUATION_HISTORY.filter(h => h.type === 'Penyampaian').map((hist, i) => (
              <GlassCard key={i} className="p-4 flex justify-between items-center group active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    {hist.teacher.split(' ').pop().charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{hist.teacher}</h4>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{hist.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-lg font-black text-blue-600 dark:text-blue-400 leading-none">{hist.avg}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Total Nilai</span>
                  </div>
                  <button 
                    onClick={() => openModal(hist)}
                    className="flex items-center gap-1 py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all"
                  >
                    Lihat Rincian
                    <ChevronRight size={14} />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Moral Notes Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-amber-500" size={22} />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Catatan Akhlak & Adab</h3>
          </div>
          
          <div className="space-y-4">
            {MOCK_EVALUATION_HISTORY.map((hist, i) => (
              <GlassCard key={i} className="p-5 flex gap-4 border-l-4 border-l-amber-500">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl h-fit">
                  <MessageCircle className="text-amber-600 dark:text-amber-400" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-white">{hist.teacher}</h4>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {hist.date}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                    "{hist.type === 'Akhlak' ? 'Menunjukkan kesantunan yang luar biasa saat berbicara dengan asatidz. Perlu dipertahankan.' : 'Alhamdulillah, secara umum baik namun perlu diingatkan untuk merapikan tempat tidurnya.'}"
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </SwipeToBackWrapper>
      <ScoreDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacherName={selectedAssessment?.teacher}
        scores={selectedAssessment}
      />
    </>
  );
};

export default React.memo(StudentDetailPage);
