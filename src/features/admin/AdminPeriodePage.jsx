import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Calendar, CheckCircle, Edit2, Trash2,
  Loader2, AlertCircle, RefreshCw, Save, X,
  ToggleLeft, ToggleRight, ArrowLeft, Clock
} from 'lucide-react';
import GlassCard from '../../components/GlassCard';

/* ─── Skeleton card ─── */
const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="row-animate bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-100 dark:border-slate-700"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/5" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/3" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

/* ─── Input field helper ─── */
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full p-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 dark:text-white font-semibold text-base transition-all duration-200 placeholder-slate-400';

/* ─── Main Component ─── */
const AdminPeriodePage = ({ onBack }) => {
  const [periodes, setPeriodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriode, setEditingPeriode] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({ nama: '', mulai: '', selesai: '', aktif: false });

  useEffect(() => { setIsMounted(true); }, []);

  const fetchPeriodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch('https://sistem-ponpes-jagat.test/api/saringan/periode', {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil data periode');
      const result = await response.json();
      setPeriodes(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPeriodes(); }, [fetchPeriodes]);

  const handleOpenModal = (periode = null) => {
    if (periode) {
      setEditingPeriode(periode);
      setFormData({ nama: periode.nama || '', mulai: periode.mulai || '', selesai: periode.selesai || '', aktif: periode.aktif || false });
    } else {
      setEditingPeriode(null);
      setFormData({ nama: '', mulai: '', selesai: '', aktif: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      const method = editingPeriode ? 'PUT' : 'POST';
      const url = editingPeriode
        ? `https://sistem-ponpes-jagat.test/api/saringan/periode/${editingPeriode.id}`
        : 'https://sistem-ponpes-jagat.test/api/saringan/periode';
      const response = await fetch(url, {
        method,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan periode');
      }
      setIsModalOpen(false);
      fetchPeriodes();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus periode ini?')) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`https://sistem-ponpes-jagat.test/api/saringan/periode/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Gagal menghapus periode');
      fetchPeriodes();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAktif = async (periode) => {
    if (periode.aktif) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`https://sistem-ponpes-jagat.test/api/saringan/periode/${periode.id}/aktifkan`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Gagal mengaktifkan periode');
      fetchPeriodes();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const periodeAktif = periodes.find(p => p.aktif);

  return (
    <div className={`space-y-6 transition-all duration-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 card-animate" style={{ animationDelay: '0ms' }}>
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">Kelola Periode</h1>
            <p className="text-slate-500 font-medium mt-0.5">Atur periode saringan santri baru</p>
          </div>
        </div>
        <div className="flex gap-3 card-animate" style={{ animationDelay: '80ms' }}>
          <button
            onClick={fetchPeriodes}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-white hover:border-slate-300 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all duration-150"
          >
            <Plus size={20} />
            Periode Baru
          </button>
        </div>
      </div>

      {/* ── Info Banner periode aktif ── */}
      {periodeAktif && (
        <div
          className="card-animate flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white"
          style={{ animationDelay: '140ms' }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={26} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-0.5">Periode Aktif Saat Ini</p>
            <p className="text-xl font-black leading-tight">{periodeAktif.nama}</p>
            <p className="text-sm font-semibold opacity-80 mt-0.5 flex items-center gap-1.5">
              <Clock size={13} />
              {periodeAktif.mulai} s/d {periodeAktif.selesai}
            </p>
          </div>
        </div>
      )}

      {/* ── Error Alert ── */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-400">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p className="font-semibold text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Daftar Periode ── */}
      <div>
        <h2 className="text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 card-animate" style={{ animationDelay: '180ms' }}>
          Semua Periode
        </h2>

        {isLoading && periodes.length === 0 ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} delay={i * 80} />)}
          </div>
        ) : periodes.length === 0 ? (
          <div
            className="card-animate py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center px-6"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-700 dark:text-white mb-2">Belum Ada Periode</h3>
            <p className="text-slate-400 font-medium mb-6">Buat periode pertama untuk memulai proses saringan.</p>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Plus size={18} /> Buat Periode Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {periodes.map((periode, i) => (
              <div
                key={periode.id}
                className={`row-animate flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
                  periode.aktif
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/10'
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                }`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {/* Left: icon + info */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    periode.aktif
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <Calendar size={26} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{periode.nama}</h3>
                      {periode.aktif && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                          <CheckCircle size={10} /> Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Clock size={13} />
                      {periode.mulai} — {periode.selesai}
                    </p>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 flex-shrink-0 pl-0 sm:pl-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-700">
                  {/* Toggle aktif */}
                  <button
                    onClick={() => handleToggleAktif(periode)}
                    disabled={periode.aktif}
                    title={periode.aktif ? 'Periode ini sudah aktif' : 'Aktifkan periode ini'}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${
                      periode.aktif
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 active:scale-95'
                    }`}
                  >
                    {periode.aktif ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    <span className="hidden sm:inline">{periode.aktif ? 'Aktif' : 'Aktifkan'}</span>
                  </button>

                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenModal(periode)}
                    title="Edit periode"
                    className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 transition-all duration-150"
                  >
                    <Edit2 size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(periode.id)}
                    title="Hapus periode"
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-95 transition-all duration-150"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Form ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isSaving && setIsModalOpen(false)}
          />

          {/* Modal panel */}
          <div className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border-0 sm:border-2 sm:border-slate-200 dark:border-slate-700 card-animate overflow-hidden">
            {/* Modal header */}
            <div className="flex justify-between items-center p-6 border-b-2 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {editingPeriode ? 'Edit Periode' : 'Periode Baru'}
                </h3>
                <p className="text-sm font-semibold text-slate-400 mt-0.5">Isi detail periode saringan</p>
              </div>
              <button
                onClick={() => !isSaving && setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <FormField label="Nama Periode">
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Gelombang 1 2026"
                  className={inputClass}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Tanggal Mulai">
                  <input
                    type="date"
                    required
                    value={formData.mulai}
                    onChange={(e) => setFormData({ ...formData, mulai: e.target.value })}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Tanggal Selesai">
                  <input
                    type="date"
                    required
                    value={formData.selesai}
                    onChange={(e) => setFormData({ ...formData, selesai: e.target.value })}
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 py-4 rounded-2xl font-bold text-base bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all duration-150 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 rounded-2xl font-bold text-base bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all duration-150 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AdminPeriodePage);
