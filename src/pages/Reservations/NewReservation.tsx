import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

const NewReservation: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    equipment: "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Nouvelle réservation :", formData);
    // Ici tu peux ajouter l'appel API pour créer la réservation
    navigate("/reservations"); // redirection vers la liste après création
  };

  return (
    <>
      <PageMeta title="Nouvelle Réservation | Equipment Manager" description="Créer une nouvelle réservation" />
      <div className="p-6 lg:p-10 bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Nouvelle Réservation</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Équipement</label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un équipement</option>
                <option value="Camera">Camera</option>
                <option value="Microphone">Microphone</option>
                <option value="Projector">Projecteur</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                placeholder="Indiquez le motif de réservation"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/reservations")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Réserver
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewReservation;
