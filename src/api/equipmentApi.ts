// src/api/equipmentApi.ts

import { Equipment, EquipmentFormData } from "../types/equipment";

const API_URL = 'http://localhost:3000/api/equipments';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: string[];
}

export const equipmentApi = {
  // Récupérer tous les équipements avec filtres optionnels
  getAll: async (filters?: {
    statut?: string;
    type?: string;
    localisation?: string;
  }): Promise<Equipment[]> => {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.localisation) params.append('localisation', filters.localisation);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    const data: ApiResponse<Equipment[]> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la récupération des équipements');
    }
    
    return data.data || [];
  },

  // Récupérer un équipement par ID
  getById: async (id: string): Promise<Equipment> => {
    const response = await fetch(`${API_URL}/${id}`);
    const data: ApiResponse<Equipment> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Équipement non trouvé');
    }
    
    if (!data.data) {
      throw new Error('Équipement non trouvé');
    }
    
    return data.data;
  },

  // Créer un nouvel équipement
  create: async (equipmentData: EquipmentFormData): Promise<Equipment> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipmentData),
    });
    
    const data: ApiResponse<Equipment> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création de l\'équipement');
    }
    
    if (!data.data) {
      throw new Error('Erreur lors de la création de l\'équipement');
    }
    
    return data.data;
  },

  // Mettre à jour un équipement
  update: async (id: string, equipmentData: Partial<EquipmentFormData>): Promise<Equipment> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipmentData),
    });
    
    const data: ApiResponse<Equipment> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour de l\'équipement');
    }
    
    if (!data.data) {
      throw new Error('Erreur lors de la mise à jour de l\'équipement');
    }
    
    return data.data;
  },

  // Supprimer un équipement
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    const data: ApiResponse<never> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la suppression de l\'équipement');
    }
  },

  // Récupérer les statistiques
  getStats: async (): Promise<{
    total: number;
    parStatut: Array<{ _id: string; count: number }>;
  }> => {
    const response = await fetch(`${API_URL}/stats/all`);
    const data: ApiResponse<{
      total: number;
      parStatut: Array<{ _id: string; count: number }>;
    }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
    }
    
    return data.data || { total: 0, parStatut: [] };
  },
};