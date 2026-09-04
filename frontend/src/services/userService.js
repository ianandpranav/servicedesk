import api from './api'

export const userService = {
  async getAll(search = '') {
    const params = search ? { search } : {}
    const { data } = await api.get('/users', { params })
    return data
  },

  async getAgents() {
    const { data } = await api.get('/users/agents')
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/users/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/users', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload)
    return data
  },

  async remove(id) {
    await api.delete(`/users/${id}`)
  },
}
