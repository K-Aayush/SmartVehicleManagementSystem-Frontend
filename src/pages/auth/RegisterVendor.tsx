import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "../../components/ui/card";

import VendorRegisterForm from "../../components/authForms/Vendor-RegisterForm";

const RegisterVendor = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/login");
  };
  return (
    <div className="flex items-center justify-center max-w-md min-h-screen p-3 mx-auto">
      <Card className="flex flex-col h-full gap-4 overflow-auto">
        <VendorRegisterForm />
        <CardContent className="flex items-center text-sm">
          Already have an Account?
          <div
            onClick={handleNavigate}
            className="ml-2 cursor-pointer hover:border-b-2 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Login Here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterVendor;
