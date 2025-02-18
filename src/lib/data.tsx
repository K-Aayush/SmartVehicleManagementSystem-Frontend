import { Car, CreditCard, MapPin, Wrench } from "lucide-react";

export const services = [
  {
    name: "Car Parts from Trusted Vendors",
    icon: <Wrench className="w-10 h-10 text-indigo-700" />,
  },
  {
    name: "Mechanic Services",
    icon: <Car className="w-10 h-10 text-indigo-700" />,
  },
  {
    name: "Emergency Assistance & Live Tracking",
    icon: <MapPin className="w-10 h-10 text-indigo-700" />,
  },
  {
    name: "Secure Payments",
    icon: <CreditCard className="w-10 h-10 text-indigo-700" />,
  },
];
