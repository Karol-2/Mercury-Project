import { Dispatch, SetStateAction, useState } from "react";
import User, { FrontendUser } from "../models/User";
import { changePasswordSchema } from "../models/RegisterUserSchema";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordForm } from "../models/PasswordForm.model";

export interface EditDetails {
    user: User;
    updateUser: () => Promise<boolean>,
    setUser: Dispatch<SetStateAction<User | null | undefined>>
  }


function EditPassword(props: EditDetails) {

    const user: User = props.user;
    const updateUser = props.updateUser;
    const setUser = props.setUser;
    const navigate = useNavigate();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<PasswordForm>({
      resolver: zodResolver(changePasswordSchema),
    });
  
    const [submitError, setSubmitError] = useState<string>("");
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        repeat_password: ''

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
  
  
    // const editUser = async (newUser: FrontendUser): Promise<void> => {
    //     const userToSave: User = {
    //         ...user,
    //         first_name: newUser.first_name,
    //         last_name: newUser.last_name,
    //         country: newUser.country,
    //         mail: newUser.mail
    //     }
    //     console.log(userToSave);
    //     setUser(userToSave)

    //     updateUser().then((updated) => {
    //         if (updated) console.log("Updated");
    //         else throw new Error("Error while updating user");
    //       });
        
    // };
  
  
    const submit = async (passwords: PasswordForm) => {
        console.log("ok");
        
      try {
        // const changedUser = await editUser(user);
  
        console.log(passwords);
        // navigate("/profile");
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


    return(
        <div  className=" medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl">
        <h1 className="text-3xl font-bold text-my-orange">Edit Password</h1>
       <hr className="text-my-orange"></hr>
        <form
     id="register-box"
     className="medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl"
     onSubmit={handleSubmit(submit)}
   >
     <div>Current password:</div>
     <input
       {...inputProps}
       {...register("old_password")}
       value={formData.old_password}
       onChange={handleChange}
     />
     <div {...errorProps}>{errors.old_password?.message}</div>
     
     <div>New password:</div>
     <input
       {...inputProps}
       {...register("new_password")}
       value={formData.new_password}
       onChange={handleChange}
     />
     <div {...errorProps}>{errors.new_password?.message}</div>

     <div>Repeat new password:</div>
     <input
       {...inputProps}
       {...register("repeat_password")}
       value={formData.repeat_password}
       onChange={handleChange}
     />
     <div {...errorProps}>{errors.repeat_password?.message}</div>
    

     <div className="pb-4 text-[#f88]">{submitError}</div>

     <input
       disabled={isSubmitting}
       data-testid="Register"
       type="submit"
       className="btn small bg-my-orange disabled:bg-my-dark"
       value="Change Password"
     />

   </form>
   </div>
    )
}

export default EditPassword