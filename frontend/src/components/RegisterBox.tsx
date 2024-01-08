import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../models/RegisterUserSchema";
import { FrontendUser } from "../models/User";
import * as userPlaceholder from "../assets/user-placeholder.jpg";

function RegisterBox() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FrontendUser>({
    resolver: zodResolver(userSchema),
  });

  const [submitError, setSubmitError] = useState<string>("");
  const [profilePictureBase64, setProfilePictureBase64] = useState<string>("");
  const [pictureFile, setPictureFile] = useState<File>();

  const errorProps = {
    className: "pb-4 text-[#f88]",
  };

  const inputProps = {
    className: "text-my-dark form-input",
  };

  const countryOptions = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;

      input.value = e.target.value.toUpperCase();
      input.setSelectionRange(start, end);
    },
  };

  const registerUser = async (user: FrontendUser): Promise<FrontendUser> => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw response;
    }

    const userJson = await response.json();
    console.log("Register " + JSON.stringify(userJson));

    return userJson.user;
  };

  const encodePicture = async (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfilePictureBase64(base64);
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPictureFile(file);
      encodePicture(file);
    }
  };

  const createFileFromBlob = (
    blob: Blob,
    fileName: string,
    fileType: string,
  ): File => {
    const file = new File([blob], fileName, { type: fileType });
    return file;
  };

  const fetchDefaultPhoto = async (): Promise<File | undefined> => {
    try {
      const response = await fetch(userPlaceholder.default);
      if (response.ok) {
        const blob = await response.blob();
        const myFile = createFileFromBlob(
          blob,
          "user-placeholder.jpg",
          "image/jpeg",
        );
        setPictureFile(myFile);
        await encodePicture(myFile);
        // console.log(myFile);
        return myFile;
      } else {
        throw new Error("Failed to fetch image");
      }
    } catch (error) {
      throw new Error("Error fetching image: " + error);
    }
  };

  const submit = async (user: FrontendUser) => {
    try {
      if (!pictureFile) {
        const defaultFile = await fetchDefaultPhoto();
        if (defaultFile) {
          const base64 = await encodePicture(defaultFile);
          user.profile_picture = base64;
        }
      } else {
        user.profile_picture = profilePictureBase64;
      }

      const registered = await registerUser(user);

      console.log(registered);
      navigate("/login");
    } catch (e) {
      if (e instanceof Error) {
        setSubmitError("Can't connect to the server");
        throw e;
      }

      if ((e as Response).status == 400) {
        setSubmitError("User already exists");
      } else {
        setSubmitError("Unknown error");
      }
    }
  };

  return (
    <form
      id="register-box"
      className="medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl"
      onSubmit={handleSubmit(submit)}
    >
      <div>First name:</div>
      <input
        {...inputProps}
        {...register("first_name")}
        placeholder="First name"
      />
      <div {...errorProps}>{errors.first_name?.message}</div>
      <div>Last Name:</div>
      <input
        {...inputProps}
        {...register("last_name")}
        placeholder="Last name"
      />
      <div {...errorProps}>{errors.last_name?.message}</div>
      <div>
        <div className="flex gap-2 items-center">
          <div>Country Code:</div>
          <input
            {...inputProps}
            {...register("country", countryOptions)}
            placeholder="XX"
          />
        </div>
        <div {...errorProps}>{errors.country?.message}</div>
      </div>

      <div>Profile picture:</div>
      <div className="flex items-center justify-center space-x-4 rounded-xl">
        <label
          htmlFor="upload-button"
          className="relative cursor-pointer bg-gray-200 rounded-xl py-2 px-4 border border-gray-300"
        >
          <span className="cursor-pointer">Choose a file</span>
          <input
            id="upload-button"
            {...inputProps}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
          />
        </label>

        {profilePictureBase64 && (
          <>
            <img
              src={profilePictureBase64}
              alt="Profile"
              className="w-20 h-20 object-cover border border-gray-300 rounded-xl"
            />
            <button
              className="btn secondary"
              onClick={() => setProfilePictureBase64("")}
            >
              Clear
            </button>
          </>
        )}
      </div>

      <p className=" text-center"> {pictureFile?.name}</p>
      <div {...errorProps}>{errors.profile_picture?.message}</div>

      <div className="py-5">
        <div>E-mail:</div>
        <input {...inputProps} {...register("mail")} placeholder="E-mail" />
        <div {...errorProps}>{errors.mail?.message}</div>

        <div>Password:</div>
        <input
          {...inputProps}
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        <div {...errorProps}>{errors.password?.message}</div>
      </div>

      <div className="pb-4 text-[#f88]">{submitError}</div>

      <input
        disabled={isSubmitting}
        type="submit"
        className="btn small bg-my-orange disabled:bg-my-dark"
        value="Register"
      />

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
