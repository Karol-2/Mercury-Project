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

  const menuPosition = "absolute right-1 top-24";
  const menuColor = "shadow-xl bg-my-orange";

  const linkStyle =
    "whitespace-nowrap hover:bg-my-purple rounded-sm p-2 w-full text-center";

  return (
    <nav className="bg-my-dark py-2 px-5 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex flex-row select-none">
        <img src={LogoSVG} alt="Mercury Logo" className="h-20 w-20 pr-5" />
        <span className="self-center text-my-orange font-bold text-xl md:text-2xl">
          Mercury
        </span>
      </div>
      {user && (
        <div className="h-24 self-center flex gap-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="p-5 rounded-lg transition duration-250 ease-in-out hover:bg-my-orange font-bold text-lg"
            >
              {link.text}
            </Link>
          ))}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg w-20 h-20 transition duration-250 ease-in-out font-bold text-lg p-3.5 hover:bg-my-orange"
          >
            <img
              src={user.profile_picture}
              className="rounded-full w-full h-full border-my-orange border-2 object-cover"
            />
          </button>
          {isOpen && (
            <div
              id="dropdown-menu"
              className={`${menuPosition} ${menuColor} w-28 p-2 flex flex-col rounded-lg`}
            >
              <Link to={"/profile"} className={linkStyle}>
                My profile
              </Link>
              <Link to={"/friends"} className={linkStyle}>
                Friends
              </Link>
              <button onClick={handleLogout} className={linkStyle}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
