import { Link } from "react-router-dom";
import { services } from "../lib/data";
import { ArrowRight } from "lucide-react";

const Service = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
      {/* Left side */}
      <div className="lg:w-1/2">
        <h2 className="text-4xl font-semibold pb-6 gradient-title">
          What We Provide?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Our Smart Vehicle Management System offers seamless solutions for
          vehicle owners, including purchasing car parts, booking mechanic
          services, emergency assistance, and secure payment options, all in one
          platform.
        </p>
        <Link to="/">
          <button className="flex items-center px-3 py-4 rounded-lg text-xl text-white bg-indigo-700 hover:bg-indigo-600 mb-8">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Right side */}
      <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center px-12 py-6 md:py-6 md:px-6 border rounded-xl shadow-md hover:shadow-lg transition duration-300 bg-white dark:bg-gray-800"
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
