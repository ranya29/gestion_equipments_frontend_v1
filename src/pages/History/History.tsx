import { useEffect, useState } from "react";
import api from "../../services/api";

// Types
interface HistoryRecord {
  id: string;
  equipmentName: string;
  equipmentCode?: string;
  userName: string;
  userId?: string;
  createdAt?: string;
  date?: string; // startDate
  endDate?: string; // endDate
  startTime?: string;
  endTime?: string;
  duration?: number; // in hours
  status: "approved" | "rejected" | "pending";
  validatedBy?: string;
  validatedAt?: string;
}  

const History = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters removed — history shows all reservations by default

  // Robust duration calculation (hours) with safeguards for bad data/timezone issues
  const computeDurationHours = (startStr?: string | null, endStr?: string | null) => {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    let diffH = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    // If negative due to timezone issues, take absolute
    if (diffH < 0) diffH = Math.abs(diffH);

    // If the difference is unreasonably large (e.g., > 31 days), fallback to day-based calculation
    if (diffH > 24 * 31) {
      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      const diffDays = Math.round((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24));
      return Math.abs(diffDays) * 24;
    }

    return Math.round(diffH);
  }; 

  const getStatusBadge = (status: HistoryRecord["status"]) => {
    const statusConfig: Record<string, { text: string; className: string }> = {
      approved: {
        text: "Terminée",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      rejected: {
        text: "Annulée",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
      pending: {
        text: "En attente",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      }
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

  const handleExportCSV = () => {
    // Créer le contenu CSV
    const headers = ["ID réservation", "Équipement", "Code équipement", "Utilisateur", "ID utilisateur", "Date réservation", "Date de début", "Date de fin", "Heure début", "Heure fin", "Durée (h)", "Statut", "Validé par", "Date validation"];
    const rows = history.map((h) => [
      h.id,
      h.equipmentName,
      h.equipmentCode || "-",
      h.userName,
      h.userId || "-",
      h.createdAt ? new Date(h.createdAt).toLocaleString('fr-FR') : "-",
      h.date ? new Date(h.date).toLocaleDateString('fr-FR') : "-",
      h.endDate ? new Date(h.endDate).toLocaleDateString('fr-FR') : "-",
      h.startTime || "-",
      h.endTime || "-",
      h.duration || 0,
      h.status === "approved" ? "Terminée" : h.status === "rejected" ? "Annulée" : "En attente",
      h.validatedBy || "-",
      h.validatedAt ? new Date(h.validatedAt).toLocaleString('fr-FR') : "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(cell => String(cell).replace(/,/g, '\\,')).join(",")),
    ].join("\n");

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `historique_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch reservations from backend (filter by reservation creation date)
  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await api.get("/reservations");
      const data = res.data;

      const mapped = (data.reservations || []).map((r: any) => {
        const start = r.startDate ? new Date(r.startDate) : null;
        const end = r.endDate ? new Date(r.endDate) : null;
        const duration = computeDurationHours(r.startDate, r.endDate);

        return {
          id: r._id,
          equipmentName: r.equipment?.nom || r.equipmentName || "-",
          equipmentCode: r.equipment?._id || r.equipmentCode || "-",
          userName: r.user?.username || r.user?.email || "-",
          userId: r.user?._id || "-",
          createdAt: r.createdAt,
          date: r.startDate,
          endDate: r.endDate,
          startTime: start ? start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "-",
          endTime: end ? end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "-",
          duration,
          status: r.status,
          validatedBy: r.validatedBy?.username || r.validatedBy?.email || "-",
          validatedAt: r.validatedAt
        };
      });

      setHistory(mapped);
    } catch (err: any) {
      console.error("Error fetching reservations:", err);
      setError(err?.response?.data?.message || err.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter handlers removed

  // Heures d'utilisation : somme des durées des réservations approuvées
  const totalHours = history
    .filter((h) => h.status === "approved")
    .reduce((sum, h) => sum + (h.duration || 0), 0);

  // Taux de complétion : pourcentage de réservations approuvées par rapport au nombre total
  const approvedCount = history.filter((h) => h.status === "approved").length;
  const completionRate = history.length > 0 ? Math.round((approvedCount / history.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Historique des Réservations
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Consultez l'historique complet des réservations
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={loading || history.length === 0}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:focus:ring-brand-800 disabled:opacity-50"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total des réservations
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {history.length}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Heures d'utilisation
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {totalHours}h
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Taux de complétion
              </p>
              <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
                {completionRate}%
              </p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
              <svg
                className="h-8 w-8 text-purple-600 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>



      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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
                  Code équipement
                </th>
                <th scope="col" className="px-6 py-3">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3">
                  ID utilisateur
                </th>
                <th scope="col" className="px-6 py-3">
                  Date réservation
                </th>
                <th scope="col" className="px-6 py-3">
                  Date de début
                </th>
                <th scope="col" className="px-6 py-3">
                  Date de fin
                </th>
                <th scope="col" className="px-6 py-3">
                  Heure début
                </th>
                <th scope="col" className="px-6 py-3">
                  Heure fin
                </th>
                <th scope="col" className="px-6 py-3">
                  Durée (h)
                </th>
                <th scope="col" className="px-6 py-3">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3">
                  Validé par
                </th>
                <th scope="col" className="px-6 py-3">
                  Date validation
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    Aucun enregistrement trouvé
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {record.equipmentName}
                    </td>
                    <td className="px-6 py-4">{record.equipmentCode}</td>
                    <td className="px-6 py-4">{record.userName}</td>
                    <td className="px-6 py-4">{record.userId}</td>
                    <td className="px-6 py-4">{record.createdAt ? new Date(record.createdAt).toLocaleDateString("fr-FR") : "-"}</td>
                    <td className="px-6 py-4">{record.date ? new Date(record.date).toLocaleDateString("fr-FR") : "-"}</td>
                    <td className="px-6 py-4">{record.endDate ? new Date(record.endDate).toLocaleDateString("fr-FR") : "-"}</td>
                    <td className="px-6 py-4">{record.startTime}</td>
                    <td className="px-6 py-4">{record.endTime}</td>
                    <td className="px-6 py-4">{record.duration}h</td>
                    <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                    <td className="px-6 py-4">{record.validatedBy || "-"}</td>
                    <td className="px-6 py-4">{record.validatedAt ? new Date(record.validatedAt).toLocaleDateString("fr-FR") : "-"}</td>
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

export default History;