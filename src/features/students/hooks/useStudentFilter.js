import { useState, useMemo } from 'react';

/**
 * Custom hook to encapsulate the logic for filtering and searching students.
 * @param {Array} initialStudents - The full list of students
 */
export function useStudentFilter(initialStudents) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(initialStudents)) return [];
    
    return initialStudents.filter((student) => {
      if (!student) return false;

      // Safely handle different field names (API vs Mock)
      const name = (student.nama || student.name || '').toString();
      const cocard = (student.cocard || student.id || '').toString();
      const gender = student.jenis_kelamin === 'laki-laki' ? 'L' : (student.jenis_kelamin === 'perempuan' ? 'P' : student.gender);
      const camp = student.camp || student.status_mondok || '';

      // 1. Search filter
      const matchesSearch = 
        name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cocard.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category filter
      let matchesCategory = true;
      if (activeFilter !== 'Semua') {
        if (activeFilter === 'Putra') {
          matchesCategory = gender === 'L';
        } else if (activeFilter === 'Putri') {
          matchesCategory = gender === 'P';
        } else {
          matchesCategory = camp === activeFilter;
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [initialStudents, searchQuery, activeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filteredStudents
  };
}
