// src/pages/Users/UsersList.tsx
import { useState, useEffect, useCallback } from 'react';
import UserTable from '../../components/Users/UserTable';
import UserModal from '../../components/Users/UserModal';
import userService from '../../services/userService';
import { User, CreateUserDTO, UpdateUserDTO } from '../../types/user.types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Afficher une notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Récupérer tous les utilisateurs
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response); // ✅ CORRIGÉ : response au lieu de response.users
    } catch (error) {
      showNotification('error', 'Erreur lors du chargement des utilisateurs');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Ouvrir le modal pour ajouter un utilisateur
  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier un utilisateur
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Soumettre le formulaire (créer ou modifier)
  const handleSubmitUser = async (userData: CreateUserDTO | UpdateUserDTO) => {
    try {
      if (modalMode === 'create') {
        await userService.createUser(userData as CreateUserDTO);
        showNotification('success', 'Utilisateur créé avec succès');
      } else if (selectedUser?._id) {
        await userService.updateUser(selectedUser._id, userData as UpdateUserDTO);
        showNotification('success', 'Utilisateur modifié avec succès');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Une erreur est survenue';
      showNotification('error', errorMessage);
      console.error('Error submitting user:', error);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.deleteUser(userId);
        showNotification('success', 'Utilisateur supprimé avec succès');
        fetchUsers();
      } catch (error) {
        showNotification('error', 'Erreur lors de la suppression');
        console.error('Error deleting user:', error);
      }
    }
  };

  // Rechercher des utilisateurs
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      fetchUsers();
      return;
    }

    try {
      const results = await userService.searchUsers(query);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Filtrer les utilisateurs côté client
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.nom?.toLowerCase().includes(searchLower) ||
      user.prenom?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.telephone?.includes(searchQuery)
    );
  });

  return (
    <>
      {/* Breadcrumb personnalisé */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Gestion des Utilisateurs
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/">
                Tableau de bord /
              </a>
            </li>
            <li className="font-medium text-primary">Utilisateurs</li>
          </ol>
        </nav>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 flex w-full rounded-lg border-l-6 px-7 py-4 shadow-md ${
            notification.type === 'success'
              ? 'border-[#34D399] bg-[#34D399] bg-opacity-[15%]'
              : 'border-[#F87171] bg-[#F87171] bg-opacity-[15%]'
          }`}
        >
          <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            {notification.type === 'success' ? (
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                  fill="#34D399"
                  stroke="#34D399"
                ></path>
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                  fill="#F87171"
                  stroke="#F87171"
                ></path>
              </svg>
            )}
          </div>
          <div className="w-full">
            <h5
              className={`mb-1 font-semibold ${
                notification.type === 'success' ? 'text-[#34D399]' : 'text-[#F87171]'
              }`}
            >
              {notification.type === 'success' ? 'Succès' : 'Erreur'}
            </h5>
            <p className="text-base leading-relaxed text-body">
              {notification.message}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-10">
        {/* Header avec recherche et bouton ajouter */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Liste des Utilisateurs ({filteredUsers.length})
              </h4>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Barre de recherche */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute left-3 top-3">
                    <svg
                      className="fill-body"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                        fill=""
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.9572 11.9572C12.2501 11.6643 12.7249 11.6643 13.0178 11.9572L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.9572 13.0178C11.6643 12.7249 11.6643 12.2501 11.9572 11.9572Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </div>

                {/* Bouton ajouter */}
                <button
                  onClick={handleAddUser}
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90"
                >
                  <svg
                    className="fill-current"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                      fill=""
                    />
                  </svg>
                  Ajouter un utilisateur
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <UserTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          loading={loading}
        />

        {/* Modal */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitUser}
          user={selectedUser}
          mode={modalMode}
        />
      </div>
    </>
  );
};

export default UsersList;