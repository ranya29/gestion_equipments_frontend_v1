import apiClient from "@/config/api.config";

const rolesApi = {
  getAll: async () => {
    const res = await apiClient.get("/roles");
    return res.data;
  },

  create: async (data) => {
    const res = await apiClient.post("/roles", data);
    return res.data;
  },

  update: async (id, data) => {
    const res= await apiClient.put(`/roles/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/roles/${id}`);
  }
};

export default rolesApi;
