import api from './api';
import { LoginRequest, LoginResponse } from '../types/auth';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  
  // Store auth data
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const getStoredToken = () => {
  return localStorage.getItem('token');
}; 