import { CircleDollarSign, HardDrive, MapPin, Truck } from "lucide-react";
import vehicleService from "../../assets/vehicleservice.png";

const About = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-12 mb-24 lg:flex-row">
      <div className="hidden lg:w-1/2 lg:flex">
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
        <h2 className="pb-6 text-4xl font-semibold gradient-title">
          Revolutionize Your Vehicle Maintenance with Smart Management
        </h2>
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-300">
          Take control of your vehicle maintenance and repair needs with our
          all-in-one Smart Vehicle Management System, offering seamless services
          for both parts purchasing emergency assistance, and secure payments.
        </p>

        <div className="flex flex-col items-start justify-center gap-3">
          <h2 className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-slate-50">
              <HardDrive className="text-slate-600" />
            </div>
            Purchase Car Parts from Trusted Vendors
          </h2>
          <h2 className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-yellow-50">
              <Truck className="text-yellow-600" />
            </div>
            Book Services with Nearby Service Providers and Mechanics
          </h2>
          <h2 className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-green-50">
              <MapPin className="text-green-600" />
            </div>
            Track Nearby Service Providers for Emergency Assistance
          </h2>
          <h2 className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-green-50">
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
