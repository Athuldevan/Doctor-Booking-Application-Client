import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminLayout from "./components/layouts/AdminLayout";
import DashboardPage from "./pages/admin/AdminDashboard";
import DoctorsPage from "./pages/doctor";
import AddDoctorPage from "./components/Doctors/AddDoctor";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import CreateSlotPage from "./components/admin/createSlot";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="doctors/add" element={<AddDoctorPage />} />
        <Route path="appointments/create" element={<CreateSlotPage />} />
        <Route path="doctors/:id/edit" element={<p>EDit Doctor</p>} />
      </Route>
    </Routes>
  );
}
