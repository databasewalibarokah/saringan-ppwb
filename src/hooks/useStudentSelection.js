import { useState, useCallback } from 'react';

/**
 * Custom hook to manage student selection logic.
 * Keeps the Evaluation flow logic encapsulated and testable.
 */
export function useStudentSelection() {
  const [selectedStudents, setSelectedStudents] = useState([]);

  const toggleStudent = useCallback((student) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.find((s) => s.id === student.id)) {
        return prevSelected.filter((s) => s.id !== student.id);
      } else {
        return [...prevSelected, student];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedStudents([]);
  }, []);

  return {
    selectedStudents,
    toggleStudent,
    clearSelection,
  };
}
