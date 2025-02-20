import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "USER" | "VENDOR" | "SERVICE_PROVIDER" | "ADMIN";
}

const ProtectedRoutes = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { userData, token } = useContext(AppContext);

  if (!token || !userData) {
    return <Navigate to={"/login"} replace />;
  }

  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
