import { useState, useEffect } from 'react';
import { User, UserFormData } from '../../types/user.types';

interface UserModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  user: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

const UserModal = ({ isOpen, onClose, onSubmit, user, mode }: UserModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    nom: '',
    prenom: '',
    username: '',
    email: '',
    telephone: '',
    role: '',
    statut: 'actif',
    motDePasse: ''
  });

  // ⚡ Remplir correctement le formulaire en mode edit
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && user) {
      setFormData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        username: user.username || "",
        email: user.email || "",
        telephone: user.telephone || "",
        role: user.role && typeof user.role === "object" ? user.role.name : (user.role || ""),
        statut: user.statut || "actif",
        motDePasse: "" // toujours vide en edit
      });
    }

    if (mode === "create") {
      setFormData({
        nom: "",
        prenom: "",
        username: "",
        email: "",
        telephone: "",
        role: "",
        statut: "actif",
        motDePasse: ""
      });
    }
  }, [isOpen, mode, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          {mode === "create" ? "Créer un utilisateur" : "Modifier l'utilisateur"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block mb-1">Nom d'utilisateur *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Rôle & Statut */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Rôle *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="admin">Admin</option>
                  <option value="user">Utilisateur</option>
                  <option value="superviseur">Superviseur</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Statut *</label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  required
                  className="w-full border rounded p-2"
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block mb-1">
                {mode === "create" ? "Mot de passe *" : "Mot de passe (optionnel)"}
              </label>
              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                required={mode === "create"}
                className="w-full border rounded p-2"
              />
            </div>

          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {mode === "create" ? "Créer" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
