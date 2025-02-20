import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

interface ProtectedRouteProps {
  requiredRole: "USER" | "VENDOR" | "SERVICE_PROVIDER" | "ADMIN";
}

const ProtectedRoutes = ({ requiredRole }: ProtectedRouteProps) => {
  const { userData, token, isLoading } = useContext(AppContext);

  if (isLoading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  if (userData?.role !== requiredRole) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
