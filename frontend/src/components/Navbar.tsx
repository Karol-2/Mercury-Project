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
      <div className="flex flex-col sm:flex-row font-semibold text-lg">
        <button className="nav-button">Search</button>
        <button className="nav-button">Messages</button>
        <button className="nav-button">Profile</button>
        <button className="nav-button">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
