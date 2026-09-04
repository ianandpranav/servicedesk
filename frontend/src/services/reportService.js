import api from './api'

export const reportService = {
  async getReport() {
    const { data } = await api.get('/reports')
    return data
  },

  exportCsvUrl() {
    return '/api/reports/export'
  },
}
