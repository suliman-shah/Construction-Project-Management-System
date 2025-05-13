import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your custom loader
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
