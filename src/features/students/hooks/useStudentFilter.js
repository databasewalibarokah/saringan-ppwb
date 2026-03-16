import { useState, useMemo } from 'react';

/**
 * Custom hook to encapsulate the logic for filtering and searching students.
 * @param {Array} initialStudents - The full list of students
 */
export function useStudentFilter(initialStudents) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredStudents = useMemo(() => {
    return initialStudents.filter((student) => {
      // 1. Search filter (by name or cocard number)
      const matchesSearch = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.cocard.includes(searchQuery);

      // 2. Category filter (Camp, Gender, etc)
      let matchesCategory = true;
      if (activeFilter !== 'Semua') {
        if (activeFilter === 'Putra') {
          matchesCategory = student.gender === 'L';
        } else if (activeFilter === 'Putri') {
          matchesCategory = student.gender === 'P';
        } else {
          // Assume the filter matches the camp name entirely (e.g., "Camp A")
          matchesCategory = student.camp === activeFilter;
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
