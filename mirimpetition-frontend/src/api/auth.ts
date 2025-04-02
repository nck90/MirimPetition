import axiosInstance from './axios';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export const authApi = {
  register: (data: RegisterData) => 
    axiosInstance.post<AuthResponse>('/auth/register', data),
  
  login: (data: LoginData) => 
    axiosInstance.post<AuthResponse>('/auth/login', data),
  
  logout: () => 
    axiosInstance.post('/auth/logout'),
}; 