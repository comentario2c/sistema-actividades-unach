import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.228.20.221:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;