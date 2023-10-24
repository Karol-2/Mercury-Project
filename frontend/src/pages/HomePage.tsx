import Footer from "../components/Footer";
import PhotoAndText from "../layout/PhotoAndText";
import WelcomeMessage from "../layout/WelcomeMessage";

function HomePage() {
  return (

    <div className=" bg-my-darker min-h-screen ">
      <WelcomeMessage />
      <PhotoAndText />

      <div className="lg:mx-64 mx-10 mt-10 p-10 flex flex-col rounded-3xl justify-center align-middle">
        <p className="text-my-light font-semibold text-5xl text-center">
          {" "}
          TITLE: CATS
        </p>
        <img
          src="https://cdn2.thecatapi.com/images/di7.jpg"
          className=" rounded-3xl"
        ></img>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
