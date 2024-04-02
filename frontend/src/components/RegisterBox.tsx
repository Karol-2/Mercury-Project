import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema } from "../models/RegisterUserSchema";
import { FrontendUser } from "../models/User";
import * as userPlaceholder from "../assets/user-placeholder.jpg";
import { useUser } from "../helpers/UserContext";
import Select from "react-select";
import countriesData from "../assets/countries.json";

function RegisterBox() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FrontendUser>({
    resolver: zodResolver(userRegisterSchema),
  });

  const { registerUser, redirectToLogin } = useUser();

  const [submitError, setSubmitError] = useState<string>("");
  const [profilePictureBase64, setProfilePictureBase64] = useState<string>("");
  const [pictureFile, setPictureFile] = useState<File>();

  const errorProps = {
    className: "pb-4 text-[#f88]",
  };

  const inputProps = {
    className: "text-my-dark form-input",
  };

  const countryOptions = countriesData.map((country) => ({
    value: country.Country,
    label: country.Country,
  }));

  const [country, setCountry] = useState(countriesData[0].Country);

  const handleCountryChange = (e: any) => {
    const selectedCountry = e ? e.value : "";
    setCountry(selectedCountry);
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

      user.country = country;
      await registerUser(user);

      redirectToLogin();
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
      <div>First name</div>
      <input
        {...inputProps}
        {...register("first_name")}
        placeholder="First name"
      />
      <div {...errorProps}>{errors.first_name?.message}</div>
      <div>Last Name</div>
      <input
        {...inputProps}
        {...register("last_name")}
        placeholder="Last name"
      />
      <div {...errorProps}>{errors.last_name?.message}</div>
      <div>
        <div className="flex gap-2 items-center">
          <div>Country</div>
          <Select
            {...inputProps}
            {...register("country")}
            options={countryOptions}
            onChange={handleCountryChange}
            value={countryOptions.find((option) => option.value === country)}
          />
        </div>
        <div {...errorProps}>{errors.country?.message}</div>
      </div>

      <div>Profile picture</div>
      <div className="flex items-center justify-center space-x-4 rounded-xl">
        <label
          htmlFor="upload-button"
          className=" my-2 p-2 rounded-lg transition duration-250 ease-in-out bg-my-orange hover:bg-my-orange-dark font-bold text-lg active:translate-y-1"
        >
          <span className="cursor-pointer">Choose a file</span>
          <input
            id="upload-button"
            {...inputProps}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="opacity-0 w-4 h-4 cursor-pointer"
          />
        </label>

        {profilePictureBase64 && (
          <img
            src={profilePictureBase64}
            alt="Profile"
            className="w-20 h-20 object-cover border border-gray-300 rounded-xl"
          />
        )}
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-center"> {pictureFile?.name}</p>
        {pictureFile && (
          <button
            className=" my-2 p-2 rounded-lg transition duration-250 ease-in-out bg-my-orange hover:bg-my-orange-dark font-bold text-lg active:translate-y-1"
            onClick={() => {
              setProfilePictureBase64("");
              setPictureFile(undefined);
            }}
          >
            Clear
          </button>
        )}
      </div>
      <div {...errorProps}>{errors.profile_picture?.message}</div>

      <div className="py-5">
        <div>E-mail</div>
        <input {...inputProps} {...register("mail")} placeholder="E-mail" />
        <div {...errorProps}>{errors.mail?.message}</div>

        <div>Password</div>
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
        data-testid="Register"
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
