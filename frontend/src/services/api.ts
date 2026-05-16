import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
});

export const startResearch = async (query: string) => {
  const response = await api.post('/api/research', { query });
  return response.data;
};

export const getResearchJob = async (jobId: string) => {
  const response = await api.get(`/api/research/${jobId}`);
  return response.data;
};

export default api;
