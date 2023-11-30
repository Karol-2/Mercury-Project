import User from "../models/User";

interface FoundUserInterface{
    user: User,
    key: string;
    isFriend: boolean;
}

function FoundUser(props: FoundUserInterface) {
  // console.log(props.isFriend, props.user.first_name)

  return (
    <div className="flex flex-row bg-my-dark p-5 rounded-lg mt-5">
        <img src={props.user.profile_picture} className=" rounded-full w-40 h-40 border-my-orange border-4 object-cover" />
        <div className=" ml-5 flex flex-col justify-evenly">
          <p className=" font-semibold text-3xl"> {props.user.first_name + " "+ props.user.last_name}</p>
          <p> {props.user.country}</p>
          <button
              className={`btn small bg-my-purple text-xs`}
              disabled={props.isFriend}
            >
              {props.isFriend ? 'You are already friends!' : 'Add Friend'}
            </button>
          
        </div>
    </div>
  );
}

export default FoundUser;
