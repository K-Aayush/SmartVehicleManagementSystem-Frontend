import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { registerType } from "../lib/data";

const Register = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen px-6">
      <div className="grid w-full max-w-xl grid-cols-1 gap-8 lg:max-w-4xl md:max-w-2xl md:grid-cols-2 lg:grid-cols-3">
        {registerType.map((item, index) => (
          <Card
            key={index}
            className="transition-all duration-300 ease-in-out hover:scale-105"
          >
            <Link to={item.link}>
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-6">
                  <p>{item.icon}</p>
                  <h2>{item.name}</h2>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Register;
