import * as React from "react";
import LogoSVG from "/logo.svg";
import { Link } from "react-router-dom";

export default function WelcomeMessage() {
  return (
    <div className="relative overflow-hidden  ">
      <div className=" h-full absolute top-1/2 md:top-1/4   lg:left-1/4 lg:right-1/4 ">
        <img
          src={LogoSVG}
          alt="Mercury Logo"
          className=" min-h-screen min-w-screen opacity-90 pulsate fly-in-btm"
        />
      </div>

      <section className="Wrapper  ">
        <div className=" bg-my-dark text-my-light p-10 min-h-screen">
          <div className="flex flex-col mb-10 ">
            <div className=" text-center">
              <p className="font-bold text-7xl md:text-9xl text-my-orange">
                MERCURY
              </p>
              <p className=" text-my-light font-semibold uppercase">
                Modern Communication platform For More Modern Times
              </p>
            </div>
            <div className=" text-my-darker flex flex-row justify-evenly mt-20 lg:mt-72">
              <div className=" z-50 flex flex-col lg:flex-row">
                <Link to="/login">
                  <button className="btn bg-my-orange m-5 fade-in ">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn bg-my-purple m-5 text-my-light fade-in">
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
