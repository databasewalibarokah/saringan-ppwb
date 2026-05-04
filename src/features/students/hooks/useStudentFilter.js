import { useState, useMemo } from 'react';

/**
 * Custom hook to encapsulate the logic for filtering and searching students.
 * @param {Array} initialStudents - The full list of students
 */
export function useStudentFilter(initialStudents) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredStudents = useMemo(() => {
    if (!initialStudents) return [];
    
    return initialStudents.filter((student) => {
      // 1. Search filter (by name or santriId/cocard)
      const matchesSearch = 
        (student.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (student.cocard || '').includes(searchQuery) ||
        (student.santriId || '').includes(searchQuery);

      // 2. Category filter (Gender, etc)
      let matchesCategory = true;
      if (activeFilter !== 'Semua') {
        if (activeFilter === 'Putra') {
          matchesCategory = student.gender === 'L';
        } else if (activeFilter === 'Putri') {
          matchesCategory = student.gender === 'P';
        } else {
          // Fallback for camp or other filters if they exist
          matchesCategory = student.camp === activeFilter || student.status === activeFilter;
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
