import api from '../axios';

export interface RoleFormData {
  name: string;
  permissions: string[];
}

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

const RoleService = {
  getAll: () => api.get<Role[]>("/roles"),
  getById: (id: string) => api.get<Role>(`/roles/${id}`),
  create: (data: RoleFormData) => api.post<Role>("/roles", data),
  update: (id: string, data: RoleFormData) => api.put<Role>(`/roles/${id}`, data),
  delete: (id: string) => api.delete(`/roles/${id}`),
};

export default RoleService;
