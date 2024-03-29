import Footer from "../components/Footer";
import PhotoAndText from "../layout/PhotoAndText";
import Reasons from "../layout/Reasons";
import WelcomeMessage from "../layout/WelcomeMessage";
import CallToAction from "../layout/CallToAction";
import Technologies from "../layout/Technologies";

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
