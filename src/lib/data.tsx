import { Car, Check, CreditCard, MapPin, Users, Wrench } from "lucide-react";

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

export const banner = [
  {
    name: "Active Users",
    icon: <Users className="w-10 h-10 text-indigo-700" />,
    number: "2M+",
  },
  {
    name: "Services Delivered",
    icon: <Check className="w-10 h-10 text-indigo-700" />,
    number: "2,200+",
  },
  {
    name: "Trusted Vendors & Mechanics",
    icon: <Users className="w-10 h-10 text-indigo-700" />,
    number: "100+",
  },
];

export const testimonials = [
  {
    name: "Ravi Kumar",
    role: "Vehicle Owner",
    content:
      "This system helped me find a trusted mechanic during a roadside emergency. The live tracking and instant booking features are a lifesaver!",
    image: "https://i.pravatar.cc/150?img=6",
  },
  {
    name: "Sita Rai",
    role: "Vehicle Owner",
    content:
      "The service booking feature is amazing. I can now easily get my car serviced by certified mechanics, and the payment options are seamless!",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Deepak Sharma",
    role: "Service Provider (Mechanic)",
    content:
      "Being a part of this platform has expanded my business. I can now reach more customers and provide timely assistance to car owners.",
    image: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Manoj Pandey",
    role: "Vendor (Car Parts Supplier)",
    content:
      "This system allows me to supply car parts efficiently to mechanics and vehicle owners. It's a great platform for vendors to reach customers quickly.",
    image: "https://i.pravatar.cc/150?img=1",
  },
];
