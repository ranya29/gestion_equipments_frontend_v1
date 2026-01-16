import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../axios";

interface Props {
  reservation: any;
  onClose: () => void;
  getAllRéservations: () => void;
  disabled?: boolean;
}

const EditReservation: React.FC<Props> = ({
  reservation,
  onClose,
  getAllRéservations,
  disabled = false,
}) => {
  const isDisabled = Boolean(disabled);

  const [equipment, setEquipment] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [listEquipements, setListEquipements] = useState<any[]>([]);

  const [equipmentError, setEquipmentError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  /* ------------------ Utils ------------------ */
  const formatDateForInput = (isoDate?: string | null) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  /* ------------------ Equipment selection ------------------ */
  const selectedEquipment = listEquipements.find((e) => e._id === equipment);
  const maxCapacity = selectedEquipment?.capacite?.valeur ?? null;
  const capacityUnit = selectedEquipment?.capacite?.unite ?? "";

  /* ------------------ Fetch reservation ------------------ */
  const fetchReservation = () => {
    if (!reservation) return;
    setEquipment(reservation.equipment?._id ?? "");
    setQuantity(reservation.quantity ?? 1);
    setStartTime(formatDateForInput(reservation.startDate));
    setEndTime(formatDateForInput(reservation.endDate));
    setDescription(reservation.description ?? "");
  };

  /* ------------------ Fetch equipments ------------------ */
  const getAllEquipments = async () => {
    try {
      const res = await api.get("/equipments");
      setListEquipements(res.data.data || []);
    } catch (error) {
      console.error("Erreur récupération équipements :", error);
      toast.error("Impossible de charger les équipements.");
    }
  };

  useEffect(() => {
    getAllEquipments();
    fetchReservation();
  }, [reservation]);

  /* ------------------ Modifier ------------------ */
  const onFinish = async () => {
    let hasError = false;

    if (!equipment) {
      setEquipmentError("Veuillez sélectionner un équipement.");
      hasError = true;
    } else setEquipmentError("");

    if (!quantity || quantity <= 0) {
      setQuantityError("La quantité doit être supérieure à 0.");
      hasError = true;
    } else if (maxCapacity !== null && quantity > maxCapacity) {
      setQuantityError(
        `La quantité maximale est ${maxCapacity} ${capacityUnit}.`
      );
      hasError = true;
    } else setQuantityError("");

    if (!startTime || !endTime) {
      setTimeError("Veuillez renseigner les dates.");
      hasError = true;
    } else if (new Date(endTime) <= new Date(startTime)) {
      setTimeError("La date de fin doit être après la date de début.");
      hasError = true;
    } else setTimeError("");

    if (!description || !description.trim()) {
      setDescriptionError("Veuillez entrer une description.");
      hasError = true;
    } else if (description.length > 500) {
      setDescriptionError("La description ne doit pas dépasser 500 caractères.");
      hasError = true;
    } else setDescriptionError("");

    if (hasError) return;

    try {
      const res = await api.put(`/reservations/${reservation._id}`, {
        equipmentId: equipment,
        quantity,
        startDate: new Date(startTime).toISOString(),
        endDate: new Date(endTime).toISOString(),
        description: description.trim(),
      });

      toast.success(res.data.message || "Réservation modifiée avec succès.");
      getAllRéservations();
      onClose();
    } catch (error: any) {
      console.error("Erreur modification :", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la modification de la réservation."
      );
    }
  };

  /* ------------------ Supprimer ------------------ */
  const onDelete = async () => {
    const confirm = window.confirm(
      "Êtes-vous sûr(e) de vouloir supprimer cette réservation ?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/reservations/${reservation._id}`);
      toast.success("Réservation supprimée avec succès.");
      getAllRéservations();
      onClose();
    } catch (error: any) {
      console.error("Erreur suppression :", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression de la réservation."
      );
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <form className="space-y-5">
      {/* Equipment */}
      <div>
        <label className="block text-sm font-medium">Équipement</label>
        <select
          value={equipment}
          disabled={isDisabled}
          onChange={(e) => {
            if (isDisabled) return;
            setEquipment(e.target.value);
            setEquipmentError("");
            setQuantity(1);
          }}
          className="w-full border rounded px-4 py-2"
        >
          <option value="">Sélectionner un équipement</option>
          {listEquipements.map((e) => (
            <option key={e._id} value={e._id}>
              {e.nom}
            </option>
          ))}
        </select>
        {equipmentError && <p className="text-red-500 text-sm">{equipmentError}</p>}
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium">Quantité</label>
        <input
          type="number"
          value={quantity}
          min={1}
          max={maxCapacity ?? undefined}
          disabled={isDisabled || !selectedEquipment}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded px-4 py-2"
        />
        {quantityError && <p className="text-red-500 text-sm">{quantityError}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="datetime-local"
          value={startTime}
          disabled={isDisabled}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <input
          type="datetime-local"
          value={endTime}
          disabled={isDisabled}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded px-4 py-2"
        />
      </div>
      {timeError && <p className="text-red-500 text-sm">{timeError}</p>}

      {/* Description */}
      <div>
        <textarea
          value={description}
          disabled={isDisabled}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border rounded px-4 py-2"
        />
        {descriptionError && (
          <p className="text-red-500 text-sm">{descriptionError}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="border px-5 py-2 rounded"
        >
          Annuler
        </button>

        {!isDisabled && (
          <>
            <button
              type="button"
              onClick={onFinish}
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Modifier
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default EditReservation;
