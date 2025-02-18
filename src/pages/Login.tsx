import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { Card, CardContent } from "../components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/register");
  };
  return (
    <div className="mx-auto p-3 max-w-md min-h-screen flex justify-center items-center">
      <Card className="flex flex-col gap-4 h-full overflow-auto">
        <LoginForm />
        <CardContent className="text-sm flex items-center">
          Don`t have an Account?
          <div
            onClick={handleNavigate}
            className="cursor-pointer hover:border-b-2 hover:text-gray-700 dark:hover:text-gray-300 ml-2"
          >
            Register Here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
