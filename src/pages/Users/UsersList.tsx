//lahne presque kol chy : utulisateur, les button 


import { useEffect, useState } from "react";
import usersApi from "../../services/api/usersApi";
import { User, UserFormData } from "../../types/user.types";
import UserModal from "../../components/Users/UserModal";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Charger les utilisateurs ---
  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Recherche ---
  const handleSearch = (value: string) => {
    setSearch(value);

    const filtered = users.filter(
      (u) =>
        u.nom?.toLowerCase().includes(value.toLowerCase()) ||
        u.prenom?.toLowerCase().includes(value.toLowerCase()) ||
        u.username?.toLowerCase().includes(value.toLowerCase()) ||
        u.email?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setFilteredUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const handleSubmitUser = async (data: UserFormData) => {
  try {
    let response;

    if (selectedUser) {
      // MODE EDIT
      const payload: Partial<UserFormData> = { ...data };
      if (!payload.motDePasse) delete payload.motDePasse;
      response = await usersApi.update(selectedUser._id, payload);
    } else {
      // MODE CREATE → transformer data en UserRegisterPayload
      const payload = {
        username: data.username || `${data.nom}.${data.prenom}`,
        email: data.email,
        password: data.motDePasse!,
        roleName: data.role
      };
      console.log("Payload envoyé :", payload); // <--- log pour debug
      response = await usersApi.register(payload);
    }

    if (response) {
      await fetchUsers();
      handleModalClose();
    }
  } catch (error) {
    console.error("❌ Erreur API :", error);
  }
};





return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER + SEARCH */}
      <div className="flex justify-between items-center mb-6">

        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="🔍 Rechercher un utilisateur…"
            className="border border-gray-300 w-full px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Button Add */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
          onClick={handleAddUser}
        >
          + Ajouter un utilisateur
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3 border-b">Nom</th>
              <th className="p-3 border-b">Prénom</th>
              <th className="p-3 border-b">Username</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Téléphone</th>
              <th className="p-3 border-b">Statut</th>
              <th className="p-3 border-b">Rôle</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="p-3">{user.nom || "—"}</td>
                  <td className="p-3">{user.prenom || "—"}</td>
                  <td className="p-3">{user.username || "—"}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.telephone || "Non renseigné"}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        user.statut === "actif"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {user.statut}
                    </span>
                  </td>
                  <td className="p-3">
                    {typeof user.role === "string" ? user.role : user.role?.name}
                  </td>

                  <td className="p-3 flex gap-3 justify-center">

                    {/* EDIT BUTTON */}
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg shadow transition"
                      onClick={() => handleEdit(user)}
                    >
                      Modifier
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow transition"
                      onClick={() => handleDelete(user._id)}
                    >
                      Supprimer
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          mode={selectedUser ? "edit" : "create"}
          user={selectedUser}
          onClose={handleModalClose}
          onSubmit={handleSubmitUser}
          
        />
      )}
    </div>
  );
};

export default UsersList;
