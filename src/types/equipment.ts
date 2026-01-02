// src/types/equipment.ts

export interface Equipment {
  _id: string;
  nom: string;
  photo: string | null;
  description: string;
  capacite: {
    valeur: number;
    unite: string;
  };
  type: string;
  localisation: string;
  horairesDisponibles: {
    lundi?: string;
    mardi?: string;
    mercredi?: string;
    jeudi?: string;
    vendredi?: string;
    samedi?: string;
    dimanche?: string;
  };
  conditionsAcces: string;
  statut: 'Disponible' | 'Hors service' | 'Maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFormData {
  nom: string;
  photo: string | null;
  description: string;
  capacite: {
    valeur: number;
    unite: string;
  };
  type: string;
  localisation: string;
  horairesDisponibles: {
    lundi: string;
    mardi: string;
    mercredi: string;
    jeudi: string;
    vendredi: string;
    samedi: string;
    dimanche: string;
  };
  conditionsAcces: string;
  statut: 'Disponible' | 'Hors service' | 'Maintenance';
}

export const EQUIPMENT_TYPES = [
  'Équipement informatique',
  'Équipement bureautique',
  'Machine industrielle',
  'Outil électrique',
  'Matériel de laboratoire',
  'Autre'
] as const;

export const EQUIPMENT_LOCALISATIONS = [
  'Salle 1',
  'Salle 2',
  'Atelier Principal',
  'Salle A',
  'Salle B',
  'Entrepôt'
] as const;

export const CAPACITY_UNITS = ['kg', 'litres', 'personnes', 'unités', 'watts', 'autres'] as const;

export const DAYS_OF_WEEK = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;