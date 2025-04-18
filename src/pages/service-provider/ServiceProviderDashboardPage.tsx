import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const ServiceProviderDashboardPage = () => {
  const { userData } = useContext(AppContext);
  return <div>!Welcome {userData?.name}</div>;
};

export default ServiceProviderDashboardPage;
