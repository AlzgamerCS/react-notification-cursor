import api from './api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  VerifyEmailRequest,
  ResendVerificationRequest 
} from '../types/auth';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification'
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  
  // Store auth data
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, data);
  
  // Store auth data
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<void> => {
  await api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, data);
};

export const resendVerification = async (data: ResendVerificationRequest): Promise<void> => {
  await api.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, data);
};

export const logout = () => {
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