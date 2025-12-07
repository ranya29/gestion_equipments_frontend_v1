import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import axios from "axios";
import { toast } from "react-toastify";

const EditReservation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 

  const [equipment, setEquipment] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [descreption, setDescreption] = useState<string>("");
  const [listEquipements, setListEquipements] = useState<Array<any>>([]);

  const [equipmentError, setEquipmentError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Convertit une date ISO en valeur compatible `input[type="datetime-local"]`
  const formatDateForInput = (isoDate?: string | null) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  // Récupération de l'équipement sélectionné
  const selectedEquipment = listEquipements.find((e) => e._id === equipment);
  const maxCapacity = selectedEquipment ? selectedEquipment.capacite.valeur : null;
  const capacityUnit = selectedEquipment ? selectedEquipment.capacite.unite : "";

  // Charger la réservation existante
  const fetchReservation = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const reservation = res.data.reservation;
      setEquipment(reservation.equipment._id);
      setQuantity(reservation.quantity);
      setStartTime(formatDateForInput(reservation.startDate));
      setEndTime(formatDateForInput(reservation.endDate));
      setDescreption(reservation.descreption);
    } catch (error: any) {
      console.error("Erreur lors du chargement de la réservation :", error);
      toast.error(error.response?.data?.message || "Erreur lors du chargement de la réservation.");
    }
  };

  // Charger tous les équipements
  const getAllEquipments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/equipments");
      setListEquipements(res.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements :", error);
    }
  };

  useEffect(() => {
    getAllEquipments();
    if (id) {
      fetchReservation();
    }
  }, [id]);

  const onFinish = async () => {
    try {
      let hasError = false;

      // Validation équipement
      if (!equipment.trim()) {
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
      if (!startTime || !endTime) {
        setTimeError("Veuillez entrer les heures de début et de fin.");
        hasError = true;
      } else if (new Date(endTime) <= new Date(startTime)) {
        setTimeError("L'heure de fin doit être après l'heure de début.");
        hasError = true;
      } else {
        setTimeError("");
      }

      // Validation description
      if (!descreption?.trim()) {
        setDescriptionError("Veuillez entrer une description.");
        hasError = true;
      } else if (descreption?.length > 500) {
        setDescriptionError("La description ne peut pas dépasser 500 caractères.");
        hasError = true;
      } else {
        setDescriptionError("");
      }

      if (hasError) return;

      // PUT pour modification
      const res = await axios.put(
        `http://localhost:3000/api/reservations/${id}`,
        {
          equipmentId: equipment,
          quantity,
          startDate: startTime ? new Date(startTime).toISOString() : null,
          endDate: endTime ? new Date(endTime).toISOString() : null,
          description: descreption,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message);
      navigate("/reservations");
      console.log("Réservation modifiée :", res.data);
    } catch (error: any) {
      console.error("Erreur lors de la modification :", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la modification de la réservation."
      );
    }
  };

  return (
    <>
      <PageMeta
        title="Modifier Réservation | Equipment Manager"
        description="Modifier une réservation existante"
      />
      <div className="p-6 lg:p-10 bg-gray-100 min-h-screen">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Modifier Réservation
          </h1>
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
                  setQuantity(1);
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
                    setTimeError("");
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
                    setTimeError("");
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
                name="descreption"
                value={descreption}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setDescriptionError("");
                  setDescreption(e.target.value);
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
                onClick={() => navigate("/reservations")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={onFinish}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditReservation;
