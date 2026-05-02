import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  FileSpreadsheet,
  RefreshCw,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import Table, { TableRow, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/Button';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/* ─── Skeleton row untuk loading state ─── */
const SkeletonRow = ({ delay = 0 }) => (
  <div
    className="bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-slate-100 dark:border-slate-700 row-animate"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/5" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/5" />
      </div>
      <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
    </div>
  </div>
);

/* ─── Kartu statistik di atas ─── */
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <div
    className={`card-animate bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 ${color.border} shadow-sm flex items-center gap-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-md`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={color.icon} size={24} />
    </div>
    <div>
      <p className={`text-2xl font-black ${color.value}`}>{value}</p>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

/* ─── Kartu santri untuk tampilan mobile ─── */
const StudentCard = ({ row, index }) => {
  const isLulus = row.status_lulus === 'Lulus';
  return (
    <div
      className="row-animate bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header kartu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-black text-white flex-shrink-0 ${isLulus ? 'bg-emerald-500' : 'bg-amber-500'}`}>
            {(row.nama || 'S').charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-800 dark:text-white text-base leading-tight">{row.nama}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{row.cocard}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${isLulus ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
          {isLulus ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {row.status_lulus}
        </span>
      </div>

      {/* Grid nilai */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Bacaan', value: row.nilai_bacaan },
          { label: 'Penyampaian', value: row.nilai_penyampaian },
          { label: 'Pemahaman', value: row.nilai_pemahaman },
          { label: 'Rata-rata', value: row.rata_rata, highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} className={`rounded-xl p-2 text-center ${highlight ? (value >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-amber-50 dark:bg-amber-900/30') : 'bg-slate-50 dark:bg-slate-900/50'}`}>
            <p className={`text-xl font-black ${highlight ? (value >= 80 ? 'text-emerald-600' : 'text-amber-500') : 'text-slate-700 dark:text-slate-200'}`}>
              {value}
            </p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const ReportsPage = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useState({ search: '', kelas: 'Semua' });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await api.get('/saringan/peserta', token);
      const augmented = (result.data || result || []).map(s => ({
        ...s,
        nilai_bacaan: Math.floor(Math.random() * 20) + 80,
        nilai_penyampaian: Math.floor(Math.random() * 20) + 80,
        nilai_pemahaman: Math.floor(Math.random() * 20) + 80,
        rata_rata: 0,
        status_lulus: Math.random() > 0.3 ? 'Lulus' : 'Dipertimbangkan',
      })).map(s => ({
        ...s,
        rata_rata: Math.round((s.nilai_bacaan + s.nilai_penyampaian + s.nilai_pemahaman) / 3),
      }));
      setData(augmented);
    } catch {
      toast.error('Gagal memuat data laporan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const filteredData = data.filter(s => {
    const matchSearch =
      s.nama?.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.cocard?.toLowerCase().includes(filters.search.toLowerCase());
    const matchKelas = filters.kelas === 'Semua' || s.kelas === filters.kelas;
    return matchSearch && matchKelas;
  });

  const totalLulus = filteredData.filter(s => s.status_lulus === 'Lulus').length;
  const avgNilai = filteredData.length
    ? Math.round(filteredData.reduce((acc, s) => acc + s.rata_rata, 0) / filteredData.length)
    : 0;

  const exportToExcel = () => {
    const exportData = filteredData.map(s => ({
      'Nama': s.nama, 'Cocard': s.cocard, 'Kelas': s.kelas,
      'Bacaan': s.nilai_bacaan, 'Penyampaian': s.nilai_penyampaian,
      'Pemahaman': s.nilai_pemahaman, 'Rata-rata': s.rata_rata, 'Status': s.status_lulus,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Saringan');
    XLSX.writeFile(wb, `Laporan_Saringan_${new Date().toLocaleDateString()}.xlsx`);
    toast.success('Excel berhasil diunduh');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Hasil Saringan PPWB', 14, 15);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 14, 22);
    doc.autoTable({
      head: [['Nama', 'Cocard', 'Kelas', 'Bacaan', 'Penyampaian', 'Rerata', 'Status']],
      body: filteredData.map(s => [s.nama, s.cocard, s.kelas, s.nilai_bacaan, s.nilai_penyampaian, s.rata_rata, s.status_lulus]),
      startY: 30, theme: 'grid',
      headStyles: { fillColor: [51, 65, 85] },
    });
    doc.save(`Laporan_Saringan_${new Date().toLocaleDateString()}.pdf`);
    toast.success('PDF berhasil diunduh');
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="card-animate" style={{ animationDelay: '0ms' }}>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Laporan Hasil</h1>
          <p className="text-slate-500 font-medium mt-1">Rekapitulasi nilai dan status kelulusan</p>
        </div>
        <div className="flex gap-3 card-animate" style={{ animationDelay: '80ms' }}>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all duration-150"
          >
            <FileSpreadsheet size={20} />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-5 py-3 bg-rose-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-rose-600/30 hover:bg-rose-700 active:scale-95 transition-all duration-150"
          >
            <Download size={20} />
            <span className="hidden sm:inline">PDF Report</span>
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard delay={100} icon={Users} label="Total Peserta" value={filteredData.length}
          color={{ border: 'border-blue-200 dark:border-blue-800', bg: 'bg-blue-100 dark:bg-blue-900/40', icon: 'text-blue-600 dark:text-blue-400', value: 'text-blue-700 dark:text-blue-300' }} />
        <StatCard delay={160} icon={CheckCircle} label="Lulus" value={totalLulus}
          color={{ border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-100 dark:bg-emerald-900/40', icon: 'text-emerald-600 dark:text-emerald-400', value: 'text-emerald-700 dark:text-emerald-300' }} />
        <StatCard delay={220} icon={TrendingUp} label="Rerata Nilai" value={avgNilai}
          color={{ border: 'border-amber-200 dark:border-amber-800', bg: 'bg-amber-100 dark:bg-amber-900/40', icon: 'text-amber-600 dark:text-amber-400', value: 'text-amber-700 dark:text-amber-300' }} />
      </div>

      {/* ── Filter Bar ── */}
      <div className="card-animate grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm" style={{ animationDelay: '280ms' }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Cari nama santri..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200 font-semibold text-base text-slate-800 dark:text-white placeholder-slate-400"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200 font-semibold text-base text-slate-800 dark:text-white cursor-pointer"
          value={filters.kelas}
          onChange={(e) => setFilters({ ...filters, kelas: e.target.value })}
        >
          <option value="Semua">Semua Kelas</option>
          <option value="Pra-Remaja">Pra-Remaja</option>
          <option value="Remaja">Remaja</option>
          <option value="Dewasa">Dewasa</option>
        </select>
        <button
          onClick={fetchData}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all duration-150"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : 'transition-transform duration-300'} />
          Refresh Data
        </button>
      </div>

      {/* ── Loading ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <SkeletonRow key={i} delay={i * 80} />)}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="card-animate py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
            <Users className="text-slate-400" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-700 dark:text-white mb-2">Tidak ada data</h3>
          <p className="text-slate-400 font-medium">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="flex flex-col gap-3 lg:hidden">
            {filteredData.map((row, i) => (
              <StudentCard key={row.id || i} row={row} index={i} />
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden lg:block">
            <Table headers={['Nama Murid', 'Kelas', 'Bacaan', 'Penyampaian', 'Pemahaman', 'Rata-rata', 'Status']}>
              {filteredData.map((row, i) => (
                <TableRow
                  key={row.id || i}
                  className="row-animate"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0 ${row.status_lulus === 'Lulus' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        {(row.nama || 'S').charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-white text-base leading-tight">{row.nama}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{row.cocard}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="blue">{row.kelas || '-'}</Badge></TableCell>
                  <TableCell><span className="font-black text-slate-700 dark:text-slate-200 text-lg">{row.nilai_bacaan}</span></TableCell>
                  <TableCell><span className="font-black text-slate-700 dark:text-slate-200 text-lg">{row.nilai_penyampaian}</span></TableCell>
                  <TableCell><span className="font-black text-slate-700 dark:text-slate-200 text-lg">{row.nilai_pemahaman}</span></TableCell>
                  <TableCell>
                    <span className={`font-black text-xl ${row.rata_rata >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {row.rata_rata}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status_lulus === 'Lulus' ? 'emerald' : 'amber'}>
                      {row.status_lulus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
