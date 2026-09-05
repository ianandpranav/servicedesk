import axios from 'axios'

const rawBase = import.meta.env.VITE_API_URL
const baseURL = rawBase
  ? `${rawBase.replace(/\/$/, '')}/api`
  : '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalize errors into a readable message so components don't
// need to know about Axios' error shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.'

    if (error.response) {
      const data = error.response.data

      if (data?.fieldErrors) {
        message = Object.values(data.fieldErrors).join(', ')
      } else if (data?.message) {
        message = data.message
      } else if (error.response.status === 404) {
        message = 'The requested resource was not found.'
      }
    } else if (error.request) {
      message = 'Could not reach the server. Is the backend running?'
    }

    return Promise.reject(new Error(message))
  }
)

export default api