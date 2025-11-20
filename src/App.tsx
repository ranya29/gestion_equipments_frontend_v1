import { BrowserRouter as Router, Routes, Route } from "react-router";
// Auth
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
// Pages existantes à garder
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
// Layout
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

// ➕ NOUVELLES PAGES
import EquipmentsList from "./pages/Equipments/EquipmentsList";
import AddEquipment from "./pages/Equipments/AddEquipment";
import ReservationsList from "./pages/Reservations/ReservationsList";
import History from "./pages/History/History";
import NewReservation from "./pages/Reservations/NewReservation";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route index path="/" element={<Home />} />

            {/* ➕ Gestion des Équipements */}
            <Route path="/equipments" element={<EquipmentsList />} />
            <Route path="/equipments/add" element={<AddEquipment />} />

            {/* ➕ Réservations */}
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reservations" element={<ReservationsList />} />
              <Route path="/reservations/new" element={<NewReservation />} />

            {/* ➕ Historique */}
            <Route path="/history" element={<History />} />

            {/* Utilisateurs */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/users" element={<BasicTables />} />

            {/* Pages utilitaires */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}