import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import google from "../../assets/google logo.svg";
import carService from "../../assets/car-service-vector.png";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-12 mb-24 lg:flex-row">
      {/* Left: Heading and description */}
      <div className="lg:w-1/2">
        <h1 className="pb-6 text-6xl font-extrabold gradient-title">
          Hassle-Free Vehicle Service, Anytime!
        </h1>
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-300">
          Book vehicle maintenance and repair services from trusted mechanics
          with just a few clicks. Enjoy quality service and convenience with our
          smart management system.
        </p>
        <Link to="/login">
          <button className="flex items-center px-5 py-4 mb-8 text-lg text-white bg-indigo-700 rounded-lg hover:bg-indigo-600">
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </Link>
        <div className="flex flex-col items-start justify-between max-w-xl gap-6 md:flex-row md:items-center">
          {/* Customer service */}
          <div className="flex flex-col">
            <div className="flex mb-4">
              <Avatar className="z-10 -mr-4">
                <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="z-20 -mr-4">
                <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar className="z-30">
                <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                <AvatarFallback>XY</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="mb-1 text-xl font-semibold">Trusted Mechanics</h1>
              <p className="text-sm font-light text-gray-600 dark:text-gray-300">
                Certified professionals ensuring top-quality service.
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col">
            <img src={google} alt="google" className="mb-5 w-36" />
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
      <div className="justify-center hidden lg:w-1/2 lg:flex">
        <div className="relative flex items-center w-full max-w-lg aspect-square">
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
