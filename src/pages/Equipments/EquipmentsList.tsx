import { useState } from "react";
import { Link } from "react-router-dom";

// Types
interface Equipment {
  id: number;
  name: string;
  description: string;
  location: string;
  status: "available" | "maintenance" | "outofservice";
  capacity: number;
  image?: string;
}

const EquipmentsList = () => {
  // Données exemple - À remplacer par un appel API
  const [equipments] = useState<Equipment[]>([
    {
      id: 1,
      name: "Microscope électronique",
      description: "Microscope haute résolution pour recherche",
      location: "Laboratoire A - Salle 101",
      status: "available",
      capacity: 2,
      image: "/images/equipment/microscope.jpg",
    },
    {
      id: 2,
      name: "Imprimante 3D",
      description: "Imprimante 3D professionnelle",
      location: "Atelier B - Salle 205",
      status: "maintenance",
      capacity: 1,
      image: "/images/equipment/3dprinter.jpg",
    },
    {
      id: 3,
      name: "Spectromètre",
      description: "Spectromètre de masse",
      location: "Laboratoire C - Salle 303",
      status: "available",
      capacity: 3,
      image: "/images/equipment/spectrometer.jpg",
    },
    {
      id: 4,
      name: "Scanner 3D",
      description: "Scanner 3D haute précision",
      location: "Atelier D - Salle 410",
      status: "outofservice",
      capacity: 1,
      image: "/images/equipment/scanner.jpg",
    },
  ]);

  const getStatusBadge = (status: Equipment["status"]) => {
    const statusConfig = {
      available: {
        text: "Disponible",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      maintenance: {
        text: "Maintenance",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      outofservice: {
        text: "Hors service",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des Équipements
        </h2>
        <Link
          to="/equipments/add"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter un équipement
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Équipements
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {equipments.length}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Disponibles
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {equipments.filter((e) => e.status === "available").length}
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                En maintenance
              </p>
              <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {equipments.filter((e) => e.status === "maintenance").length}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
              <svg
                className="h-8 w-8 text-yellow-600 dark:text-yellow-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3">
                  Localisation
                </th>
                <th scope="col" className="px-6 py-3">
                  Capacité
                </th>
                <th scope="col" className="px-6 py-3">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment) => (
                <tr
                  key={equipment.id}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="mr-3 h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                          <svg
                            className="h-6 w-6 text-gray-500 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {equipment.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {equipment.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{equipment.location}</td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 dark:text-white">
                      {equipment.capacity} {equipment.capacity > 1 ? "personnes" : "personne"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(equipment.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/equipments/${equipment.id}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        Voir
                      </Link>
                      <Link
                        to={`/equipments/edit/${equipment.id}`}
                        className="font-medium text-green-600 hover:underline dark:text-green-500"
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        className="font-medium text-red-600 hover:underline dark:text-red-500"
                        onClick={() => {
                          if (
                            confirm(
                              `Êtes-vous sûr de vouloir supprimer "${equipment.name}" ?`
                            )
                          ) {
                            // Logique de suppression
                            console.log("Supprimer équipement:", equipment.id);
                          }
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipmentsList;