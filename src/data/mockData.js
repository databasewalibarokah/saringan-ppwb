/**
 * Mock data for development.
 * Replace with API calls when backend is ready.
 */

export const MOCK_STUDENTS = [
  { id: 1, name: 'Ahmad Faizal', cocard: '10293', gender: 'L', camp: 'Camp A', simakanCount: 2 },
  { id: 2, name: 'Siti Nurhaliza', cocard: '10294', gender: 'P', camp: 'Camp B', simakanCount: 1 },
  { id: 3, name: 'Muhammad Yusuf', cocard: '10295', gender: 'L', camp: 'Camp A', simakanCount: 0 },
  { id: 4, name: 'Fatima Azzahra', cocard: '10296', gender: 'P', camp: 'Camp C', simakanCount: 3 },
  { id: 5, name: 'Ibrahim Ali', cocard: '10297', gender: 'L', camp: 'Camp B', simakanCount: 5 },
  { id: 6, name: 'Nur Aisyah', cocard: '10298', gender: 'P', camp: 'Camp A', simakanCount: 0 },
  { id: 7, name: 'Zulkifli Mansur', cocard: '10299', gender: 'L', camp: 'Camp C', simakanCount: 2 },
  { id: 8, name: 'Haniifah Putri', cocard: '10300', gender: 'P', camp: 'Camp B', simakanCount: 4 },
];

export const MOCK_EVALUATION_HISTORY = [
  { id: 1, date: '12 Mar 2026', teacher: 'Ust. Rahman', type: 'Penyampaian', avg: 85 },
  { id: 2, date: '10 Mar 2026', teacher: 'Ustz. Aisyah', type: 'Akhlak', avg: 92 },
];

export const INITIAL_SCORES = {
  makna: null,
  keterangan: null,
  penjelasan: null,
  pemahaman: null,
};

export const BACAAN_INITIAL_STATE = {
  nilai: null, // null, 'lulus', 'tidak_lulus'
  materi: '',
  note: '',
  teacherProxy: '',
  kekurangan_tajwid: [],
  kekurangan_khusus: [],
  kekurangan_keserasian: [],
  kekurangan_kelancaran: [],
};

export const FILTER_OPTIONS = ['Semua', 'Camp A', 'Camp B', 'Putra', 'Putri'];
