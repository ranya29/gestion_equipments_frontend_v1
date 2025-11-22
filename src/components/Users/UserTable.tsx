// src/components/Users/UserTable.tsx
import { User } from '../../types/user.types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  loading: boolean;
}

const UserTable = ({ users, onEdit, onDelete, loading }: UserTableProps) => {
  // Fonction pour formater le nom complet
  const getFullName = (user: User) => {
    if (user.nom && user.prenom) {
      return `${user.prenom} ${user.nom}`;
    }
    if (user.username) {
      return user.username;
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Non renseigné';
  };

  // Fonction pour obtenir le rôle
  const getRole = (user: User) => {
    if (user.role) return user.role;
    if (user.roleRef?.name) return user.roleRef.name;
    return 'Utilisateur';
  };

  // Fonction pour obtenir le statut
  const getStatus = (user: User) => {
    return user.statut || (user.isActive ? 'actif' : 'inactif');
  };

  // Fonction pour obtenir le téléphone
  const getPhone = (user: User) => {
    return user.telephone || user.phone || 'Non renseigné';
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Nom Complet
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Téléphone
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Rôle
              </th>
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                Statut
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400">
                      Aucun utilisateur trouvé
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
                >
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                        {getFullName(user)
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()
                          .substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-black dark:text-white font-medium">
                          {getFullName(user)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white">{user.email}</p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white">{getPhone(user)}</p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-black dark:text-white capitalize">
                      {getRole(user)}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        getStatus(user) === 'actif'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {getStatus(user)}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-3 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        onClick={() => user._id && onDelete(user._id)}
                        className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 px-3 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;