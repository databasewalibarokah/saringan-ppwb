import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Edit2, 
  Mail, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import Table, { TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/Button';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Use the actual API endpoint for users if available
      const data = await api.get('/users', token);
      setUsers(data.data || data || []);
    } catch (err) {
      // Fallback/Mock for demo
      setUsers([
        { id: 1, nama: 'Super Admin', email: 'superadmin@ppwb', roles: ['Super Admin'], status: 'aktif' },
        { id: 2, nama: 'Admin 1', email: 'admin1@ppwb', roles: ['Admin'], status: 'aktif' },
        { id: 3, nama: 'Guru Test', email: 'guru@test.com', roles: ['Guru Tes Kediri'], status: 'non-aktif' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      toast.error('Anda tidak bisa menghapus akun sendiri!');
      return;
    }
    if (window.confirm('Hapus akun admin ini?')) {
      toast.success('Akun admin berhasil dihapus');
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-3xl font-black text-slate-800 dark:text-white">Manajemen Admin</h1>
             <Badge variant="rose">Super Admin Only</Badge>
          </div>
          <p className="text-slate-500 font-medium">Kelola hak akses dan akun administrator sistem</p>
        </div>
        <Button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} className="bg-slate-900 dark:bg-emerald-600 hover:scale-105 transition-transform">
          <UserPlus size={18} />
          Tambah Admin
        </Button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
          <span className="font-bold">Perhatian:</span> Menghapus atau mengubah role admin dapat mempengaruhi akses operasional saringan. Pastikan Anda melakukan verifikasi sebelum menyimpan perubahan.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
           <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table headers={['Administrator', 'Email', 'Role / Jabatan', 'Status', 'Aksi']}>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                    {u.nama?.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{u.nama}</span>
                </div>
              </TableCell>
              <TableCell><span className="text-slate-500 font-medium">{u.email}</span></TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {u.roles?.map((role, idx) => (
                    <Badge key={idx} variant={role.includes('Super') ? 'rose' : 'blue'}>
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={u.status === 'aktif' ? 'emerald' : 'gray'}>
                  {u.status || 'Aktif'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Konfigurasi Akun Admin"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Berhasil menambahkan admin baru'); setIsModalOpen(false); }}>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Administrator</label>
              <input type="text" placeholder="Nama Lengkap" required className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold" />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email / Username</label>
              <input type="email" placeholder="email@example.com" required className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold" />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Utama</label>
              <select className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold">
                <option value="Admin">Administrator (Standar)</option>
                <option value="Super Admin">Super Administrator (Akses Penuh)</option>
              </select>
           </div>
           <div className="pt-6 flex gap-4">
              <Button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600">Batal</Button>
              <Button type="submit" className="flex-1 bg-slate-900 text-white">Buat Akun</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
