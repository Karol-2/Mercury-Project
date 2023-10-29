import { Link } from "react-router-dom";

function LoginBox() {
  const loginFunc = async () => {
    const response = await fetch("http://localhost:5000/users/1");
    const user = await response.json();
    console.log("Login " + JSON.stringify(user));
  };

  return (
    <div className=" w-80 flex flex-col gap-2 bg-my-dark p-10 m-10 rounded-xl">
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

      <button className="btn bg-my-orange" onClick={() => loginFunc()}>
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
