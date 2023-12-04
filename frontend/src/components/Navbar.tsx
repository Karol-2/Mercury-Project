import { Link, useNavigate } from "react-router-dom";
import LogoSVG from "/logo.svg";
import { useUser } from "../helpers/UserProvider";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    const logged_out = await logout();
    if (logged_out) {
      navigate("/");
    } else {
      throw new Error("Couldn't log out");
    }
  };

  const navLinks = [
    { to: "/search", text: "Search" },
    { to: "/messages", text: "Messages" },
  ];

  return (
    <nav className="bg-my-dark py-2 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex flex-row select-none">
        <img src={LogoSVG} alt="Mercury Logo" className="h-20 w-20 pr-5 ml-5" />
        <span className="self-center text-my-orange font-bold text-xl md:text-2xl">
          Mercury
        </span>
      </div>
      <div className="self-center flex items-center">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="p-5 rounded-lg transition duration-250 ease-in-out mr-5 hover:bg-my-orange font-bold text-lg"
          >
            {link.text}
          </Link>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg transition duration-250 ease-in-out mr-5 font-bold text-lg p-5 hover:bg-my-orange"
        >
          <img
            src={user!.profile_picture}
            className="rounded-full w-12 h-12 border-my-orange border-2 object-cover "
          />
          {isOpen && (
            <div
              id="dropdown-menu"
              className="shadow-xl absolute top-40 right-18 md:top-20 md:right-0 flex flex-col items-start rounded-lg bg-my-orange py-2 mr-5 font-normal text-base"
            >
              <Link
                to={"/profile"}
                className="whitespace-nowrap mt-2 hover:bg-my-purple p-2 w-full"
              >
                My profile
              </Link>
              <Link
                to={"/friends"}
                className="mt-2 hover:bg-my-purple p-2 w-full"
              >
                Friends
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 hover:bg-my-purple p-2 w-full"
              >
                Logout
              </button>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
