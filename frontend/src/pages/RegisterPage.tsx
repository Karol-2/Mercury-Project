import Footer from "../components/Footer";
import RegisterBox from "../components/RegisterBox";
import LogoSVG from "/logo.svg";

function RegisterPage() {
  return (
    <div className=" min-h-screen flex flex-col bg-my-darker con">
      <div className="flex flex-row justify-center bg-my-dark py-5">
        <img src={LogoSVG} alt="Mercury Logo" className=" h-32 w-32 pr-5 " />
        <span className=" self-center text-my-orange font-bold text-3xl md:text-5xl">
          {" "}
          Mercury
        </span>
      </div>
      <h1 className="text-xl md:text-3xl text-my-light text-center p-5">
        {" "}
        Creating a new account
      </h1>
      <div className="flex justify-center">
        <RegisterBox />
      </div>

      <Footer />
    </div>
  );
}

export default RegisterPage;
