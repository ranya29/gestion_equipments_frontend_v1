// src/services/userService.ts

import { User, UserFormData } from "../types/user.types";
import usersApi from "./api/usersApi";

const userService = {
  // --- Récupérer tous les users ---
  getAllUsers: async (): Promise<User[]> => {
    return await usersApi.getAll();
  },

  // --- Recherche ---
  searchUsers: async (search: string): Promise<User[]> => {
    return await usersApi.search(search);
  },

  // --- Ajouter ---
  createUser: async (userData: UserFormData): Promise<User> => {
  const payload = {
    username: userData.username || `${userData.nom}.${userData.prenom}`,
    email: userData.email,
    password: userData.motDePasse!, // le "!" dit à TS qu’il existe
    roleName: userData.role
  };
  return await usersApi.register(payload);
},


  // --- Modifier ---
  updateUser: async (id: string, userData: Partial<UserFormData>): Promise<User> => {
    return await usersApi.update(id, userData);
  },

  // --- Supprimer ---
  deleteUser: async (id: string): Promise<void> => {
    return await usersApi.delete(id);
  },
};

export default userService;
