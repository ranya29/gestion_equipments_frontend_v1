//Reservations/NewReservation.tsx
import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../axios";

const NewReservation: React.FC<{ onClose: () => void, getAllRéservations: () => void }> = ({ onClose, getAllRéservations }) => {
  const [equipment, setEquipment] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [listEquipements, setListEquipements] = useState<Array<any>>([]);

  const [equipmentError, setEquipmentError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Récupération de l’équipement sélectionné
  const selectedEquipment = listEquipements.find((e) => e._id === equipment);
  const maxCapacity = selectedEquipment ? selectedEquipment.capacite.valeur : null;
  const capacityUnit = selectedEquipment ? selectedEquipment.capacite.unite : "";

  const onFinish = async () => {
    try {
      let hasError = false;

      // Validation équipement
      if (!equipment) {
        setEquipmentError("Veuillez sélectionner un équipement.");
        hasError = true;
      } else {
        setEquipmentError("");
      }

      // Validation quantité
      if (quantity <= 0 || isNaN(quantity)) {
        setQuantityError("La quantité doit être un nombre supérieur à 0.");
        hasError = true;
      } else if (maxCapacity !== null && quantity > maxCapacity) {
        setQuantityError(`La quantité maximale pour cet équipement est ${maxCapacity} ${capacityUnit}.`);
        hasError = true;
      } else {
        setQuantityError("");
      }

      // Validation temps
      const now = new Date();
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      if (!startTime || !endTime) {
        setTimeError("Veuillez entrer les heures de début et de fin.");
        hasError = true;
      } else if (startDate < now) {
        setTimeError("La date de début doit être dans le futur.");
        hasError = true;
      } else if (endDate <= startDate) {
        setTimeError("L'heure de fin doit être après l'heure de début.");
        hasError = true;
      } else {
        setTimeError("");
      }

      // Validation description
      if (!description.trim()) {
        setDescriptionError("Veuillez entrer une description.");
        hasError = true;
      } else if (description.length > 500) {
        setDescriptionError("La description ne peut pas dépasser 500 caractères.");
        hasError = true;
      } else {
        setDescriptionError("");
      }

      if (hasError) return;

      // POST seulement si tout est OK
      const res = await api.post(
        "/reservations",
        {
          equipmentId: equipment,
          quantity,
          startDate: startTime,
          endDate: endTime,
          description: description,
        }
      );

      toast.success(res.data.message);
      getAllRéservations();
      onClose();
      console.log("Réservation créée :", res.data);
    } catch (error: any) {
      console.error("Erreur lors de la création :", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la création de la réservation."
      );
    }
  };

  const getAllEquipments = async () => {
    try {
      const res = await api.get("/equipments");
      setListEquipements(res.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements :", error);
      toast.error("Erreur lors de la récupération des équipements.");
    }
  };

  useEffect(() => {
    getAllEquipments();
  }, []);

  return (
    <>
      <form className="space-y-5">
        {/* Équipement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Équipement
          </label>
          <select
            name="equipment"
            value={equipment}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setEquipmentError("");
              setEquipment(e.target.value);
              setQuantity(1); // Reset quantité à 1 à chaque changement d’équipement
              setQuantityError("");
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un équipement</option>
            {listEquipements.map((equip) => (
              <option key={equip._id} value={equip._id}>
                {equip.nom}
              </option>
            ))}
          </select>
          {equipmentError && (
            <span className="text-red-500 text-sm mt-1">{equipmentError}</span>
          )}
        </div>

        {/* Quantité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantité
          </label>
          <input
            type="number"
            name="quantity"
            value={quantity}
            min={1}
            max={maxCapacity ?? undefined}
            disabled={!selectedEquipment}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = parseInt(e.target.value, 10);
              setQuantity(val);

              if (val <= 0 || isNaN(val)) {
                setQuantityError("La quantité doit être un nombre supérieur à 0.");
              } else if (maxCapacity !== null && val > maxCapacity) {
                setQuantityError(`La quantité maximale pour cet équipement est ${maxCapacity} ${capacityUnit}.`);
              } else {
                setQuantityError("");
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          {maxCapacity !== null && quantity >= maxCapacity && (
            <p className="text-sm text-gray-500 mt-1">
              Capacité maximale : {maxCapacity} {capacityUnit}
            </p>
          )}
          {quantityError && (
            <span className="text-red-500 text-sm mt-1">{quantityError}</span>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={startTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setStartTime(e.target.value);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={endTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEndTime(e.target.value);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        {timeError && <span className="text-red-500 text-sm mt-1">{timeError}</span>}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setDescription(e.target.value);
            }}
            rows={4}
            placeholder="Indiquez la description de réservation"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {descriptionError && (
            <span className="text-red-500 text-sm mt-1">{descriptionError}</span>
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onFinish}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Réserver
          </button>
        </div>
      </form>
    </>
  );
};

export default NewReservation;