import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEquipment = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: 1,
    status: "available" as "available" | "maintenance" | "outofservice",
    hoursAvailable: "",
    conditions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Remplacer par votre appel API
      console.log("Données à envoyer:", formData);
      
      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Équipement ajouté avec succès !");
      navigate("/equipments");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout de l'équipement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ajouter un équipement
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Remplissez les informations de l'équipement
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Nom de l'équipement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Ex: Microscope électronique"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Décrivez l'équipement..."
            />
          </div>

          {/* Localisation */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Localisation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Ex: Laboratoire A - Salle 101"
            />
          </div>

          {/* Capacité et Statut */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Capacité */}
            <div>
              <label
                htmlFor="capacity"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Capacité (nombre de personnes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Statut */}
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="available">Disponible</option>
                <option value="maintenance">En maintenance</option>
                <option value="outofservice">Hors service</option>
              </select>
            </div>
          </div>

          {/* Horaires disponibles */}
          <div>
            <label
              htmlFor="hoursAvailable"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Horaires disponibles
            </label>
            <input
              type="text"
              id="hoursAvailable"
              name="hoursAvailable"
              value={formData.hoursAvailable}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Ex: Lundi-Vendredi 8h-18h"
            />
          </div>

          {/* Conditions d'accès */}
          <div>
            <label
              htmlFor="conditions"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Conditions d'accès
            </label>
            <textarea
              id="conditions"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Ex: Formation obligatoire, badge requis..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-brand-800"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Ajout en cours...
                </>
              ) : (
                "Ajouter l'équipement"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/equipments")}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;