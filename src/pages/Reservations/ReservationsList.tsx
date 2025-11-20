import { useState } from "react";
import { Link } from "react-router-dom";

// Types
interface Reservation {
  id: number;
  equipmentName: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected" | "completed";
  reason: string;
}

const ReservationsList = () => {
  // Données exemple - À remplacer par un appel API
  const [reservations] = useState<Reservation[]>([
    {
      id: 1,
      equipmentName: "Microscope électronique",
      userName: "Ahmed Ben Ali",
      date: "2024-11-20",
      startTime: "09:00",
      endTime: "11:00",
      status: "approved",
      reason: "Recherche sur les cellules",
    },
    {
      id: 2,
      equipmentName: "Imprimante 3D",
      userName: "Fatma Karim",
      date: "2024-11-21",
      startTime: "14:00",
      endTime: "16:00",
      status: "pending",
      reason: "Impression prototype",
    },
    {
      id: 3,
      equipmentName: "Spectromètre",
      userName: "Mohamed Salah",
      date: "2024-11-22",
      startTime: "10:00",
      endTime: "12:00",
      status: "approved",
      reason: "Analyse chimique",
    },
    {
      id: 4,
      equipmentName: "Scanner 3D",
      userName: "Leila Mansour",
      date: "2024-11-19",
      startTime: "15:00",
      endTime: "17:00",
      status: "completed",
      reason: "Numérisation objet",
    },
    {
      id: 5,
      equipmentName: "Microscope électronique",
      userName: "Youssef Trabelsi",
      date: "2024-11-18",
      startTime: "08:00",
      endTime: "10:00",
      status: "rejected",
      reason: "Examen microbiologique",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusBadge = (status: Reservation["status"]) => {
    const statusConfig = {
      pending: {
        text: "En attente",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      approved: {
        text: "Approuvée",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      rejected: {
        text: "Refusée",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
      completed: {
        text: "Terminée",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
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

  const filteredReservations =
    filterStatus === "all"
      ? reservations
      : reservations.filter((r) => r.status === filterStatus);

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    approved: reservations.filter((r) => r.status === "approved").length,
    completed: reservations.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mes Réservations
        </h2>
        <Link
          to="/calendar"
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Voir le calendrier
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            En attente
          </p>
          <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.pending}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Approuvées
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.approved}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Terminées
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "all"
              ? "bg-brand-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "pending"
              ? "bg-brand-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "approved"
              ? "bg-brand-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Approuvées
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "completed"
              ? "bg-brand-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Terminées
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Équipement
                </th>
                <th scope="col" className="px-6 py-3">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Horaire
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
              {filteredReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {reservation.equipmentName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {reservation.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4">{reservation.userName}</td>
                    <td className="px-6 py-4">
                      {new Date(reservation.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      {reservation.startTime} - {reservation.endTime}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                          Détails
                        </button>
                        {reservation.status === "pending" && (
                          <button className="font-medium text-red-600 hover:underline dark:text-red-500">
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationsList;