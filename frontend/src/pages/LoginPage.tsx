import Footer from "../components/Footer";
import LoginBox from "../components/LoginBox";
import Banner from "../components/Banner";
import { useUser } from "../helpers/UserProvider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import createSocketConnection from "../redux/actions/createSocketConnection";

function LoginPage() {
  const user = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("LoginPage:", user);
    const { userId } = user;
    if (userId !== null) {
      dispatch(createSocketConnection(userId!));
    }
  }, [user]);

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
