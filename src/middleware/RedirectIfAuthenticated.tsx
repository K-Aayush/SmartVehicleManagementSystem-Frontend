import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

interface DecodedToken {
  id: string | null;
  role: string | null;
}

const RedirectIfAuthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token, isLoading } = useContext(AppContext);

  if (isLoading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to={"/"} replace />;
  }

  const decoded = jwtDecode<DecodedToken>(token);

  if (decoded) {
    switch (decoded.role) {
      case "USER":
        return <Navigate to={"/user/dashboard"} replace />;
      case "VENDOR":
        return <Navigate to={"/vendor/dashboard"} replace />;
      case "SERVICE_PROVIDER":
        return <Navigate to={"/service-provider/dashboard"} replace />;
      case "ADMIN":
        return <Navigate to={"/admin/dashboard"} replace />;
      default:
        return <Navigate to={"/"} replace />;
    }
  }

  return children;
};

export default RedirectIfAuthenticated;
