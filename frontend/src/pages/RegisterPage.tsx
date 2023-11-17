import Footer from "../components/Footer";
import RegisterBox from "../components/RegisterBox";
import Banner from "../components/Banner";

function RegisterPage() {
  return (
    <div className=" min-h-screen flex flex-col bg-my-darker con">
      <Banner />
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
