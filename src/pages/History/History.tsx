import { useState } from "react";

// Types
interface HistoryRecord {
  id: number;
  equipmentName: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // en heures
  status: "completed" | "cancelled" | "noshow";
}

const History = () => {
  // Données exemple - À remplacer par un appel API
  const [history] = useState<HistoryRecord[]>([
    {
      id: 1,
      equipmentName: "Microscope électronique",
      userName: "Ahmed Ben Ali",
      date: "2024-11-15",
      startTime: "09:00",
      endTime: "11:00",
      duration: 2,
      status: "completed",
    },
    {
      id: 2,
      equipmentName: "Imprimante 3D",
      userName: "Fatma Karim",
      date: "2024-11-14",
      startTime: "14:00",
      endTime: "16:00",
      duration: 2,
      status: "completed",
    },
    {
      id: 3,
      equipmentName: "Spectromètre",
      userName: "Mohamed Salah",
      date: "2024-11-13",
      startTime: "10:00",
      endTime: "12:00",
      duration: 2,
      status: "cancelled",
    },
    {
      id: 4,
      equipmentName: "Scanner 3D",
      userName: "Leila Mansour",
      date: "2024-11-12",
      startTime: "15:00",
      endTime: "17:00",
      duration: 2,
      status: "completed",
    },
    {
      id: 5,
      equipmentName: "Microscope électronique",
      userName: "Youssef Trabelsi",
      date: "2024-11-11",
      startTime: "08:00",
      endTime: "10:00",
      duration: 2,
      status: "noshow",
    },
  ]);

  const [dateFilter, setDateFilter] = useState({
    start: "",
    end: "",
  });

  const getStatusBadge = (status: HistoryRecord["status"]) => {
    const statusConfig = {
      completed: {
        text: "Terminée",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      cancelled: {
        text: "Annulée",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
      noshow: {
        text: "Absence",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
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

  const totalHours = history
    .filter((h) => h.status === "completed")
    .reduce((sum, h) => sum + h.duration, 0);

  const completedCount = history.filter((h) => h.status === "completed").length;

  const handleExportCSV = () => {
    // Créer le contenu CSV
    const headers = ["ID", "Équipement", "Utilisateur", "Date", "Début", "Fin", "Durée (h)", "Statut"];
    const rows = history.map((h) => [
      h.id,
      h.equipmentName,
      h.userName,
      h.date,
      h.startTime,
      h.endTime,
      h.duration,
      h.status === "completed" ? "Terminée" : h.status === "cancelled" ? "Annulée" : "Absence",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
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
        <button
          onClick={handleExportCSV}
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Exporter CSV
        </button>
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
                {history.length > 0
                  ? Math.round((completedCount / history.length) * 100)
                  : 0}
                %
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

      {/* Filters */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Date de début
            </label>
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, start: e.target.value })
              }
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Date de fin
            </label>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, end: e.target.value })
              }
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setDateFilter({ start: "", end: "" })}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Réinitialiser
            </button>
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
                  Durée
                </th>
                <th scope="col" className="px-6 py-3">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr
                  key={record.id}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {record.equipmentName}
                  </td>
                  <td className="px-6 py-4">{record.userName}</td>
                  <td className="px-6 py-4">
                    {new Date(record.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    {record.startTime} - {record.endTime}
                  </td>
                  <td className="px-6 py-4">{record.duration}h</td>
                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;