import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/authForms/LoginForm";
import { Card, CardContent } from "../../components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/register");
  };
  return (
    <div className="flex items-center justify-center max-w-md min-h-screen p-3 mx-auto">
      <Card className="flex flex-col h-full gap-4 overflow-auto">
        <LoginForm />
        <CardContent className="flex items-center text-sm">
          Don`t have an Account?
          <div
            onClick={handleNavigate}
            className="ml-2 cursor-pointer hover:border-b-2 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Register Here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
