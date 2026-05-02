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
  AlertCircle
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/saringan/peserta', token);
      setStudents(data.data || data || []);
    } catch (err) {
      toast.error('Gagal mengambil data murid');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Manajemen Murid</h1>
          <p className="text-slate-500 font-medium">Kelola database peserta saringan PPWB</p>
        </div>
        <Button onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-500">
          <UserPlus size={18} />
          Tambah Murid
        </Button>
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
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={fetchStudents} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors">
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-500 font-bold text-sm">
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
        <Table headers={['Info Murid', 'Cocard', 'Kelas', 'Status', 'Aksi']}>
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
              <TableCell><Badge variant="blue">{student.kelas || 'N/A'}</Badge></TableCell>
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
    </div>
  );
};

export default StudentsPage;
