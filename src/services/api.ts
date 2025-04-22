import axios from "axios";

// Use relative path since we're using Vite proxy
const API_URL = "/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string;
}

interface AuthResponse {
  token: string;
  user: User;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string;
}

const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    console.log("API response:", response.data);
    return response.data;
  },
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },
};

const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data;
  },
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },
};

export { api, authService, userService };
export type { User, AuthResponse };
