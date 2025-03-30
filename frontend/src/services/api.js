import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials)
};

// Document services
export const documentService = {
  create: (documentData) => api.post('/documents', documentData),
  getAll: () => api.get('/documents'),
  getOne: (id) => api.get(`/documents/${id}`),
  update: (id, documentData) => api.put(`/documents/${id}`, documentData),
  delete: (id) => api.delete(`/documents/${id}`),
  addCollaborator: (id, userId) => api.post(`/documents/${id}/collaborators`, { userId })
};

export default api; 