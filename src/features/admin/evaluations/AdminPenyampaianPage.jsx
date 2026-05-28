import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  RefreshCw,
  AlertCircle,
  Calendar,
  ChevronDown,
  User,
  BookOpen,
  MessageSquare,
  Filter
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import Table, { TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/Button';
import toast from 'react-hot-toast';

const AdminPenyampaianPage = () => {
  const { token, selectedPonpesId } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPeriods = useCallback(async () => {
    try {
      const data = await api.get('/saringan/periode', token);
      const periodList = data.data || [];
      setPeriods(periodList);
      
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

  const fetchEvaluations = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/saringan/penilaian-penyampaian?filter[periode_id]=${selectedPeriodeId}`;
      if (searchTerm) {
        url += `&filter[search]=${searchTerm}`;
      }
      
      const data = await api.get(url, token);
      setEvaluations(data.data || data || []);
    } catch (err) {
      toast.error('Gagal mengambil data penilaian');
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedPeriodeId, searchTerm]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  useEffect(() => {
    if (selectedPeriodeId !== undefined) {
      fetchEvaluations();
    }
  }, [fetchEvaluations, selectedPeriodeId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Penilaian Penyampaian</h1>
          <p className="text-slate-500 font-medium">Riwayat evaluasi materi penyampaian santri</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau cocard..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchEvaluations()}
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
              <option value="">Semua Periode</option>
              {periods.map(p => (
                <option key={p.id} value={p.id}>
                  {selectedPonpesId === 'all' ? `[${p.ponpes_nama}] ` : ''}{p.label} {p.aktif ? '(Aktif)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <button onClick={fetchEvaluations} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors">
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Data...</p>
        </div>
      ) : (evaluations.length === 0 || (Array.isArray(evaluations) && evaluations.length === 0)) ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700/50">
          <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold italic">Tidak ada data penilaian ditemukan</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
          <Table headers={selectedPonpesId === 'all' ? ['Periode', 'Pondok', 'Cocard', 'Peserta', 'L/P', 'Guru', 'Makna', 'Ket', 'Penj', 'Pemh', 'Catatan'] : ['Periode', 'Cocard', 'Peserta', 'L/P', 'Guru', 'Makna', 'Ket', 'Penj', 'Pemh', 'Catatan']}>
            {(Array.isArray(evaluations) ? evaluations : evaluations.data || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">{row.periode_label || row.periode}</span>
                    {row.periode_label && <span className="text-[10px] text-slate-400 font-medium">{row.periode}</span>}
                  </div>
                </TableCell>
                {selectedPonpesId === 'all' && (
                  <TableCell>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md whitespace-nowrap">
                      {row.ponpes_nama || '-'}
                    </span>
                  </TableCell>
                )}
                <TableCell><span className="font-black text-slate-500 dark:text-slate-400">{row.cocard || '-'}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                      {row.peserta?.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-white whitespace-nowrap">{row.peserta}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={row.jenis_kelamin?.toLowerCase().startsWith('l') ? 'blue' : 'rose'}>
                    {row.jenis_kelamin?.toLowerCase().startsWith('l') ? 'L' : 'P'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 italic">
                    <User size={14} />
                    <span className="text-xs font-semibold whitespace-nowrap">{row.guru}</span>
                  </div>
                </TableCell>
                <TableCell><span className="font-black text-slate-700 dark:text-slate-200">{row.makna}</span></TableCell>
                <TableCell><span className="font-black text-slate-700 dark:text-slate-200">{row.keterangan}</span></TableCell>
                <TableCell><span className="font-black text-slate-700 dark:text-slate-200">{row.penjelasan}</span></TableCell>
                <TableCell><span className="font-black text-slate-700 dark:text-slate-200">{row.pemahaman}</span></TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate group relative cursor-help">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {row.catatan || '-'}
                    </span>
                    {row.catatan && (
                      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-10 whitespace-normal border border-slate-700">
                        {row.catatan}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminPenyampaianPage;
