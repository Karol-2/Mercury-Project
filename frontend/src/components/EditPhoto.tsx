import { useNavigate } from "react-router-dom";
import User from "../models/User";
import { Dispatch, SetStateAction, useState } from "react";

export interface EditDetails {
    user: User;
    updateUser: () => Promise<boolean>,
    setUser: Dispatch<SetStateAction<User | null | undefined>>
  }

function EditPhoto(props: EditDetails) {
    const user: User = props.user;
    const updateUser = props.updateUser;
    const setUser = props.setUser;
    
    const navigate = useNavigate();

    const [profilePictureBase64, setProfilePictureBase64] = useState<string>(user.profile_picture);
    const [submitError, setSubmitError] = useState<string>("");

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
          encodePicture(file);
        }
      };

    const inputProps = {
      className: "text-my-dark form-input",
    };
  
    const editPhoto = async (): Promise<void> => {
        const userToSave: User = {
            ...user,
            profile_picture: profilePictureBase64
        }
        console.log(userToSave);
        setUser(userToSave)

        updateUser().then((updated) => {
            if (updated) console.log("Updated");
            else throw new Error("Error while updating user");
          });
        
    };
  
  
    const submit = async () => {
      try {
        const changedUser = await editPhoto();
  
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
    <div id="wrapper" className=" medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl">
            <h1 className="text-3xl font-bold text-my-orange">Change Photo</h1>
         <hr className="text-my-orange"></hr>
      <div id="box" className="medium:w-[25vw] flex flex-col gap-2 bg-my-dark p-10 px-20 rounded-xl">


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
      <button className="btn small bg-my-purple" onClick={()=>submit()}>Change Profile Picture</button>
      <div className="pb-4 text-[#f88]">{submitError}</div>
      </div>
       
    </div>
  );
}

export default EditPhoto;
