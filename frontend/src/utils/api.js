import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const dashboardAPI = {
  overview: () => api.get('/dashboard/overview'),
};

export const assetsAPI = {
  list: (params) => api.get('/assets', { params }),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(`/assets/${id}`, data),
  remove: (id) => api.delete(`/assets/${id}`),
};

export const risksAPI = {
  list: () => api.get('/risks'),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  remove: (id) => api.delete(`/risks/${id}`),
};

export const assessmentsAPI = {
  questions: () => api.get('/assessments/questions'),
  submit: (answers) => api.post('/assessments', { answers }),
  myLatest: () => api.get('/assessments/me'),
  list: () => api.get('/assessments'),
};

export const intelligenceAPI = {
  anomalies: () => api.get('/intelligence/anomalies'),
};

export const networkAPI = {
  scan: () => api.post('/network/scan'),
  latest: () => api.get('/network/scan/latest'),
};

export const copilotAPI = {
  ask: (question) => api.post('/copilot/ask', { question }),
};

export const gameAPI = {
  getProgress: () => api.get('/game/progress'),
  saveProgress: (data) => api.post('/game/progress', data),
};

export const chatbotAPI = {
  ask: (question) => api.post('/chatbot/ask', { question }),
};

export default api;
