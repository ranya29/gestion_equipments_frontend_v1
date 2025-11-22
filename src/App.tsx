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
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./hooks/RoutPrivate";

export default function App() {
  return (
    <>
      <ToastContainer style={{ marginTop:"80px"}}/>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route index path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* ➕ Gestion des Équipements */}
            <Route path="/equipments" element={<ProtectedRoute><EquipmentsList /></ProtectedRoute>} />
            <Route path="/equipments/add" element={<ProtectedRoute><AddEquipment /></ProtectedRoute>} />

            {/* ➕ Réservations */}
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute><ReservationsList /></ProtectedRoute>} />
              <Route path="/reservations/new" element={<ProtectedRoute><NewReservation /></ProtectedRoute>} />

            {/* ➕ Historique */}
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

            {/* Utilisateurs */}
            <Route path="/profile" element={<ProtectedRoute><UserProfiles /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><BasicTables /></ProtectedRoute>} />

            {/* Pages utilitaires */}
            <Route path="/form-elements" element={<ProtectedRoute><FormElements /></ProtectedRoute>} />
            <Route path="/basic-tables" element={<ProtectedRoute><BasicTables /></ProtectedRoute>} />
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