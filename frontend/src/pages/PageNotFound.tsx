import { Link } from "react-router-dom";
import Banner from "../components/Banner";

function PageNotFound() {
  return (
    <div className=" min-h-screen flex flex-col bg-my-darker text-center">
      <Banner />
      <h1 className="text-9xl font-bold text-my-orange"> ERROR 404</h1>
      <h2 className="text-xl md:text-3xl text-my-light p-5"> Page not found</h2>

      <Link to="/" className="font-bold">
        Go back to the home page{" "}
      </Link>
    </div>
  );
}

export default PageNotFound;
