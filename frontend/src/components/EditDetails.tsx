import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import User, { FrontendUser } from "../models/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { userEditDetails } from "../models/RegisterUserSchema";
import { Dispatch, SetStateAction, useState } from "react";

export interface EditDetails {
    user: User;
    updateUser: () => Promise<boolean>,
    setUser: Dispatch<SetStateAction<User | null | undefined>>
  }

function EditDetails(props: EditDetails) {
    const user: User = props.user;
    const updateUser = props.updateUser;
    const setUser = props.setUser;
    const navigate = useNavigate();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<FrontendUser>({
      resolver: zodResolver(userEditDetails),
    });
  
    const [submitError, setSubmitError] = useState<string>("");
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        country: user.country,
        mail: user.mail

    })

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
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
  
    const countryOptions = {
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;
  
        input.value = e.target.value.toUpperCase();
        input.setSelectionRange(start, end);
      },
    };
  
    const editUser = async (newUser: FrontendUser): Promise<void> => {
        const userToSave: User = {
            ...user,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            country: newUser.country,
            mail: newUser.mail
        }
        console.log(userToSave);
        setUser(userToSave)

        updateUser().then((updated) => {
            if (updated) console.log("Updated");
            else throw new Error("Error while updating user");
          });
        
    };
  
  
    const submit = async (user: FrontendUser) => {
      try {
        const changedUser = await editUser(user);
  
        console.log(changedUser);
        navigate("/profile");
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
    <div  className=" medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl">
         <h1 className="text-3xl font-bold text-my-orange">Edit Details</h1>
        <hr className="text-my-orange"></hr>
         <form
      id="register-box"
      className="medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl"
      onSubmit={handleSubmit(submit)}
    >
      <div>First name:</div>
      <input
        {...inputProps}
        {...register("first_name")}
        value={formData.first_name}
        onChange={handleChange}
      />
      <div {...errorProps}>{errors.first_name?.message}</div>
      <div>Last Name:</div>
      <input
        {...inputProps}
        {...register("last_name")}
        value={formData.last_name}
        onChange={handleChange}
      />
      <div {...errorProps}>{errors.last_name?.message}</div>
      <div>
        <div className="flex gap-2 items-center">
          <div>Country Code:</div>
          <input
            {...inputProps}
            {...register("country", countryOptions)}
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div {...errorProps}>{errors.country?.message}</div>
      </div>

      <div className="py-5">
        <div>E-mail:</div>
        <input {...inputProps} {...register("mail")} placeholder="E-mail"  value={formData.mail}
            onChange={handleChange} />
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
  );
}

export default EditDetails;
