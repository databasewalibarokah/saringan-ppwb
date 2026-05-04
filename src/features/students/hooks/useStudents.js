import { useState, useEffect, useCallback } from 'react';
import studentService from '../services/studentService';

/**
 * Custom hook for managing the list of students from the API.
 * @returns {Object} { students, loading, error, refresh }
 */
export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar peserta. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    refresh: fetchStudents
  };
};

export default useStudents;
