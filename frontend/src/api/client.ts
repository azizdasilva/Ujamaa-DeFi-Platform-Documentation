/**
 * API Client Configuration
 * Ujamaa DeFi Platform
 * 
 * Centralized axios instance for all API calls
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Auto-detect API URL: localhost for local dev, production URL for Vercel
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://ujamaa-de-fi-platform-backend.vercel.app');

const API_FULL_URL = `${API_BASE_URL}/api/v2`;

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_FULL_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const user = sessionStorage.getItem('ujamaa_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear session and redirect to login
      sessionStorage.removeItem('ujamaa_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
