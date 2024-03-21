import { useUser } from "../helpers/UserContext";
import LogoSVG from "/logo.svg";
import { Link } from "react-router-dom";

const scrollToTop = (): void => {
  window.scrollTo(0, 0);
};

export default function WelcomeMessage() {
  const { redirectToLogin } = useUser();

  return (
    <div className="relative overflow-hidden" id="background">
      <div
        className="h-full absolute top-1/3 left-0 flex items-center select-none"
        id="logo"
      >
        <img
          src={LogoSVG}
          alt="Mercury Logo"
          className="w-screen h-screen opacity-90 pulsate fly-in-btm"
        />
      </div>

      <section className="wrapper z-50">
        <div className=" bg-my-dark text-my-light p-10 min-h-screen">
          <div className="flex flex-col mb-10 " id="page-content">
            <div className="text-center select-none" id="header-text">
              <p
                className="font-bold text-7xl md:text-9xl text-my-orange uppercase"
                id="header-name"
              >
                Mercury
              </p>
              <p
                className=" text-my-light font-semibold uppercase"
                id="header-slogan"
              >
                Modern Communication Platform for More Modern Times
              </p>
            </div>
            <div
              className=" text-my-darker flex flex-row justify-evenly mt-20 lg:mt-72"
              id="buttons-wrapper"
            >
              <div
                className=" z-50 flex flex-col lg:flex-row"
                id="buttons-section"
              >
                <button
                  data-testid="WelcomeLogin"
                  className="btn primary w-64 m-5 fade-in"
                  id="login-button"
                  onClick={() => redirectToLogin()}
                >
                  Login
                </button>
                <Link to="/register">
                  <button
                    data-testid="WelcomeRegister"
                    className="btn secondary w-64 m-5 text-my-light fade-in"
                    id="register-button"
                    onClick={scrollToTop}
                  >
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
