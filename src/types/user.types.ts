// src/types/user.types.ts
export interface User {
  _id: string;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  role?: string;
  statut?: string;
  dateCreation?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  roleRef?: {
    _id: string;
    name: string;
  };
  isActive?: boolean;
  phone?: string;
}

export interface CreateUserDTO {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role?: string;
  statut?: string;
  motDePasse: string;
}

export interface UpdateUserDTO {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  role?: string;
  statut?: string;
  motDePasse?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}