import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const workflowService = {
  getAll: () => api.get('/workflows'),
  getById: (id) => api.get(`/workflows/${id}`),
  create: (workflow) => api.post('/workflows', workflow),
  update: (id, workflow) => api.put(`/workflows/${id}`, workflow),
  delete: (id) => api.delete(`/workflows/${id}`),
  execute: (id, inputData) => api.post(`/workflows/${id}/execute`, inputData),
  getExecutions: (id) => api.get(`/workflows/${id}/executions`),
};

export const aiService = {
  process: (prompt, context) => api.post('/ai/process', { prompt, context }),
  analyze: (data, analysisType) => api.post('/ai/analyze', { data, analysisType }),
  generateDecision: (scenario, parameters) => 
    api.post('/ai/decision', { scenario, parameters }),
};

export default api;

