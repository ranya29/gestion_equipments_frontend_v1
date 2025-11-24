import { BrowserRouter as Router, Routes, Route } from "react-router";
// Auth
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

// Gestion des utilisateurs
import UsersList from './pages/Users/UsersList';
import UserProfiles from "./pages/UserProfiles";

// Pages Dashboard
import Home from "./pages/Dashboard/Home";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";

// Gestion des Équipements
import EquipmentsList from "./pages/Equipments/EquipmentsList";
import AddEquipment from "./pages/Equipments/AddEquipment";

// Réservations
import ReservationsList from "./pages/Reservations/ReservationsList";
import NewReservation from "./pages/Reservations/NewReservation";

// Historique
import History from "./pages/History/History";

// Pages utilitaires
import NotFound from "./pages/OtherPage/NotFound";

// Layout
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

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

            {/* ✅ Gestion des Utilisateurs */}
            <Route path="/users" element={<UsersList />} />
            <Route path="/profile" element={<UserProfiles />} />

            {/* Gestion des Équipements */}
            <Route path="/equipments" element={<EquipmentsList />} />
            <Route path="/equipments/add" element={<AddEquipment />} />

            {/* Réservations */}
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/reservations" element={<ReservationsList />} />
            <Route path="/reservations/new" element={<NewReservation />} />

            {/* Historique */}
            <Route path="/history" element={<History />} />

            {/* Pages utilitaires */}
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/basic-tables" element={<BasicTables />} />
          </Route>

          {/* Auth Layout (sans AppLayout) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}