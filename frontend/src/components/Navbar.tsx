import { Link, useNavigate } from "react-router-dom";
import LogoSVG from "/logo.svg";
import { useUser } from "../helpers/UserProvider";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useUser();

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
    { to: "/profile", text: "My Profile" },
  ];

  return (
    <nav className=" bg-my-dark py-2 flex flex-col sm:flex-row justify-between">
      <div className="flex flex-row">
        <img src={LogoSVG} alt="Mercury Logo" className=" h-20 w-20 pr-5 " />
        <span className=" self-center text-my-orange font-bold text-xl md:text-2xl">
          {" "}
          Mercury
        </span>
      </div>
      <div className=" self-center">
  {navLinks.map((link) => (
    <Link
      key={link.to}
      to={link.to}
      className=" p-5 rounded-lg transition duration-250 ease-in-out mr-5 hover:bg-my-orange font-bold text-lg"
    >
      {link.text}
    </Link>
  ))}
  <button
    className="p-5 rounded-lg transition duration-250 ease-in-out mr-5 hover:bg-my-orange font-bold text-lg"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
    </nav>
  );
}

export default Navbar;
