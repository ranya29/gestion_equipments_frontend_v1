// usersApi.ts
import api from "../../axios";
import { User, UserRegisterPayload, UpdateUserDTO } from "../../types/user.types";

const usersApi = {
  /** Get all users */
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  /** Search users */
  search: async (query: string): Promise<User[]> => {
    const response = await api.get(`/users?search=${query}`);
    return response.data;
  },

  /** Create / Register a user */
  register: async (data: UserRegisterPayload): Promise<User> => {
    const response = await api.post("/auth/register", data);
    return response.data.user;
  },

  /** Update a user */
  update: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  /** Delete a user */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};

export default usersApi;
