import { useForm } from "react-hook-form";
import User, { FrontendUser } from "../models/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { userEditDetails } from "../models/RegisterUserSchema";
import { ChangeEvent, useState } from "react";
import countriesData from "../assets/countries.json";
import Select from "react-select";
import Popup from "./Popup";

export interface EditDetails {
  user: User;
  updateUser: (updateUser: Partial<User>) => Promise<boolean>;
}

function EditDetails(props: EditDetails) {
  const user: User = props.user;
  const updateUser = props.updateUser;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FrontendUser>({
    resolver: zodResolver(userEditDetails),
  });

  const [submitError, setSubmitError] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [country, setCountry] = useState<string>(user.country);
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    mail: user.mail,
    country: country,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCountryChange = (selection: any) => {
    const selectedCountry = selection ? selection.value : "";

    setCountry(selectedCountry);
    setFormData((prevState) => {
      return { ...prevState, country: selectedCountry };
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e);

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const editUser = async (newUser: FrontendUser): Promise<void> => {
    const changes: Partial<User> = {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      country: country,
      mail: newUser.mail,
    };

    updateUser(changes).then((updated) => {
      if (updated) console.log("Updated");
      else throw new Error("Error while updating user");
    });
  };

  const popupHandler = () => {
    setShowPopup(!showPopup);
  };

  const submit = async (user: FrontendUser) => {
    setShowPopup(false);
    try {
      await editUser(user);

      setShowPopup(true);
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
    <div className=" flex flex-col gap-2 bg-my-dark p-10 rounded-xl">
      <h1 className="text-3xl font-bold text-my-orange">Edit Details</h1>
      <hr className="text-my-orange"></hr>
      <div className=" 3xl:mx-40 lg:mx-15">
        <form
          id="details-box"
          className=" flex flex-col gap-2 bg-my-dark sm:p-10 md:px-20 2.5xl:px-72 rounded-xl"
          onSubmit={handleSubmit(submit)}
        >
          <div>First name</div>
          <input
            {...inputProps}
            {...register("first_name")}
            value={formData.first_name}
            onChange={handleChange}
          />
          <div {...errorProps}>{errors.first_name?.message}</div>
          <div>Last Name</div>
          <input
            {...inputProps}
            {...register("last_name")}
            value={formData.last_name}
            onChange={handleChange}
          />
          <div {...errorProps}>{errors.last_name?.message}</div>
          <div>
            <div className="flex gap-2 items-center">
              <div>Country</div>
              <Select
                {...inputProps}
                {...register("country")}
                value={countryOptions.find(
                  (option) => option.value === formData.country,
                )}
                onChange={handleCountryChange}
                options={countryOptions}
              />
            </div>
            <div {...errorProps}>{errors.country?.message}</div>
          </div>

          <div className="py-5">
            <div>E-mail</div>
            <input
              {...inputProps}
              {...register("mail")}
              placeholder="E-mail"
              value={formData.mail}
              onChange={handleChange}
            />
            <div {...errorProps}>{errors.mail?.message}</div>

            <div {...errorProps}>{errors.password?.message}</div>
          </div>

          <div className="pb-4 text-[#f88]">{submitError}</div>

          <input
            disabled={isSubmitting}
            data-testid="Register"
            type="submit"
            className="btn small bg-my-orange disabled:bg-my-dark"
            value="Save"
          />
        </form>
      </div>

      {showPopup && (
        <Popup
          header="Successful data change!"
          isVisibleHandler={popupHandler}
          isVisibleState={showPopup}
          seconds={3}
        />
      )}
    </div>
  );
}

export default EditDetails;
