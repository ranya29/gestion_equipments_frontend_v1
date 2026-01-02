// src/components/Users/UserTable.tsx
import { User } from '../../types/user.types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  loading: boolean;
}

const UserTable = ({ users, onEdit, onDelete, loading }: UserTableProps) => {
  
  // 🟦 Nom complet logique
  const getFullName = (user: User) => {
    if (user.prenom && user.nom) return `${user.prenom} ${user.nom}`;
    return user.username || "Non renseigné";
  };

  // 🟩 Rôle formaté
  const getRole = (user: User) => {
    if (typeof user.role === "string") return user.role;
    return user.role?.name || "Utilisateur";
  };

  // 🟧 Statut formaté
  const getStatus = (user: User) => user.statut || "inactif";

  // 🟪 Téléphone fallback
  const getPhone = (user: User) => user.telephone || "Non renseigné";

  if (loading) {
    return (
      <div className="rounded border bg-white px-5 py-6 shadow">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border bg-white shadow overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-4 px-4">Nom Complet</th>
            <th className="py-4 px-4">Email</th>
            <th className="py-4 px-4">Téléphone</th>
            <th className="py-4 px-4">Rôle</th>
            <th className="py-4 px-4">Statut</th>
            <th className="py-4 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 px-4 text-center">
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const fullName = getFullName(user);

              return (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="font-medium">{fullName}</p>
                    </div>
                  </td>

                  <td className="py-5 px-4">{user.email}</td>
                  <td className="py-5 px-4">{getPhone(user)}</td>
                  <td className="py-5 px-4">{getRole(user)}</td>

                  <td className="py-5 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getStatus(user) === "actif"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {getStatus(user)}
                    </span>
                  </td>

                  <td className="py-5 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() => onDelete(user._id!)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
