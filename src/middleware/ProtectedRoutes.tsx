import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "USER" | "VENDOR" | "SERVICE_PROVIDER" | "ADMIN";
}

const ProtectedRoutes = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { userRole, token, isLoading } = useContext(AppContext);

  if (isLoading) return <div>Loading...</div>;

  console.log(token);

  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  console.log("protected routes: " + userRole);

  if (userRole !== requiredRole) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default ProtectedRoutes;
