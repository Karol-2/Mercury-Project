import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../helpers/UserProvider";

function LoginBox() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  const { userId, login: userLogin } = useUser() || { login: () => {} };
  const firstVisit = useRef<boolean>(true);

  const loginFunc = async () => {
    userLogin(login, password);
  };

  useEffect(() => {
    if (userId === undefined) return;

    if (userId === null) {
      if (firstVisit.current) {
        firstVisit.current = false;
        return;
      }

      setLoginMsg("Bad credentials");
    } else {
      navigate("/profile", { replace: true });
      setLoginMsg("Logging in...");
    }
  }, [userId]);

  return (
    <div
      className=" medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl"
      id="login-box"
    >
      <div>E-mail:</div>
      <input
        type="text"
        className="text-my-dark form-input"
        placeholder="E-mail"
        onChange={(e) => setLogin(e.target.value)}
      />

      <div>Password:</div>
      <input
        type="password"
        className="text-my-dark form-input"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn small my-4 bg-my-orange" onClick={() => loginFunc()}>
        Login
      </button>
      <div className="text-center">
        <p>New to Mercury?</p>
        <p className="font-bold">
          <Link to="/register">Create a new account</Link>
        </p>
        <div className="text-red">{loginMsg}</div>
      </div>
    </div>
  );
}

export default LoginBox;
