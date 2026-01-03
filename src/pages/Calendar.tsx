//pages/calender.tsx
import FullCalendar from "@fullcalendar/react";
import {
  EventContentArg,
  EventInput,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useEffect, useRef, useState } from "react";
import { useModal } from "../hooks/useModal";
import Modal from "../components/common/Modal";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import NewReservation from "./Reservations/NewReservation";
import EditReservation from "./Reservations/EditReservation";
import api from "../axios";
import axios from "axios";
import {
  BoxesIcon,
  CalendarClock,
  ChartArea,
  CheckCheckIcon,
  ClipboardList,
  Clock,
  Search,
  StopCircle,
} from "lucide-react";

// Typage des événements du calendrier
interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    equipmentName?: string;
    status?: string;
    description?: string;
  };
}
interface AvailabilityInfo {
  available: boolean;
  reason: string;
  capacityUsed: number;
  capacityTotal: number;
  capacityAvailable: number;
  overlappingReservations?: number;
}
const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [reservationCount, setReservationCount] = useState<number>(0);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [availabilityInfo, setAvailabilityInfo] =
    useState<AvailabilityInfo | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] =
    useState<boolean>(false);
  const [disabledEdit, setDisabledEdit] = useState(false);
  // Fonction pour déterminer la couleur selon le statut
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Warning";
      case "approved":
        return "Success";
      case "refused":
      case "rejected":
        return "Danger";
      default:
        return "Primary";
    }
  };
  const checkAvailability = () => {
    if (!filterStartDate || !filterEndDate) {
      setAvailabilityInfo(null);
      return;
    }

    if (selectedEquipment === "all") {
      setAvailabilityInfo(null);
      return;
    }

    setIsCheckingAvailability(true);

    const params = {
      equipmentId: selectedEquipment,
      startDate: filterStartDate,
      endDate: filterEndDate,
    };

    api
      .get("/api/reservations/test/availability", { params })
      .then((res) => {
        setAvailabilityInfo(res.data);
        setIsCheckingAvailability(false);
      })
      .catch((err) => {
        console.error("Erreur vérification disponibilité:", err);
        setIsCheckingAvailability(false);
      });
  };
  const getAllRéservations = () => {
    const params: any = {};

    if (selectedEquipment && selectedEquipment !== "all") {
      params.equipmentId = selectedEquipment;
    }

    if (filterStartDate) {
      params.startDate = filterStartDate;
    }

    if (filterEndDate) {
      params.endDate = filterEndDate;
    }

    api
      .get("/api/reservations", { params })
      .then((res) => {
        const formattedEvents = res?.data?.reservations?.map(
          (reservation: any) => {
            const equipmentName =
              reservation.equipment?.nom || "Équipement non spécifié";
            const status = reservation.status || "pending";

            return {
              id: reservation._id,
              title: equipmentName,
              start: reservation.startDate?.split("T")[0],
              end: reservation.endDate?.split("T")[0],
              extendedProps: {
                calendar: getStatusColor(status),
                equipmentName: equipmentName,
                data: reservation,
                status: status,
                description: reservation.description || "",
              },
            };
          }
        );
        setEvents(formattedEvents);
        setReservationCount(res?.data?.count || 0);
      })
      .catch((err) => console.error("Erreur chargement réservations:", err));
  };
  const getAllEquipments = async () => {
    try {
      const res = await api.get("/api/equipments");
      setEquipments(res.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements :", error);
    }
  };
  useEffect(() => {
    getAllEquipments();
  }, []);
  useEffect(() => {
    getAllRéservations();
    checkAvailability();
  }, [selectedEquipment, filterStartDate, filterEndDate, showAvailableOnly]);

  // Sélection d'une date pour ajouter un événement
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setDisabledEdit(false);
    openModal();
  };

  // Clic sur un événement existant pour l'éditer
  const { user } = useAuth();

  const handleCloseModal = () => {
    setDisabledEdit(false);
    resetModalFields();
    closeModal();
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = token.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        )
      );
      return decoded.id || decoded._id || decoded.userId || null;
    } catch (e) {
      return null;
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const reservationData: any = event?.extendedProps?.data;

    // Récupérer l'id courant (contexte / localStorage / token)
    const localUserId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)._id
      : null;
    const tokenUserId = getUserIdFromToken();
    const currentUserId = user?._id || localUserId || tokenUserId;
    const reservationUserId =
      reservationData?.user?._id || reservationData?.user;

    // Si l'utilisateur courant n'est pas l'auteur, ouvrir le modal en lecture seule
    if (
      !currentUserId ||
      !reservationUserId ||
      String(currentUserId) !== String(reservationUserId)
    ) {
      setDisabledEdit(true);
      setSelectedEvent(reservationData as unknown as CalendarEvent);
      openModal();
      return;
    }

    // Sinon ouvrir le modal d'édition
    setDisabledEdit(false);
    setSelectedEvent(reservationData as unknown as CalendarEvent);
    openModal();
  };

  const resetModalFields = () => {
    setSelectedEvent(null);
  };

  // Affichage personnalisé des événements
  const renderEventContent = (eventInfo: EventContentArg) => {
    const calendarName =
      (eventInfo.event.extendedProps.calendar as string) || "Primary";
    const status = eventInfo.event.extendedProps.status || "pending";
    const equipmentName =
      eventInfo.event.extendedProps.equipmentName || eventInfo.event.title;
    const colorClass = `fc-bg-${calendarName.toLowerCase()}`;

    // Obtenir le badge de statut
    const getStatusBadge = () => {
      switch (status?.toLowerCase()) {
        case "pending":
          return "⏳";
        case "approved":
          return "✓";
        case "refused":
        case "rejected":
          return "✗";
        default:
          return "📋";
      }
    };

    return (
      <div
        className={`event-fc-color flex items-center fc-event-main ${colorClass} px-2 py-1 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      >
        <span className="mr-1 text-xs">{getStatusBadge()}</span>
        <div
          className="fc-event-title truncate text-xs font-medium flex-1"
          title={equipmentName}
        >
          {equipmentName}
        </div>
        {eventInfo.timeText && (
          <div className="fc-event-time text-xs ml-1 opacity-75">
            {eventInfo.timeText}
          </div>
        )}
      </div>
    );
  };
  const resetFilters = () => {
    setSelectedEquipment("all");
    setFilterStartDate("");
    setFilterEndDate("");
    setShowAvailableOnly(false);
    setAvailabilityInfo(null);
  };
  return (
    <>
      <div className="mb-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Search /> Filtrer les réservations
            {reservationCount > 0 && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({reservationCount} résultat{reservationCount > 1 ? "s" : ""})
              </span>
            )}
          </h3>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            ↺ Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par équipement */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <BoxesIcon size={14} /> Équipement
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="all">Tous les équipements</option>
              {equipments.map((equipment) => (
                <option key={equipment._id} value={equipment._id}>
                  {equipment.nom} {equipment.type ? `(${equipment.type})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre date de début */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <CalendarClock size={14} /> Date de début
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filtre date de fin */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <CalendarClock size={14} /> Date de fin
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Checkbox disponibilité */}
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Afficher uniquement les équipements disponibles
            </span>
          </label>
        </div>

        {/* Affichage de la disponibilité */}
        {availabilityInfo &&
          selectedEquipment !== "all" &&
          filterStartDate &&
          filterEndDate && (
            <div
              className={`mt-4 p-4 rounded-lg border-l-4 ${
                availabilityInfo.available
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                  : "bg-red-50 dark:bg-red-900/20 border-red-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {availabilityInfo.available ? (
                    <CheckCheckIcon size={24} />
                  ) : (
                    <StopCircle size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-1 ${
                      availabilityInfo.available
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {availabilityInfo.available
                      ? "Équipement disponible"
                      : "Équipement non disponible"}
                  </h4>
                  <p
                    className={`text-sm mb-2 ${
                      availabilityInfo.available
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {availabilityInfo.reason}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span
                      className={
                        availabilityInfo.available
                          ? "text-green-600 dark:text-green-400 flex items-center gap-1"
                          : "text-red-600 dark:text-red-400 flex items-center gap-1"
                      }
                    >
                      <ChartArea size={14} /> Capacité utilisée:{" "}
                      {availabilityInfo.capacityUsed} /{" "}
                      {availabilityInfo.capacityTotal}
                    </span>
                    {availabilityInfo.overlappingReservations !== undefined && (
                      <span
                        className={
                          availabilityInfo.available
                            ? "text-green-600 dark:text-green-400 flex items-center gap-1"
                            : "text-red-600 dark:text-red-400 flex items-center gap-1"
                        }
                      >
                        <ClipboardList size={14} /> Réservations:{" "}
                        {availabilityInfo.overlappingReservations}
                      </span>
                    )}
                  </div>
                  {availabilityInfo.available &&
                    availabilityInfo.capacityAvailable > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                (availabilityInfo.capacityAvailable /
                                  availabilityInfo.capacityTotal) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

        {isCheckingAvailability && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="animate-spin text-xl">
                <Clock size={24} />
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Vérification de la disponibilité...
              </span>
            </div>
          </div>
        )}

        {/* Indicateur de filtres actifs */}
        {(selectedEquipment !== "all" ||
          filterStartDate ||
          filterEndDate ||
          showAvailableOnly) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filtres actifs:
            </span>
            {selectedEquipment !== "all" && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium flex items-center gap-1">
                <BoxesIcon size={14} />{" "}
                {equipments.find((e) => e._id === selectedEquipment)?.nom}
              </span>
            )}
            {filterStartDate && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium flex items-center gap-1">
                <CalendarClock size={14} /> Début:{" "}
                {new Date(filterStartDate).toLocaleDateString("fr-FR")}
              </span>
            )}
            {filterEndDate && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full font-medium flex items-center gap-1">
                <CalendarClock size={14} /> Fin:{" "}
                {new Date(filterEndDate).toLocaleDateString("fr-FR")}
              </span>
            )}
            {showAvailableOnly && (
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs rounded-full font-medium flex items-center gap-1">
                <CheckCheckIcon size={14} /> Disponibles uniquement
              </span>
            )}
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="custom-calendar p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Ajouter une réservation +",
                click: openModal,
              },
            }}
            height="auto"
            eventDisplay="block"
            displayEventTime={false}
            eventClassNames={(arg) => {
              const status = arg.event.extendedProps.status;
              return [`event-status-${status?.toLowerCase()}`];
            }}
          />
        </div>

        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent
                ? (disabledEdit ? "Détails de la réservation" : "Modifier une réservation")
                : "Ajouter une réservation"}
            </h5>
            {selectedEvent ? (
              <EditReservation
                reservation={selectedEvent}
                onClose={handleCloseModal}
                getAllRéservations={getAllRéservations}
                disabled={disabledEdit}
              />
            ) : (
              <NewReservation
                onClose={handleCloseModal}
                getAllRéservations={getAllRéservations}
              />
            )}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Calendar;
