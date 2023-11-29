import { useState } from "react";
import { Link } from "react-router-dom";
import { FrontendUser } from "../models/user.model";

function RegisterBox() {
  const [user, setUser] = useState<Partial<FrontendUser>>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const input = (
    placeholder: string,
    type: string,
    name: keyof FrontendUser,
  ) => (
    <input
      className="text-my-dark form-input"
      type={type}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <form
      id="register-box"
      className="medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl"
      onSubmit={handleSubmit}
    >
      <div>First and last name:</div>
      {input("First name", "text", "first_name")}
      {input("Last name", "text", "last_name")}

      <div>
        <span>Country:</span>
        {input("Country", "text", "country")}
      </div>

      <div>Profile picture:</div>
      {input("", "file", "profile_picture")}

      <div className="py-10">
        <div>E-mail:</div>
        {input("E-mail", "text", "mail")}

        <div>Password:</div>
        {input("Password", "password", "password")}
      </div>

      <button className="btn small bg-my-orange" type="submit">
        Register
      </button>
      <div className="text-center">
        <p>Already have an account?</p>
        <p className="font-bold">
          <Link to="/login">Login</Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterBox;
