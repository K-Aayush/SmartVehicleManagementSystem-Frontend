import { banner } from "../../lib/data";
import bell from "../../assets/bell.png";

const Banner = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-12 mb-24 lg:flex-row">
      <div className="lg:w-2/3">
        <h2 className="pb-6 text-4xl font-semibold gradient-title">
          Comprehensive Vehicle Maintenance & Assistance, Nationwide.
        </h2>
        <p className="mb-10 text-lg text-gray-600 dark:text-gray-300">
          Empowering vehicle owners with hassle-free access to trusted vendors,
          expert mechanics, and emergency services. Our system is built for
          convenience, speed, and security.
        </p>

        <div className="items-center justify-start gap-8 md:flex">
          {banner.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-4">
              {item.icon}
              <div>
                <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
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
