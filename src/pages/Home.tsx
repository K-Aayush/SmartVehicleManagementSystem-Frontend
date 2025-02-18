import About from "../components/About";
import Banner from "../components/Banner";
import Hero from "../components/Hero";
import Questions from "../components/Questions";
import Service from "../components/Service";
import Testimonials from "../components/Testimonials";

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
