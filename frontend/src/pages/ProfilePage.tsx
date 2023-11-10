import React, { useState, useLayoutEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import User from "../models/user.model";
import { fetchData } from "../services/fetchData";

const testUser: User = {
  nick: "boejiden",
  password: "sleepyjoe",
  first_name: "Joe",
  last_name: "Biden",
  country: "USA",
  profile_picture:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/ea/ec/36/eaec3686-c87d-1957-8d44-c6b8addda35a/pr_source.png/256x256bb.jpg",
  mail: "joe.biden@gmail.com",
  friend_ids: [2],
  chats: [],
};

function ProfilePage() {
  const [user, setUser] = useState<User>(testUser);
  const [isEditing, setIsEditing] = useState(false);

  useLayoutEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchData("/user/1","GET");
        userData.status === "ok" ? setUser(userData.result): "";
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    const sendData = async () => {
      try {
        const message = await fetchData("/user/1","PUT",{body: JSON.stringify(user) });
        message.status === "ok" ? setUser(message.result): console.log("Error from the source: ", message.result );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    sendData();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <section className="bg-my-darker min-h-screen flex justify-center ">
        <div className=" bg-my-dark p-10 px-20 rounded-xl mx-50 my-20 lg:mx-72 text-lg">
          <h1 className="text-3xl font-bold">Your profile</h1>
          <hr className="text-my-orange"></hr>
          <div>
          <img src={user.profile_picture} alt="Profile" className="my-5" />
            <p>First Name: {isEditing ? <input type="text" name="first_name" value={user.first_name} onChange={handleChange} /> : user.first_name}</p>
            <p>Last Name: {isEditing ? <input type="text" name="last_name" value={user.last_name} onChange={handleChange} /> : user.last_name}</p>
            <p>Country: {isEditing ? <input type="text" name="country" value={user.country} onChange={handleChange} /> : user.country}</p>
            <p>E-mail: {isEditing ? <input type="text" name="mail" value={user.mail} onChange={handleChange} /> : user.mail}</p>
            <p>Password: {isEditing ? <input type="text" name="password" value={user.password} onChange={handleChange} /> : user.password}</p>
          </div>
          <div className="my-5">
          {isEditing ? (
            <button onClick={handleSaveClick} className="btn primary">Save</button>
          ) : (
            <button onClick={handleEditClick} className="btn primary">Edit</button>
          )}
          <button className="btn secondary">Remove account</button>
          </div>
         
          
        </div>
        
      </section>
      <Footer />
    </>
  );
}

export default ProfilePage;
