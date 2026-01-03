import { useEffect, useState } from "react";
import usersApi from "../../services/api/usersApi";
import { User, UserFormData } from "../../types/user.types";
import UserModal from "../../components/Users/UserModal";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "actif" | "inactif">("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Charger les utilisateurs ---
  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
      filterUsers(data, filterStatus, search);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filterUsers = (usersList: User[], status: string, searchTerm: string) => {
    let result = usersList;

    if (status !== "all") {
      result = result.filter((u) => u.statut === status);
    }

    if (searchTerm) {
      result = result.filter(
        (u) =>
          u.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);
  };

  // --- Recherche ---
  const handleSearch = (value: string) => {
    setSearch(value);
    filterUsers(users, filterStatus, value);
  };

  // --- Filtres par statut ---
  const handleFilterStatus = (status: "all" | "actif" | "inactif") => {
    setFilterStatus(status);
    filterUsers(users, status, search);
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
      fetchUsers();
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
      if (selectedUser) {
        const payload: Partial<UserFormData> = { ...data };
        if (!payload.motDePasse) delete payload.motDePasse;
        await usersApi.update(selectedUser._id, payload);
      } else {
        const payload = {
          username: data.username || `${data.nom}.${data.prenom}`,
          email: data.email,
          password: data.motDePasse!,
          roleName: data.role
        };
        await usersApi.register(payload);
      }
      await fetchUsers();
      handleModalClose();
    } catch (error) {
      console.error("❌ Erreur API :", error);
    }
  };

  const stats = {
    total: users.length,
    actif: users.filter((u) => u.statut === "actif").length,
    inactif: users.filter((u) => u.statut === "inactif").length,
  };

  const getStatusBadge = (status: string) => {
    const config = {
      actif: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      inactif: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gérer les Utilisateurs</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ajouter, modifier ou supprimer des utilisateurs
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actifs</p>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{stats.actif}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactifs</p>
          <p className="mt-2 text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.inactif}</p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", "actif", "inactif"].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterStatus(status as any)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filterStatus === status
                ? "bg-brand-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {status === "all" ? "Tous" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}

        <div className="ml-auto relative w-1/3">
          <input
            type="text"
            placeholder="🔍 Rechercher un utilisateur…"
            className="border border-gray-300 w-full px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
          onClick={handleAddUser}
        >
          + Ajouter un utilisateur
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Nom</th>
                  <th className="px-6 py-3">Prénom</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Téléphone</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Rôle</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">{user.nom || "—"}</td>
                    <td className="px-6 py-4">{user.prenom || "—"}</td>
                    <td className="px-6 py-4">{user.username || "—"}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.telephone || "—"}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.statut)}</td>
                    <td className="px-6 py-4">{typeof user.role === "string" ? user.role : user.role?.name}</td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
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
