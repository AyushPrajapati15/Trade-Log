import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT safely ──
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      // Explicit bracket notation ensures headers are set correctly on every parallel instance
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// ── Response interceptor: auto-refresh on 401 ──
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token))
  failedQueue = []
}

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers['Authorization'] = `Bearer ${token}`
          return api(original)
        })
      }
      original._retry = true
      isRefreshing = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        isRefreshing = false
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(err)
      }
      try {
        const { data } = await api.post('/auth/refresh', { refreshToken })

        localStorage.setItem('accessToken', data.accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        processQueue(null, data.accessToken)
        original.headers['Authorization'] = `Bearer ${data.accessToken}`
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth endpoints ──
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  sendEmailOtp: (identifier) => api.post('/auth/send-email-otp', { identifier }),
  verifyEmailOtp: (identifier, otp) => api.post('/auth/verify-email-otp', { identifier, otp }),
  sendMobileOtp: (identifier, type) => api.post('/auth/send-mobile-otp', { identifier, type }),
  verifyMobileOtp: (identifier, otp) => api.post('/auth/verify-mobile-otp', { identifier, otp }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  loginMobile: (mobile, otp) => api.post('/auth/login/mobile', { mobile, otp }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
}

// ── User Profile endpoints (Aligned with Backend Mapping) ──
export const userAPI = {
  getProfile: () => api.get('/profile'),                       // Matches backend @RequestMapping("/api/profile")
  updateProfile: (data) => api.put('/profile', data),          // Matches backend @PutMapping
  changePassword: (data) => api.post('/profile/change-password', data), // Matches backend @PostMapping("/change-password")
}

// ── Trade endpoints ──
export const tradeAPI = {
  list: (params) => api.get('/trades', { params }),
  create: (data) => api.post('/trades', data),
  update: (id, data) => api.put(`/trades/${id}`, data),
  delete: (id) => api.delete(`/trades/${id}`),
  getById: (id) => api.get(`/trades/${id}`),
}

// ── Import endpoints ──
export const importAPI = {
  zerodha: (file) => {
    const fd = new FormData(); fd.append('file', file)
    return api.post('/import/zerodha', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  upstox: (file) => {
    const fd = new FormData(); fd.append('file', file)
    return api.post('/import/upstox', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  angel: (file) => {
    const fd = new FormData(); fd.append('file', file)
    return api.post('/import/angel', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getLogs: () => api.get('/import/logs'),
}

// ── Analytics endpoints ──
export const analyticsAPI = {
  summary: () => api.get('/analytics/summary'),
  monthly: () => api.get('/analytics/monthly'),
  bySetup: () => api.get('/analytics/by-setup'),
  mistakes: () => api.get('/analytics/mistakes'),
  calendar: (month) => api.get('/analytics/calendar', { params: month ? { month } : {} }),
}

// ── Admin endpoints ──
export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: (params) => api.get('/admin/users', { params }),
  userById: (id) => api.get(`/admin/users/${id}`),
  userTrades: (id, params) => api.get(`/admin/users/${id}/trades`, { params }),
  banUser: (id, reason) => api.put(`/admin/users/${id}/ban`, { reason }),
  unbanUser: (id) => api.put(`/admin/users/${id}/unban`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  trades: (params) => api.get('/admin/trades', { params }),
  importLogs: () => api.get('/admin/import-logs'),
}

export default api