import Footer from "../components/Footer";
import CallToAction from "../layout/CallToAction";
import PhotoAndText from "../layout/PhotoAndText";
import Reasons from "../layout/Reasons";
import Technologies from "../layout/Technologies";
import WelcomeMessage from "../layout/WelcomeMessage";

function HomePage() {
  return (
    <main className="bg-my-darker min-h-screen">
      <WelcomeMessage />
      <PhotoAndText />
      <Reasons />
      <Technologies />
      <CallToAction />
      <Footer />
    </main>
  );
}

export default HomePage;
