// src/components/Users/UserModal.tsx
import { useState, useEffect } from 'react';
import { User, CreateUserDTO, UpdateUserDTO } from '../../types/user.types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserDTO | UpdateUserDTO) => void;
  user: User | null;
  mode: 'create' | 'edit';
}

const UserModal = ({ isOpen, onClose, onSubmit, user, mode }: UserModalProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'utilisateur',
    statut: 'actif',
    motDePasse: ''
  });

  useEffect(() => {
    if (isOpen && user && mode === 'edit') {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        role: user.role || 'utilisateur',
        statut: user.statut || 'actif',
        motDePasse: ''
      });
    }
  }, [isOpen, user, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'create' ? 'Créer un utilisateur' : 'Modifier l\'utilisateur'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                  <option value="utilisateur">Utilisateur</option>
                  <option value="admin">Administrateur</option>
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

            <div>
              <label className="block mb-1">
                {mode === 'create' ? 'Mot de passe *' : 'Mot de passe (laisser vide pour ne pas modifier)'}
              </label>
              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                required={mode === 'create'}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* BOUTONS VISIBLES */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {mode === 'create' ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;