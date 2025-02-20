import { Link } from "react-router-dom";
import { services } from "../../lib/data";
import { ArrowRight } from "lucide-react";

const Service = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-12 mb-24 lg:flex-row">
      {/* Left side */}
      <div className="lg:w-1/2">
        <h2 className="pb-6 text-4xl font-semibold gradient-title">
          What We Provide?
        </h2>
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-300">
          Our Smart Vehicle Management System offers seamless solutions for
          vehicle owners, including purchasing car parts, booking mechanic
          services, emergency assistance, and secure payment options, all in one
          platform.
        </p>
        <Link to="/">
          <button className="flex items-center px-3 py-4 mb-8 text-xl text-white bg-indigo-700 rounded-lg hover:bg-indigo-600">
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </Link>
      </div>

      {/* Right side */}
      <div className="grid grid-cols-1 gap-6 lg:w-1/2 sm:grid-cols-2">
        {services.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center px-12 py-6 transition duration-300 bg-white border shadow-md md:py-6 md:px-6 rounded-xl hover:shadow-lg dark:bg-gray-800"
          >
            {item.icon}
            <h3 className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
