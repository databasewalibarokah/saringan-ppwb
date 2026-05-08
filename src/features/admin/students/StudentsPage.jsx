import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter, 
  Download, 
  MoreVertical,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Calendar,
  ChevronDown,
  Database,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import Table, { TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Badge'; // Using Badge file for Spinner too
import Button from '../../../components/Button';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';

const StudentsPage = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Import feature states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const fetchPeriods = useCallback(async () => {
    try {
      const data = await api.get('/saringan/periode', token);
      const periodList = data.data || [];
      setPeriods(periodList);
      
      // Default to active period
      const active = periodList.find(p => p.aktif);
      if (active) {
        setSelectedPeriodeId(active.id);
      } else if (periodList.length > 0) {
        setSelectedPeriodeId(periodList[0].id);
      }
    } catch (err) {
      console.error('Error fetching periods:', err);
    }
  }, [token]);

  const fetchStudents = useCallback(async () => {
    if (!selectedPeriodeId) return;
    setIsLoading(true);
    try {
      const data = await api.get(`/saringan/peserta?filter[periode_id]=${selectedPeriodeId}`, token);
      // Handle potential pagination or direct array
      const studentData = data.data || data || [];
      setStudents(Array.isArray(studentData) ? studentData : studentData.data || []);
    } catch (err) {
      toast.error('Gagal mengambil data murid');
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedPeriodeId]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  useEffect(() => {
    if (selectedPeriodeId) {
      fetchStudents();
    }
  }, [fetchStudents, selectedPeriodeId]);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data murid ini?')) {
      try {
        await api.delete(`/saringan/peserta/${id}`, token);
        toast.success('Data murid dihapus');
        fetchStudents();
      } catch (err) {
        toast.error('Gagal menghapus data');
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cocard?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowImportModal = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/saringan/kandidat-peserta', token);
      setCandidates(data.data || []);
      setIsImportModalOpen(true);
    } catch (err) {
      toast.error(err.message || 'Gagal mengambil data kandidat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsImporting(true);
    try {
      const result = await api.post('/saringan/impor-peserta', {}, token);
      toast.success(result.message || 'Import berhasil');
      setIsImportModalOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.message || 'Gagal mengimpor data');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Manajemen Murid</h1>
          <p className="text-slate-500 font-medium">Kelola database peserta saringan PPWB</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleShowImportModal} className="bg-white dark:bg-slate-800 text-emerald-600 border-2 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 shadow-none">
            <Database size={18} />
            Ambil Santri Saringan
          </Button>
          <Button onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-500">
            <UserPlus size={18} />
            Tambah Murid
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau cocard..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-transparent focus:border-emerald-500/50 rounded-xl outline-none transition-all text-sm font-bold"
          />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto">
          {/* Period Filter */}
          <div className="relative flex-1 md:flex-none md:w-56 group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" size={18} />
            <select
              value={selectedPeriodeId}
              onChange={(e) => setSelectedPeriodeId(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-slate-50 dark:bg-slate-900/50 border border-transparent focus:border-emerald-500/50 rounded-xl outline-none appearance-none transition-all text-sm font-bold cursor-pointer"
            >
              <option value="" disabled>Pilih Periode</option>
              {periods.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label} {p.aktif ? '(Aktif)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <button onClick={fetchStudents} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors">
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="hidden md:flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-500 font-bold text-sm">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Data...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700/50">
          <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold italic">Tidak ada data murid ditemukan</p>
        </div>
      ) : (
        <Table headers={['Nama', 'Cocard', 'L/P', 'Status', 'Aksi']}>
          {filteredStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black">
                    {student.nama?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white leading-none mb-1">{student.nama}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{student.email || 'No Email'}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell><span className="font-black text-slate-500">{student.cocard}</span></TableCell>
              <TableCell>
                <Badge variant={student.jenis_kelamin?.toLowerCase().startsWith('l') ? 'blue' : 'rose'}>
                  {student.jenis_kelamin?.toUpperCase().charAt(0) || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={student.status_mondok === 'mondok' ? 'emerald' : 'amber'}>
                  {student.status_mondok || 'Reguler'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(student)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(student.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedStudent ? 'Edit Data Murid' : 'Tambah Murid Baru'}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Fitur Simpan Placeholder'); setIsModalOpen(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
              <input type="text" defaultValue={selectedStudent?.nama} required className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cocard / ID</label>
              <input type="text" defaultValue={selectedStudent?.cocard} required className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold uppercase" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kelas</label>
              <select defaultValue={selectedStudent?.kelas} className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold">
                <option value="Pra-Remaja">Pra-Remaja</option>
                <option value="Remaja">Remaja</option>
                <option value="Dewasa">Dewasa</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Mondok</label>
              <select defaultValue={selectedStudent?.status_mondok} className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold">
                <option value="mondok">Mondok</option>
                <option value="reguler">Reguler</option>
              </select>
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200">Batal</Button>
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500">Simpan Data</Button>
          </div>
        </form>
      </Modal>

      {/* Modal for Bulk Import (Generate Participants) */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => !isImporting && setIsImportModalOpen(false)}
        title="Konfirmasi Impor Santri"
      >
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <Database size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">Ditemukan {candidates.length} Santri</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Data santri dari kelas saringan akan diimpor sebagai peserta di periode yang dipilih.
              </p>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {candidates.map((c, idx) => (
              <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-white group-hover:text-emerald-500 transition-colors">{c.nama}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{c.kota || 'Kota Belum Diatur'}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-black uppercase ${c.jenis_kelamin === 'laki-laki' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                  {c.jenis_kelamin === 'laki-laki' ? 'L' : 'P'}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex gap-4">
            <Button 
              type="button" 
              disabled={isImporting}
              onClick={() => setIsImportModalOpen(false)} 
              className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              Batal
            </Button>
            <Button 
              type="button" 
              disabled={isImporting || candidates.length === 0}
              onClick={handleConfirmImport} 
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Mengimpor...
                </>
              ) : (
                <>
                  Impor {candidates.length} Santri
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentsPage;
