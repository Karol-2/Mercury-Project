import { Link, useNavigate } from "react-router-dom";
import LogoSVG from "/logo.svg";
import { useUser } from "../helpers/UserProvider";
import { useState } from "react";
import {
  faMagnifyingGlass,
  faUser,
  faUsers,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
<FontAwesomeIcon icon={faMagnifyingGlass} />;

export interface NavbarProps {
  handleNavigate?: (to: String) => void;
}

function Navbar(props: NavbarProps) {
  const { handleNavigate } = props;
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
    { to: "/search", text: "Search", icon: faMagnifyingGlass },
    { to: "/profile", text: "My Profile", icon: faUser },
    { to: "/friends", text: "Friends", icon: faUsers },
  ];

  const menuPosition = "absolute right-1 top-20";
  const menuColor = "shadow-xl bg-my-orange";

  const linkStyle =
    "whitespace-nowrap hover:bg-my-orange-dark rounded-sm p-2 w-full text-center ";

  const handleMenuHover = () => {
    setIsOpen(true);
  };

  const handleMenuLeave = () => {
    setIsOpen(false);
  };

  const handleDropdownEnter = () => {
    setIsOpen(true);
  };

  const handleDropdownLeave = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-my-dark py-2 px-5 flex flex-col sm:flex-row justify-between items-center z-50">
      <div className="flex flex-row select-none">
        <img src={LogoSVG} alt="Mercury Logo" className="h-20 w-20 pr-5" />
        <span className="self-center text-my-orange font-bold text-xl md:text-2xl">
          Mercury
        </span>
      </div>
      {user && (
        <div className="h-24 self-center flex flex-row gap-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="p-5 rounded-lg transition duration-250 ease-in-out hover:bg-my-orange font-bold text-lg active:translate-y-1"
              onClick={
                handleNavigate ? () => handleNavigate(link.to) : undefined
              }
            >
              <FontAwesomeIcon icon={link.icon} />
              <span className=" hidden md:inline ml-2">{link.text}</span>
            </Link>
          ))}
          <div
            onMouseEnter={handleMenuHover}
            onMouseLeave={handleMenuLeave}
            className="relative"
          >
            <div
              className="rounded-lg w-20 h-20 transition duration-250 ease-in-out font-bold text-lg p-3.5 hover:bg-my-orange"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <img
                src={user.profile_picture}
                className="rounded-full w-full h-full border-my-orange border-2 object-cover"
              />
            </div>
            {isOpen && (
              <div
                data-testid="Dropdown-menu"
                id="dropdown-menu"
                className={`${menuPosition} ${menuColor} w-28 p-2 flex flex-col rounded-lg`}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  data-testid="Logout"
                  onClick={handleLogout}
                  className={linkStyle}
                >
                  <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>
                  <span className=" ml-2 font-semibold">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
