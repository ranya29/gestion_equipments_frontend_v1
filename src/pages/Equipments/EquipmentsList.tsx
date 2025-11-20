import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../axios"; // chemin relatif correct

interface Equipment {
  _id: string;
  name: string;
  description: string;
  location: string;
  status: "disponible" | "maintenance" | "hors service";
  capacity: number;
  photo?: string;
}

const EquipmentsList = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/equipments")
      .then((res) => {
        setEquipments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: Equipment["status"]) => {
    const statusConfig = {
      disponible: { text: "Disponible", className: "bg-green-100 text-green-800" },
      maintenance: { text: "Maintenance", className: "bg-yellow-100 text-yellow-800" },
      "hors service": { text: "Hors service", className: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  if (loading) return <p>Chargement des équipements...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Équipements</h2>
        <Link
          to="/equipments/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter un équipement
        </Link>
      </div>

      <table className="w-full text-left text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Localisation</th>
            <th className="px-4 py-2">Capacité</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((eq) => (
            <tr key={eq._id} className="border-b">
              <td className="px-4 py-2">{eq.name}</td>
              <td className="px-4 py-2">{eq.description}</td>
              <td className="px-4 py-2">{eq.location}</td>
              <td className="px-4 py-2">{eq.capacity}</td>
              <td className="px-4 py-2">{getStatusBadge(eq.status)}</td>
              <td className="px-4 py-2 flex gap-2">
                <Link
                  to={`/equipments/${eq._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Voir
                </Link>
                <Link
                  to={`/equipments/edit/${eq._id}`}
                  className="text-green-600 hover:underline"
                >
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentsList;
