import About from "../components/landingpage/About";
import Banner from "../components/landingpage/Banner";
import Hero from "../components/landingpage/Hero";
import Questions from "../components/landingpage/Questions";
import Service from "../components/landingpage/Service";
import Testimonials from "../components/landingpage/Testimonials";

const Home = () => {
  return (
    <div className="mx-4 md:mx-16 px-4 py-16">
      <Hero />
      <About />
      <Service />
      <Banner />
      <div className="mb-24">
        <h2 className="text-4xl font-semibold mb-12 gradient-title">
          What our users say
        </h2>
        <Testimonials />
      </div>
      <Questions />
    </div>
  );
};

export default Home;
