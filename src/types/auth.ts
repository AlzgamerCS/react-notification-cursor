export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string;
  emailVerified: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface LoginResponse {
  id: string;
  createdAt: string | undefined;
  token: string;
  user: User;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string;
  emailVerified: boolean;
}

export interface RegisterResponse {
  id: string;
  createdAt: string | undefined;
  token: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 