import axios from 'axios';
import { handleMockFallback } from './mockService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('leaveflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: automatically fall back to client mock store if static host returns HTML or 405/404/network error
api.interceptors.response.use(
  async (response) => {
    // Detect if static hosting (Vercel/GitHub Pages) returned index.html content for an API endpoint
    const isHtmlResponse =
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') ||
        response.data.includes('<html') ||
        response.data.includes('<head'));

    if (isHtmlResponse && response.config) {
      try {
        return await handleMockFallback(response.config);
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }
    return response;
  },
  async (error) => {
    const isStaticHostError =
      error.response?.status === 405 ||
      error.response?.status === 404 ||
      !error.response ||
      error.code === 'ERR_NETWORK';

    if (isStaticHostError && error.config) {
      try {
        const mockResponse = await handleMockFallback(error.config);
        return mockResponse;
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('leaveflow_token');
      localStorage.removeItem('leaveflow_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
