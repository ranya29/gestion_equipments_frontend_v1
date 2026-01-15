import axios from '../axios';
import type { AuthUser } from '../types/auth.types';

interface AuthResponse {
  token: string;
  user: AuthUser;
  message?: string;
}

interface RegisterUserData {
  prenom: string;
  nom: string;
  username: string;
  email: string;
  password: string;
  roleName: string;
}

export const authService = {
  // Register
  register: async (userData: RegisterUserData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get Profile
  getProfile: async (): Promise<AuthResponse> => {
    const response = await axios.get<AuthResponse>('/auth/profile');
    return response.data;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/login';
  },

  // Change Password
  changePassword: async (oldPassword: string, newPassword: string): Promise<AuthResponse> => {
    const response = await axios.put<AuthResponse>('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: (): AuthUser | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
