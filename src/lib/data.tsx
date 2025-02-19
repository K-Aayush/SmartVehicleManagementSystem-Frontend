import {
  Briefcase,
  Car,
  Check,
  CreditCard,
  MapPin,
  User,
  Users,
  Wrench,
} from "lucide-react";

export const registerType = [
  {
    name: "Register as a user",
    icon: <User className="w-10 h-10 text-indigo-700" />,
    link: "/register/user",
  },
  {
    name: "Become a Seller",
    icon: <Briefcase className="w-10 h-10 text-green-700" />,
    link: "/register/vendor",
  },
  {
    name: "Register as a mechanic",
    icon: <Wrench className="w-10 h-10 text-gray-700" />,
    link: "/register/service-provider",
  },
];

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

export const faqs = [
  {
    question: "What is the Smart Vehicle Management System?",
    answer:
      "The Smart Vehicle Management System helps manage vehicle services, parts inventory, and track vehicles in real time. It allows users to book services, track their car breakdowns, and connect with nearby service providers for immediate assistance.",
  },
  {
    question: "How can I book a service for my vehicle?",
    answer:
      "You can book a service through the app or website by selecting the type of service, scheduling an appointment, and choosing a service provider.",
  },
  {
    question: "Can I track my vehicle breakdown in real-time?",
    answer:
      "Yes, the system allows you to track nearby service providers in real-time if your vehicle breaks down. You can send your live location for immediate assistance.",
  },
  {
    question: "How can I buy car parts?",
    answer:
      "You can browse and purchase car parts from the vendor section of the system. Payments can be made via wallet, credit card, or other supported payment methods.",
  },
  {
    question: "Is the system available for multiple vehicle types?",
    answer:
      "Yes, the system supports a variety of vehicle types, including cars, motorcycles, and trucks, with tailored services for each type.",
  },
  {
    question: "How secure are the payment methods?",
    answer:
      "All payment methods, including wallet and credit card transactions, are secured using advanced encryption to protect your data and transactions.",
  },
];
