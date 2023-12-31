import Footer from "../components/Footer";
import LoginBox from "../components/LoginBox";
import Banner from "../components/Banner";
import { useUser } from "../helpers/UserProvider";
import { useEffect } from "react";

function LoginPage() {
  const userId = useUser();

  useEffect(() => {
    console.log("LoginPage:", userId);
  }, [userId]);

  return (
    <div className=" min-h-screen flex flex-col bg-my-darker con">
      <Banner />
      <h1 className="text-xl md:text-3xl text-my-light text-center p-5">
        Login to your account
      </h1>
      <div className="flex justify-center">
        <LoginBox />
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;
