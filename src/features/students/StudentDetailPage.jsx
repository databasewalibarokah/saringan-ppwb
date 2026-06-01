import React, { useState, useEffect, useCallback } from 'react';
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
  const [studentDetail, setStudentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the primary student ID to fetch
  const primaryStudent = selectedStudents[0];

  const fetchStudentDetail = useCallback(async () => {
    if (!primaryStudent?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const API_URL = `https://generus.app/api/saringan/peserta/${primaryStudent.id}`;
      const token = localStorage.getItem('token') || '';

      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil detail santri');
      }

      const result = await response.json();
      setStudentDetail(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [primaryStudent?.id]);

  useEffect(() => {
    fetchStudentDetail();
  }, [fetchStudentDetail]);

  const openModal = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  if (!primaryStudent) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-500 font-medium text-lg">Pilih santri terlebih dahulu untuk melihat detail.</p>
        <button
          onClick={onBack}
          className="mt-6 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
        >
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-lg animate-pulse">Mengambil profil santri...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="inline-flex p-4 rounded-full bg-rose-50 text-rose-500 mb-4">
          <TrendingUp className="rotate-180" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={onBack} className="text-emerald-600 font-bold px-6 py-2 border-2 border-emerald-600 rounded-xl">Kembali</button>
      </div>
    );
  }

  const student = studentDetail || primaryStudent;

  // Use real scores if available, otherwise defaults
  const avgPenyampaian = student.nilai_akhir_penyampaian || 0;

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
                <div className="w-24 h-24 rounded-3xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-4xl font-bold shadow-inner relative overflow-hidden">
                  {student.foto_identitas ? (
                    <img src={student.foto_identitas} alt={student.nama || student.name} className="w-full h-full object-cover" />
                  ) : (
                    (student.nama || student.name || 'S').charAt(0)
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 leading-tight">{student.nama || student.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <Award size={14} className="text-emerald-500" />
                      Cocard: {student.id.substring(0, 6).toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <User size={14} className="text-blue-500" />
                      {student.jenis_kelamin === 'laki-laki' || student.gender === 'L' ? 'Ikhwan' : 'Akhwat'}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <TrendingUp size={14} className="text-amber-500" />
                      {student.status_mondok || student.camp || 'Reguler'}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Evaluation Summary Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-emerald-500" size={22} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Hasil Penilaian</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reading Score Card */}
              <GlassCard className="p-5 border-l-4 border-l-cyan-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tes Bacaan</p>
                    <h4 className="text-xl font-black text-slate-800 dark:text-white">Status Akhir</h4>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${student.hasil_tes_bacaan === 'lulus'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : student.hasil_tes_bacaan === 'tidak_lulus'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                    {student.hasil_tes_bacaan.replace('_', ' ')}
                  </div>
                </div>
              </GlassCard>

              {/* Penyampaian Score Card */}
              <GlassCard className="p-5 border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Penyampaian</p>
                    <h4 className="text-xl font-black text-slate-800 dark:text-white">Rata-rata</h4>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{avgPenyampaian}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Point</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* History Breakdown Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-500" size={22} />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Riwayat Pengujian</h3>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-500">
                {(student.evaluasi_bacaan?.length || 0) + (student.evaluasi_penyampaian?.length || 0)} Total
              </span>
            </div>

            <div className="space-y-4">
              {/* Bacaan History */}
              {student.evaluasi_bacaan?.map((hist, i) => (
                <GlassCard key={`b-${i}`} className="p-4 flex justify-between items-center group border-l-4 border-l-cyan-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{hist.materi || 'Tes Bacaan'}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Oleh: {hist.guru}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-lg font-black text-cyan-600 dark:text-cyan-400 leading-none">{hist.nilai}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Skor</span>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                  </div>
                </GlassCard>
              ))}

              {/* Penyampaian History */}
              {student.evaluasi_penyampaian?.map((hist, i) => (
                <GlassCard key={`p-${i}`} className="p-4 flex justify-between items-center group border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{hist.materi || 'Tes Penyampaian'}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Oleh: {hist.guru}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">{hist.total}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                    </div>
                    <button
                      onClick={() => openModal({ ...hist, teacher: hist.guru, avg: hist.total, date: 'Terbaru' })}
                      className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </GlassCard>
              ))}

              {(!student.evaluasi_bacaan?.length && !student.evaluasi_penyampaian?.length) && (
                <div className="py-10 text-center bg-white/20 dark:bg-slate-800/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 font-medium italic">Belum ada riwayat pengujian.</p>
                </div>
              )}
            </div>
          </section>

          {/* Global Notes Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="text-amber-500" size={22} />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Catatan Tambahan</h3>
            </div>

            <div className="space-y-4">
              {[...(student.evaluasi_bacaan || []), ...(student.evaluasi_penyampaian || [])]
                .filter(h => h.catatan)
                .map((hist, i) => (
                  <GlassCard key={`note-${i}`} className="p-5 flex gap-4 border-l-4 border-l-amber-500">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl h-fit">
                      <MessageCircle className="text-amber-600 dark:text-amber-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 dark:text-white">{hist.guru}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{hist.materi}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                        "{hist.catatan}"
                      </p>
                    </div>
                  </GlassCard>
                ))}

              {![...(student.evaluasi_bacaan || []), ...(student.evaluasi_penyampaian || [])].some(h => h.catatan) && (
                <p className="text-center py-6 text-slate-400 text-sm font-medium italic">Tidak ada catatan penguji.</p>
              )}
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
