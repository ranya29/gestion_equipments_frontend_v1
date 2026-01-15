import { useState } from 'react';
import { X } from 'lucide-react';
import { equipmentApi } from '../../api/equipmentApi';
import { 
  EquipmentFormData,
  EQUIPMENT_TYPES,
  EQUIPMENT_LOCALISATIONS,
  CAPACITY_UNITS
} from '../../types/equipment';

interface EquipmentFormModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EquipmentFormModal({ show, onClose, onSuccess }: EquipmentFormModalProps) {
  const [formData, setFormData] = useState<EquipmentFormData>({
    nom: '',
    photo: null,
    description: '',
    capacite: { valeur: 0, unite: 'unités' },
    type: 'Équipement informatique',
    localisation: 'Salle 1',
    horairesDisponibles: {
      lundi: 'Fermé', mardi: 'Fermé', mercredi: 'Fermé',
      jeudi: 'Fermé', vendredi: 'Fermé', samedi: 'Fermé', dimanche: 'Fermé'
    },
    conditionsAcces: '',
    statut: 'Disponible'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nom.trim() || formData.nom.length < 3) return setError('Nom invalide');
    if (!formData.description.trim() || formData.description.length < 10) return setError('Description invalide');
    if (!formData.conditionsAcces.trim()) return setError('Conditions d\'accès obligatoires');
    if (formData.capacite.valeur <= 0) return setError('Capacité doit être > 0');

    try {
      setError(null);
      setLoading(true);
      await equipmentApi.create(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full my-8">
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nouvel équipement</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-400 text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom *</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-4 py-2 border rounded-lg" />
              {formData.photo && <img src={formData.photo} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                {EQUIPMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Localisation *</label>
              <select value={formData.localisation} onChange={(e) => setFormData({ ...formData, localisation: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                {EQUIPMENT_LOCALISATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacité *</label>
              <input type="number" value={formData.capacite.valeur} onChange={(e) => setFormData({ ...formData, capacite: { ...formData.capacite, valeur: parseFloat(e.target.value) || 0 } })} min={0} className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unité *</label>
              <select value={formData.capacite.unite} onChange={(e) => setFormData({ ...formData, capacite: { ...formData.capacite, unite: e.target.value } })} className="w-full px-4 py-2 border rounded-lg">
                {CAPACITY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button onClick={onClose} disabled={loading} className="flex-1 px-6 py-3 border rounded-lg">Annuler</button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg">
              {loading ? 'En cours...' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
