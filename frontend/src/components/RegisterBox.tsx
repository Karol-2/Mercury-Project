import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RegisterBox() {
  const [user, setUser] = useState({});
  useEffect(() => {
    console.log(user);
  }, [user]);

  const updateFormUser = (key: string) => {
    const changeKey = updateUser(key);
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      changeKey(e.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateUser = (key: string) => (value: any) => {
    setUser({ ...user, [key]: value });
  };

  const registerFunc = async () => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const userJson = await response.json();
    console.log("Register " + JSON.stringify(userJson));
  };

  return (
    <div
      className=" medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl"
      id="register-box"
    >
      <div>First and last name:</div>
      <input
        type="text"
        className="text-my-dark form-input"
        onChange={updateFormUser("first_name")}
        placeholder="First name"
      />
      <input
        type="text"
        className="text-my-dark form-input"
        onChange={updateFormUser("last_name")}
        placeholder="Last name"
      />

      <div>
        <span>Country:</span>
        <input
          type="text"
          className="text-my-dark form-input"
          onChange={updateFormUser("country")}
          placeholder="Country"
        />
      </div>

      <div>Profile picture:</div>
      <input
        type="file"
        className="text-my-dark form-input"
        onChange={updateFormUser("profile_picture")}
      />

      <div className=" py-10">
        <div>E-mail:</div>
        <input
          type="text"
          className="text-my-dark form-input"
          onChange={updateFormUser("mail")}
          placeholder="E-mail"
        />

        <div>Login:</div>
        <input
          type="text"
          className="text-my-dark form-input"
          onChange={updateFormUser("nick")}
          placeholder="Login"
        />

        <div>Password:</div>
        <input
          type="password"
          className="text-my-dark form-input"
          onChange={updateFormUser("mail")}
          placeholder="Password"
        />
      </div>

      <button className="btn small bg-my-orange" onClick={() => registerFunc()}>
        Register
      </button>
      <div className="text-center">
        <p>Already have an account?</p>
        <p className="font-bold">
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterBox;
