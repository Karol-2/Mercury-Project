import User from "../models/User";

interface FoundUserInterface{
    user: User
}

function FoundUser(props: FoundUserInterface) {

  return (
    <div className="">
        <img src={props.user.profile_picture}></img>
     <p> {props.user.first_name + " "+ props.user.last_name}</p>
     <p> {props.user.country}</p>
     <button> Add Friend</button>
    </div>
  );
}

export default FoundUser;
