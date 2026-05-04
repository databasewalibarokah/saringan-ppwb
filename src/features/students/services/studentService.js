import api from '../../../api/axios';

/**
 * Service for fetching student data from the API.
 */
export const studentService = {
  /**
   * Fetch all participants for the saringan process.
   * @returns {Promise<Array>} List of mapped student objects.
   */
  getStudents: async () => {
    try {
      const response = await api.get('/saringan/peserta/');
      
      if (response.data && response.data.success) {
        return response.data.data.map(item => ({
          id: item.id,
          santriId: item.santri.id,
          name: item.santri.nama,
          nickname: item.santri.nama_panggilan,
          gender: item.santri.jk, // Might be null based on user example
          // Values for UI compatibility
          cocard: item.santri.id.substring(item.santri.id.length - 5).toUpperCase(),
          status: item.status_tes.label,
          statusColor: item.status_tes.color,
          statusValue: item.status_tes.value,
          // Original data if needed
          raw: item
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }
};

export default studentService;
