import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import google from "../assets/google logo.svg";
import carService from "../assets/car-service-vector.png";

const HeroSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
      {/* Left: Heading and description */}
      <div className="lg:w-1/2">
        <h1 className="text-6xl font-extrabold pb-6 gradient-title">
          Hassle-Free Vehicle Service, Anytime!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Book vehicle maintenance and repair services from trusted mechanics
          with just a few clicks. Enjoy quality service and convenience with our
          smart management system.
        </p>
        <Link to="/services">
          <button className="flex items-center px-5 py-4 rounded-lg text-lg text-white bg-indigo-700 hover:bg-indigo-600 mb-8">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between max-w-xl gap-6">
          {/* Customer service */}
          <div className="flex flex-col">
            <div className="flex mb-4">
              <Avatar className="-mr-4 z-10">
                <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="-mr-4 z-20">
                <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar className="z-30">
                <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                <AvatarFallback>XY</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-xl font-semibold mb-1">Trusted Mechanics</h1>
              <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                Certified professionals ensuring top-quality service.
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col">
            <img src={google} alt="google" className="w-36 mb-5" />
            <div>
              <h1 className="flex gap-1 mb-1 text-yellow-400">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </h1>
              <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                Rated 5 stars by thousands of happy customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Poster */}
      <div className="lg:w-1/2 flex justify-center">
        <div className="relative w-full aspect-square max-w-lg flex items-center">
          <img
            src={carService}
            alt="Smart Vehicle Service"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
