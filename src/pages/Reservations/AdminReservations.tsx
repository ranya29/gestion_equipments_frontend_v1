import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Types
interface Reservation {
  id: string;
  equipmentName: string;
  equipmentType: string;
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  quantity: number;
  capaciteUnite: string;
}

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // Fetch reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const endpoint = filterStatus === "pending" 
        ? "/api/reservations/pending"
        : "/api/reservations"; // Ken 3andek endpoint ll koll

      const res = await axios.get(`http://localhost:3000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = res.data.reservations || res.data;
      
      // Filter if not pending endpoint
      let filtered = data;
      if (filterStatus !== "all" && endpoint !== "/api/reservations/pending") {
        filtered = data.filter((r: any) => r.status === filterStatus);
      }

      setReservations(
        filtered.map((r: any) => ({
          id: r._id,
          equipmentName: r.equipment?.nom || "N/A",
          equipmentType: r.equipment?.type || "",
          userName: r.user?.username || r.user?.nom || "N/A",
          userEmail: r.user?.email || "",
          startDate: r.startDate,
          endDate: r.endDate,
          status: r.status,
          reason: r.description || "",
          quantity: r.quantity || 0,
          capaciteUnite: r.equipment?.capacite?.unite || "",
        }))
      );
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  // Approve reservation
  const handleApprove = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir approuver cette réservation ?")) return;

    setProcessing(true);
    try {
      await axios.patch(
        `http://localhost:3000/api/reservations/${id}/status`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("✅ Réservation approuvée avec succès!");
      fetchReservations();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'approbation");
    } finally {
      setProcessing(false);
    }
  };

  // Open reject modal
  const handleRejectClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowRejectModal(true);
  };

  // Submit rejection
  const submitRejection = async () => {
    if (!selectedReservation) return;

    setProcessing(true);
    try {
      await axios.patch(
        `http://localhost:3000/api/reservations/${selectedReservation.id}/status`,
        {
          status: "rejected",
          rejectionReason: rejectionReason || undefined,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("❌ Réservation refusée avec succès!");
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedReservation(null);
      fetchReservations();
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error(error.response?.data?.message || "Erreur lors du refus");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, [filterStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusConfig[status].className
        }`}
      >
        {statusConfig[status].text}
      </span>
    );
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    approved: reservations.filter((r) => r.status === "approved").length,
    rejected: reservations.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gérer les Réservations
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Approuver ou refuser les demandes de réservation
        </p>
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
            Refusées
          </p>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.rejected}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
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
          onClick={() => setFilterStatus("rejected")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            filterStatus === "rejected"
              ? "bg-brand-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Refusées
        </button>
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
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Aucune réservation trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ÉQUIPEMENT
                  </th>
                  <th scope="col" className="px-6 py-3">
                    UTILISATEUR
                  </th>
                  <th scope="col" className="px-6 py-3">
                    DATE
                  </th>
                  <th scope="col" className="px-6 py-3">
                    QUANTITÉ
                  </th>
                  <th scope="col" className="px-6 py-3">
                    STATUT
                  </th>
                  <th scope="col" className="px-6 py-3">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {reservation.equipmentName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {reservation.equipmentType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {reservation.userName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {reservation.userEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white">
                          Du: {formatDate(reservation.startDate)}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Au: {formatDate(reservation.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {reservation.quantity} {reservation.capaciteUnite}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4">
                      {reservation.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(reservation.id)}
                            disabled={processing}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            ✓ Approuver
                          </button>
                          <button
                            onClick={() => handleRejectClick(reservation)}
                            disabled={processing}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            ✕ Refuser
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Traité
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Refuser la réservation
            </h3>

            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Équipement:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedReservation.equipmentName}
                </span>
              </p>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Utilisateur:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedReservation.userName}
                </span>
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Raison du refus (optionnel)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={4}
                placeholder="Expliquez pourquoi la réservation est refusée..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedReservation(null);
                }}
                disabled={processing}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Annuler
              </button>
              <button
                onClick={submitRejection}
                disabled={processing}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? "Traitement..." : "Confirmer le refus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;