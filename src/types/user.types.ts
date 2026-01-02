//y3ref chkl lintrface mta3 
//y3awena bech norbtou l front m3a l backend b nafssn l structure
export interface User {
  _id: string;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  telephone?: string;
  statut: "actif" | "inactif";
  role: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  nom: string;
  prenom: string;
  username: string;
  email: string;
  telephone?: string;
  statut: "actif" | "inactif";
  role: string;      // Role ID
  motDePasse?: string;
}
export interface CreateUserDTO {
  nom: string;
  prenom: string;
  username: string;
  email: string;
  telephone?: string;
  statut?: "actif" | "inactif";
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  nom?: string;
  prenom?: string;
  username?: string;
  email?: string;
  telephone?: string;
  statut?: "actif" | "inactif";
  password?: string;
  role?: string;
}
export interface UserRegisterPayload {
  username: string;
  email: string;
  password: string;
  roleName: string;
}

