import { banner } from "../lib/data";
import bell from "../assets/bell.png";

const Banner = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
      <div className="lg:w-2/3">
        <h2 className="text-4xl font-semibold pb-6 gradient-title">
          Comprehensive Vehicle Maintenance & Assistance, Nationwide.
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Empowering vehicle owners with hassle-free access to trusted vendors,
          expert mechanics, and emergency services. Our system is built for
          convenience, speed, and security.
        </p>

        <div className="md:flex items-center justify-start gap-8">
          {banner.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-4">
              {item.icon}
              <div>
                <h2 className="text-gray-600 dark:text-gray-300 text-2xl font-semibold">
                  {item.number}
                </h2>
                <p className="text-sm">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-lg:hidden lg:w-1/3">
        <img
          src={bell}
          alt="vehicle maintenance"
          width={500}
          height={500}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default Banner;
