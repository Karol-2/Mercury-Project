import { Link } from "react-router-dom";
import { fetchData } from "../services/fetchData";

function LoginBox() {
  const loginFunc = async () => {
    const response = await fetchData("/users/1", "GET");
    console.log("Login " + JSON.stringify(response));
  };

  return (
    <div
      className=" medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl"
      id="login-box"
    >
      <div>Login:</div>
      <input
        type="text"
        className="text-my-dark form-input"
        placeholder="Login"
      />

      <div>Password:</div>
      <input
        type="password"
        className="text-my-dark form-input"
        placeholder="Password"
      />

      <button className="btn small bg-my-orange" onClick={() => loginFunc()}>
        Login
      </button>
      <div className="text-center">
        <p>New to Mercury?</p>
        <p className="font-bold">
          <Link to="/register">Create a new account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginBox;
