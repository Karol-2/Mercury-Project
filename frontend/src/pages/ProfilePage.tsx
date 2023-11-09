import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import User from "../models/user.model";

const user: User =  {
  "nick": "boejiden",
  "password": "sleepyjoe",
  "first_name": "Joe",
  "last_name": "Biden",
  "country": "USA",
  "profile_picture": "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/ea/ec/36/eaec3686-c87d-1957-8d44-c6b8addda35a/pr_source.png/256x256bb.jpg",
  "mail": "joe.biden@gmail.com",
  "friend_ids": [ 2 ],
  "chats": []
}

function ProfilePage(){

  return (<>
  <Navbar />
  <section className="bg-my-darker min-h-screen" >
        <h1>Your profile</h1>
        <hr></hr>
        <div>
          <p>Nick: {user.nick} </p>
          <p>First Name: {user.first_name} </p>
          <p>Last Name: {user.last_name} </p>
          <p>Country: {user.country} </p>
          <p>E-mail: {user.mail} </p>
          <p>Password: {user.password} </p>
          
        </div>
        <img src={user.profile_picture}></img>
      </section>
      <Footer />
  </>
      
  );
}

export default ProfilePage;