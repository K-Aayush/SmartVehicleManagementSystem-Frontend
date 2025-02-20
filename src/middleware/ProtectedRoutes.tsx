import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "USER" | "VENDOR" | "SERVICE_PROVIDER" | "ADMIN";
}

interface DecodedToken {
  id: string | null;
  role: string | null;
}

const ProtectedRoutes = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { token, isLoading } = useContext(AppContext);

  if (isLoading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to={"/"} replace />;
  }

  const decoded = jwtDecode<DecodedToken>(token);

  if (!decoded || decoded.role !== requiredRole) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default ProtectedRoutes;
