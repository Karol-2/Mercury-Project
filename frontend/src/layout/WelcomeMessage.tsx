import LogoSVG from "/logo.svg";
import { Link } from "react-router-dom";

const scrollToTop = (): void => {
  window.scrollTo(0, 0);
};

export default function WelcomeMessage() {
  return (
    <div className="relative overflow-hidden" id="background">
      <div
        className=" h-full absolute top-1/2 md:top-[30%] md:left-1/4 lg:left-1/4 lg:right-1/4 select-none"
        id="logo"
      >
        <img
          src={LogoSVG}
          alt="Mercury Logo"
          className=" min-h-screen min-w-screen opacity-90 pulsate fly-in-btm"
        />
      </div>

      <section className="wrapper z-50">
        <div className=" bg-my-dark text-my-light p-10 min-h-screen">
          <div className="flex flex-col mb-10 " id="page-content">
            <div className=" text-center select-none" id="header-text">
              <p
                className="font-bold text-7xl md:text-9xl text-my-orange"
                id="header-name"
              >
                MERCURY
              </p>
              <p
                className=" text-my-light font-semibold uppercase"
                id="header-slogan"
              >
                Modern Communication platform For More Modern Times
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
                <Link to="/login">
                  <button
                    className="btn primary w-64 m-5 fade-in"
                    id="login-button"
                  >
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button
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
