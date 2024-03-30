import { ChangeEvent, FormEvent, useState } from "react";
import User from "../models/User";
import { changePasswordSchema } from "../models/RegisterUserSchema";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordForm } from "../models/PasswordForm";

export interface EditDetails {
  provider: string;
  user: User;
  token?: string;
  redirectToLogin: () => void;
  logout: () => Promise<boolean>;
}

function EditPassword(props: EditDetails) {
  const { provider, user, token, redirectToLogin, logout } = props;
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<PasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { errors, isSubmitting } = formState;

  const [submitError, setSubmitError] = useState<string>("");
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    const logged_out = await logout();
    if (logged_out) {
      navigate("/");
    } else {
      throw new Error("Couldn't log out");
    }
  };
  const errorProps = {
    className: "pb-4 text-[#f88]",
  };

  const inputProps = {
    className: "text-my-dark form-input",
  };

  const editPassword = async (passwords?: PasswordForm): Promise<void> => {
    if (!token) {
      throw new Error("Token is undefined");
    }

    if (user) {
      const response = await fetch(
        `http://localhost:5000/users/${user.id}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(passwords || {}),
        },
      );

      if (response.ok) {
        return;
      }
      throw response;
    }
  };

  const submit = async (passwords: PasswordForm) => {
    try {
      await editPassword(passwords);

      handleLogout();
      navigate("/login");
    } catch (e) {
      if (e instanceof Error) {
        setSubmitError("Can't connect to the server");
        throw e;
      }

      if ((e as Response).status == 400) {
        setSubmitError("Invalid Password");
      } else {
        setSubmitError("Unknown error");
      }
    }
  };

  const formSubmit = () => {
    if (provider == "rest") {
      return handleSubmit(submit);
    } else if (provider == "keycloak") {
      return async (e: FormEvent) => {
        e.preventDefault();
        await editPassword();
        redirectToLogin();
      };
    } else {
      throw new Error("not implemented");
    }
  };

  return (
    <div className=" flex flex-col gap-2 bg-my-dark p-10 xl:px-44 rounded-xl">
      <h1 className="text-3xl font-bold text-my-orange">Change Password</h1>
      <hr className="text-my-orange"></hr>
      <form
        id="password-box"
        className=" flex flex-col gap-2 bg-my-dark sm:p-10 lg:px-44 rounded-xl"
        onSubmit={formSubmit()}
      >
        {provider == "rest" && (
          <>
            <div>Current password</div>
            <input
              {...inputProps}
              {...register("old_password")}
              value={formData.old_password}
              onChange={handleChange}
              type="password"
            />
            <div {...errorProps}>{errors.old_password?.message}</div>

            <div>New password</div>
            <input
              {...inputProps}
              {...register("new_password")}
              value={formData.new_password}
              onChange={handleChange}
              type="password"
            />
            <div {...errorProps}>{errors.new_password?.message}</div>

            <div>Repeat new password</div>
            <input
              {...inputProps}
              {...register("repeat_password")}
              type="password"
              value={formData.repeat_password}
              onChange={handleChange}
            />
            <div {...errorProps}>{errors.repeat_password?.message}</div>

            <div className="pb-4 text-[#f88]">{submitError}</div>
          </>
        )}

        <input
          disabled={isSubmitting}
          data-testid="Change"
          type="submit"
          className="btn small bg-my-orange disabled:bg-my-dark"
          value="Change"
        />
        {provider == "rest" && <p>WARNING: You will be logged out!</p>}
      </form>
    </div>
  );
}

export default EditPassword;
