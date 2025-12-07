
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Auth
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import { AuthProvider } from "./context/AuthContext";

// Layout
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Protected & Role
import ProtectedRoute from "./hooks/RoutPrivate";
import RoleRoute from "./hooks/RoleRoute";

// Pages
import Home from "./pages/Dashboard/Home";
import UsersList from "./pages/Users/UsersList";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import EquipmentsList from "./pages/Equipments/EquipmentsList";
import AddEquipment from "./pages/Equipments/AddEquipment";
import ReservationsList from "./pages/Reservations/ReservationsList";
import NewReservation from "./pages/Reservations/NewReservation";
import EditReservation from "./pages/Reservations/EditReservation";
import History from "./pages/History/History";
import NotFound from "./pages/OtherPage/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer style={{ marginTop: "80px" }} />
      <Router>
        <ScrollToTop />
        <Routes>

          {/* DEFAULT → REDIRECT TO SIGNIN */}
          <Route path="/" element={<Navigate to="/signin" replace />} />

          {/* PUBLIC ROUTES */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* PROTECTED LAYOUT */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route
              path="dashboard"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <Home />
                </RoleRoute>
              }
            />

            {/* USERS */}
            <Route
              path="users"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <UsersList />
                </RoleRoute>
              }
            />
            <Route
              path="profile"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <UserProfiles />
                </RoleRoute>
              }
            />

            {/* EQUIPMENTS */}
            <Route
              path="equipments"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <EquipmentsList />
                </RoleRoute>
              }
            />
            <Route
              path="equipments/add"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <AddEquipment />
                </RoleRoute>
              }
            />

            {/* CALENDAR */}
            <Route
              path="calendar"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <Calendar />
                </RoleRoute>
              }
            />

            {/* RESERVATIONS */}
            <Route
              path="reservations"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <ReservationsList />
                </RoleRoute>
              }
            />
            <Route
              path="reservations/new"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <NewReservation />
                </RoleRoute>
              }
            />
            <Route
              path="reservations/:id/edit"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <EditReservation />
                </RoleRoute>
              }
            />

            {/* HISTORY */}
            <Route
              path="history"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <History />
                </RoleRoute>
              }
            />

            {/* Additional pages */}
            <Route
              path="form-elements"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <FormElements />
                </RoleRoute>
              }
            />
            <Route
              path="basic-tables"
              element={
                <RoleRoute allowedRoles={["admin", "user"]}>
                  <BasicTables />
                </RoleRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

