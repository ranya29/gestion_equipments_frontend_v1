// src/services/userService.ts
import { User, CreateUserDTO, UpdateUserDTO, UsersResponse } from '../types/user.types';
// Vérifie que l'import est correct
import apiClient from '../config/api.config';  // ← Le bon chemin
const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async (): Promise<UsersResponse> => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },

  // Créer un nouvel utilisateur
  createUser: async (userData: CreateUserDTO): Promise<User> => {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id: string, userData: UpdateUserDTO): Promise<User> => {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  // Rechercher des utilisateurs
  searchUsers: async (query: string): Promise<User[]> => {
    try {
      const response = await apiClient.get(`/users/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      throw error;
    }
  },
};

export default userService;