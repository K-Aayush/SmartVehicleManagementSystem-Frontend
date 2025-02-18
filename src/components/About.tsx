import { CircleDollarSign, HardDrive, MapPin, Truck } from "lucide-react";
import vehicleService from "../assets/vehicleservice.png";

const About = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
      <div className="lg:w-1/2 lg:flex hidden">
        <img
          src={vehicleService}
          alt="vehicleservice"
          width={500}
          height={500}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="lg:w-1/2">
        <h2 className="text-4xl font-semibold pb-6 gradient-title">
          Revolutionize Your Vehicle Maintenance with Smart Management
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Take control of your vehicle maintenance and repair needs with our
          all-in-one Smart Vehicle Management System, offering seamless services
          for both parts purchasing emergency assistance, and secure payments.
        </p>

        <div className="flex flex-col items-start justify-center gap-3">
          <h2 className="flex items-center gap-2">
            <div className="p-3 bg-slate-50 rounded-full">
              <HardDrive className="text-slate-600" />
            </div>
            Purchase Car Parts from Trusted Vendors
          </h2>
          <h2 className="flex items-center gap-2">
            <div className="p-3 bg-yellow-50 rounded-full">
              <Truck className="text-yellow-600" />
            </div>
            Book Services with Nearby Service Providers and Mechanics
          </h2>
          <h2 className="flex items-center gap-2">
            <div className="p-3 bg-green-50 rounded-full">
              <MapPin className="text-green-600" />
            </div>
            Track Nearby Service Providers for Emergency Assistance
          </h2>
          <h2 className="flex items-center gap-2">
            <div className="p-3 bg-green-50 rounded-full">
              <CircleDollarSign className="text-blue-600" />
            </div>
            Secure Payments via Wallet, Credit Card, and More
          </h2>
        </div>
      </div>
    </div>
  );
};

export default About;
