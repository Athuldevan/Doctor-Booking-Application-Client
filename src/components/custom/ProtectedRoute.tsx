import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // If user is logged in but role doesn't match, redirect to their default landing page
    return <Navigate to={role === "admin" ? "/admin" : "/patient/doctors"} replace />;
  }

  return <Outlet />;
}
