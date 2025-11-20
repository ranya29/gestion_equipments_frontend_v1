import axios from '../api/axios';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Change Password
  changePassword: async (oldPassword, newPassword) => {
    const response = await axios.put('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};