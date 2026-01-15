

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Calendar, MapPin, Activity } from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import { equipmentApi } from '../../api/equipmentApi';
import { 
  Equipment, 
  EquipmentFormData,
  EQUIPMENT_TYPES,
  EQUIPMENT_LOCALISATIONS,
  CAPACITY_UNITS,
  DAYS_OF_WEEK 
} from '../../types/equipment';

export default function EquipmentManagement() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLocalisation, setFilterLocalisation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<EquipmentFormData>({
    nom: '',
    photo: null,
    description: '',
    capacite: {
      valeur: 0,
      unite: 'unités'
    },
    type: 'Équipement informatique',
    localisation: 'Salle 1',
    horairesDisponibles: {
      lundi: 'Fermé',
      mardi: 'Fermé',
      mercredi: 'Fermé',
      jeudi: 'Fermé',
      vendredi: 'Fermé',
      samedi: 'Fermé',
      dimanche: 'Fermé'
    },
    conditionsAcces: '',
    statut: 'Disponible'
  });

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    fetchEquipments();
  }, []);

  useEffect(() => {
    filterEquipments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipments, searchTerm, filterStatut, filterType, filterLocalisation]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentApi.getAll();
      setEquipments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipments = () => {
    let filtered = equipments;

    if (searchTerm) {
      filtered = filtered.filter(eq =>
        eq.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatut) {
      filtered = filtered.filter(eq => eq.statut === filterStatut);
    }

    if (filterType) {
      filtered = filtered.filter(eq => eq.type === filterType);
    }

    if (filterLocalisation) {
      filtered = filtered.filter(eq => eq.localisation === filterLocalisation);
    }

    setFilteredEquipments(filtered);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentEquipment(null);
    setFormData({
      nom: '',
      photo: null,
      description: '',
      capacite: { valeur: 0, unite: 'unités' },
      type: 'Équipement informatique',
      localisation: 'Salle 1',
      horairesDisponibles: {
        lundi: 'Fermé',
        mardi: 'Fermé',
        mercredi: 'Fermé',
        jeudi: 'Fermé',
        vendredi: 'Fermé',
        samedi: 'Fermé',
        dimanche: 'Fermé'
      },
      conditionsAcces: '',
      statut: 'Disponible'
    });
    setShowModal(true);
  };

  const openEditModal = (equipment: Equipment) => {
    setEditMode(true);
    setCurrentEquipment(equipment);
    setFormData({
      nom: equipment.nom,
      photo: equipment.photo,
      description: equipment.description,
      capacite: equipment.capacite,
      type: equipment.type,
      localisation: equipment.localisation,
      horairesDisponibles: {
        lundi: equipment.horairesDisponibles.lundi || 'Fermé',
        mardi: equipment.horairesDisponibles.mardi || 'Fermé',
        mercredi: equipment.horairesDisponibles.mercredi || 'Fermé',
        jeudi: equipment.horairesDisponibles.jeudi || 'Fermé',
        vendredi: equipment.horairesDisponibles.vendredi || 'Fermé',
        samedi: equipment.horairesDisponibles.samedi || 'Fermé',
        dimanche: equipment.horairesDisponibles.dimanche || 'Fermé'
      },
      conditionsAcces: equipment.conditionsAcces,
      statut: equipment.statut
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // Validation des champs
    if (!formData.nom.trim()) {
      setError('Le nom est obligatoire');
      return;
    }

    if (formData.nom.length < 3) {
      setError('Le nom doit contenir au moins 3 caractères');
      return;
    }

    if (!formData.description.trim()) {
      setError('La description est obligatoire');
      return;
    }

    if (formData.description.length < 10) {
      setError('La description doit contenir au moins 10 caractères');
      return;
    }

    if (!formData.conditionsAcces.trim()) {
      setError('Les conditions d\'accès sont obligatoires');
      return;
    }

    if (formData.capacite.valeur <= 0) {
      setError('La capacité doit être supérieure à 0');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      if (editMode && currentEquipment) {
        await equipmentApi.update(currentEquipment._id, formData);
        setSuccessMessage('Équipement mis à jour avec succès');
      } else {
        await equipmentApi.create(formData);
        setSuccessMessage('Équipement créé avec succès');
      }
      
      setShowModal(false);
      fetchEquipments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) return;

    try {
      setError(null);
      setLoading(true);
      await equipmentApi.delete(id);
      setSuccessMessage('Équipement supprimé avec succès');
      fetchEquipments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Disponible': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Hors service': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <>
      <PageMeta
        title="Gestion des Équipements | TailAdmin"
        description="Gérez tous vos équipements en un seul endroit"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des Équipements
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez tous vos équipements en un seul endroit
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
              <p className="text-red-800 dark:text-red-400">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
              <p className="text-green-800 dark:text-green-400">{successMessage}</p>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="Disponible">Disponible</option>
                <option value="Hors service">Hors service</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                {EQUIPMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filterLocalisation}
                onChange={(e) => setFilterLocalisation(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les localisations</option>
                {EQUIPMENT_LOCALISATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <button
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Equipment Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments.map((equipment) => (
                <div key={equipment._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Image */}
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                    {equipment.photo ? (
                      <img src={equipment.photo} alt={equipment.nom} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Activity className="w-16 h-16" />
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(equipment.statut)}`}>
                      {equipment.statut}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{equipment.nom}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{equipment.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{equipment.localisation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Activity className="w-4 h-4" />
                        <span>{equipment.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Capacité: {equipment.capacite.valeur} {equipment.capacite.unite}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => openEditModal(equipment)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(equipment._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredEquipments.length === 0 && !loading && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Aucun équipement trouvé</p>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full my-8">
                <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editMode ? 'Modifier l\'équipement' : 'Nouvel équipement'}
                    </h2>
                    <button 
                      onClick={() => {
                        setShowModal(false);
                        setError(null);
                      }} 
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Modal Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom *</label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                      />
                      {formData.photo && (
                        <img src={formData.photo} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {EQUIPMENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Localisation *</label>
                      <select
                        value={formData.localisation}
                        onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {EQUIPMENT_LOCALISATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacité (valeur) *</label>
                      <input
                        type="number"
                        value={formData.capacite.valeur}
                        onChange={(e) => setFormData({
                          ...formData,
                          capacite: { ...formData.capacite, valeur: parseFloat(e.target.value) || 0 }
                        })}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unité *</label>
                      <select
                        value={formData.capacite.unite}
                        onChange={(e) => setFormData({
                          ...formData,
                          capacite: { ...formData.capacite, unite: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {CAPACITY_UNITS.map(unite => (
                          <option key={unite} value={unite}>{unite}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut *</label>
                      <select
                        value={formData.statut}
                        onChange={(e) => setFormData({ ...formData, statut: e.target.value as 'Disponible' | 'Hors service' | 'Maintenance' })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Hors service">Hors service</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conditions d'accès *</label>
                      <textarea
                        value={formData.conditionsAcces}
                        onChange={(e) => setFormData({ ...formData, conditionsAcces: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Horaires disponibles</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {DAYS_OF_WEEK.map(jour => (
                          <div key={jour}>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">{jour}</label>
                            <input
                              type="text"
                              value={formData.horairesDisponibles[jour as keyof typeof formData.horairesDisponibles]}
                              onChange={(e) => setFormData({
                                ...formData,
                                horairesDisponibles: {
                                  ...formData.horairesDisponibles,
                                  [jour]: e.target.value
                                }
                              })}
                              placeholder="Ex: 9h-17h"
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setError(null);
                      }}
                      disabled={loading}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>En cours...</span>
                        </>
                      ) : (
                        <span>{editMode ? 'Mettre à jour' : 'Créer'}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}