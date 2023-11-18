import { Link } from "react-router-dom";
import LogoSVG from "/logo.svg";

function Navbar() {
  return (
    <nav className=" bg-my-dark py-2 flex flex-col sm:flex-row justify-between">
      <Link to="/" className="flex flex-row">
        <img src={LogoSVG} alt="Mercury Logo" className=" h-20 w-20 pr-5 " />
        <span className=" self-center text-my-orange font-bold text-xl md:text-2xl">
          {" "}
          Mercury
        </span>
      </Link>
      <div className="flex flex-col sm:flex-row font-semibold text-lg content-center align-middle ">
        <Link
          to={"/search"}
          className="transition duration-250 ease-in-out mr-5 hover:bg-my-orange transform hover:scale-105"
        >
          Search
        </Link>
        <Link
          to={"/messages"}
          className="transition duration-250 ease-in-out mr-5 hover:bg-my-orange transform hover:scale-105"
        >
          Messages
        </Link>
        <Link
          to={"/profile"}
          className="transition duration-250 ease-in-out mr-5 hover:bg-my-orange transform hover:scale-105"
        >
          My Profile
        </Link>
        <button className="transition duration-250 ease-in-out mr-5 hover:bg-my-orange transform hover:scale-105">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;