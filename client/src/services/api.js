import axios from 'axios'

const api = axios.create({baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'})
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('helpingHandsToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  updateMe: (payload) => api.patch('/auth/me', payload),
}
export const needsAPI = {
  list: () => api.get('/needs'),
  get: (id) => api.get(`/needs/${id}`),
  mine: () => api.get('/needs/mine'),
  create: (payload) => {
    const formData=new FormData()
    for(const key of ['title','description','category','location','urgency','quantityNeeded'])formData.append(key,payload[key])
    for(const file of payload.supportingProofs||[])formData.append('supportingProofs',file)
    return api.postForm('/needs',formData)
  },
  update: (id,payload) => api.patch(`/needs/${id}`, payload),
  cancel: (id) => api.delete(`/needs/${id}`),
  proof: (id,proofId) => api.get(`/needs/${id}/proofs/${proofId}`,{responseType:'blob'}),
  verificationQueue: (history=false) => api.get('/needs/verification-queue',{params:{history}}),
  review: (id,payload) => api.patch(`/needs/${id}/review`,payload),
}
export const donationsAPI = {
  mine: () => api.get('/donations'),
  received: () => api.get('/donations/received'),
  get: (id) => api.get(`/donations/${id}`),
  create: (payload) => api.post('/donations',payload),
  update: (id,payload) => api.patch(`/donations/${id}`,payload),
}
export const notificationsAPI = {
  list: () => api.get('/notifications'),
  read: (id) => api.patch(`/notifications/${id}/read`),
  readAll: () => api.patch('/notifications/read-all'),
}
export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: (q='') => api.get('/admin/users',{params:{q}}),
  updateUser: (id,payload) => api.patch(`/admin/users/${id}`,payload),
  requests: (status='') => api.get('/admin/requests',{params:{status}}),
  reports: () => api.get('/admin/reports'),
}
export const dashboardAPI = { get: () => api.get('/dashboard') }
export default api
