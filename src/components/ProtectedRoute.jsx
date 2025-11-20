import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token  } = useAuth();
  console.log("ProtectedRoute token:", token); 
  return token  ? <Outlet /> : <Navigate to="/login" />;
}
