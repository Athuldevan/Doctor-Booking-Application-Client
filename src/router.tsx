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
import PatientDoctorsPage from "./pages/patient/DoctorsPage";
import PatientBookSlotPage from "./pages/patient/BookSlotPage";
import PatientLayout from "./components/layouts/PatientLayout";

import EditDoctorPage from "./components/Doctors/EditDoctor";
import EditSlotPage from "./components/admin/editSlot";
import PatientAppointmentsPage from "./pages/patient/AppointmentsPage";
import PatientDoctorDetailsPage from "./pages/patient/DoctorDetailsPage";
import ProtectedRoute from "./components/custom/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="doctors/add" element={<AddDoctorPage />} />
          <Route path="appointments/create" element={<CreateSlotPage />} />
          <Route path="appointments/:id/edit" element={<EditSlotPage />} />
          <Route path="doctors/:id/edit" element={<EditDoctorPage />} />
        </Route>
      </Route>

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<PatientDoctorsPage />} />
          <Route path="doctors" element={<PatientDoctorsPage />} />
          <Route path="doctors/:doctorId" element={<PatientDoctorDetailsPage />} />
          <Route path="doctors/:doctorId/book" element={<PatientBookSlotPage />} />
          <Route path="appointments" element={<PatientAppointmentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
