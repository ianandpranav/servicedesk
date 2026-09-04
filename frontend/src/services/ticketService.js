import api from './api'

export const ticketService = {
  async getAll(filters = {}) {
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    if (filters.category) params.category = filters.category
    if (filters.agentId) params.agentId = filters.agentId
    if (filters.from) params.from = filters.from
    if (filters.to) params.to = filters.to

    const { data } = await api.get('/tickets', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/tickets/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/tickets', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/tickets/${id}`, payload)
    return data
  },

  async remove(id) {
    await api.delete(`/tickets/${id}`)
  },
}
