import axios, { AxiosError } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Configuration
const api = axios.create({
  baseURL: '/api/v1', // Using Vite's proxy configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're already on the login page
      const isLoginPage = window.location.pathname === '/login';
      
      // Dispatch logout action to clear Redux state
      store.dispatch(logout());
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not on login page
      if (!isLoginPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  DOCUMENTS: {
    LIST: '/documents/my',
    CREATE: '/documents',
    DELETE: (id: string) => `/documents/${id}`,
    DOWNLOAD: (filePath: string) => `/files/download/${filePath}`,
    UPLOAD: '/files/upload',
  },
  NOTIFICATIONS: {
    LIST: '/notifications/my',
    CREATE: '/notifications',
    CREATE_WITH_EVENT: '/notifications/with-event',
    DELETE: (id: string) => `/notifications/${id}`,
  },
  USER: {
    PROFILE: '/users/profile',
  },
};

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unexpected error occurred';
};

export default api; 