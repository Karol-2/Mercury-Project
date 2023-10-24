import Carousel from "../layout/Carousel";
import Footer from "../components/Footer";
import PhotoAndText from "../layout/PhotoAndText";
import Reasons from "../layout/Reasons";
import WelcomeMessage from "../layout/WelcomeMessage";
import Stats from "../layout/Stats";
import CallToAction from "../layout/CallToAction";
import Technologies from "../layout/Technologies";

function HomePage() {
  return (

    <div className=" bg-my-darker min-h-screen ">
      <WelcomeMessage />
      <PhotoAndText />
      <Reasons />
      <Carousel />
      <Technologies />
      <Stats />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default HomePage;
