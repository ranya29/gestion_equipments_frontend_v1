import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Types
interface Reservation {
  _id: string;
  equipment: {
    _id: string;
    nom: string;
  };
  user: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  description: string;
  quantity: number;
}

const ReservationsList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    reservationId: string | null;
  }>({ show: false, reservationId: null });

  // Récupérer les réservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/reservations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReservations(res.data.data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des réservations :", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des réservations."
      );
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une réservation
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/reservations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.message || "Réservation supprimée avec succès");
      // Rafraîchir la liste
      fetchReservations();
      // Fermer le modal
      setDeleteModal({ show: false, reservationId: null });
    } catch (error: any) {
      console.error("Erreur lors de la suppression :", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression de la réservation."
      );
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("fr-FR"),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mes Réservations
        </h2>
        <div className="flex gap-2">
          <Link
            to="/reservations/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
            Nouvelle Réservation
          </Link>
          <Link
            to="/calendar"
            className="inline-flex items-center justify-center rounded-lg bg-gray-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300"
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
            Calendrier
          </Link>
        </div>
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
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "pending"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "approved"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Approuvées
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "completed"
              ? "bg-blue-500 text-white"
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
                  Quantité
                </th>
                <th scope="col" className="px-6 py-3">
                  Date & Heure
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
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Chargement...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => {
                  const start = formatDateTime(reservation.startDate);
                  const end = formatDateTime(reservation.endDate);
                  return (
                    <tr
                      key={reservation._id}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {reservation.equipment.nom}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {reservation.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">{reservation.quantity}</td>
                      <td className="px-6 py-4">
                        <div>{start.date}</div>
                        <div className="text-xs text-gray-500">
                          {start.time} - {end.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(reservation.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/reservations/edit/${reservation._id}`}
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                show: true,
                                reservationId: reservation._id,
                              })
                            }
                            className="font-medium text-red-600 hover:underline dark:text-red-500"
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Confirmer la suppression
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette
              action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ show: false, reservationId: null })
                }
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={() =>
                  deleteModal.reservationId &&
                  handleDelete(deleteModal.reservationId)
                }
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsList;