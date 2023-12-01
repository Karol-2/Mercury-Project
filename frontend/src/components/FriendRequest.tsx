import User from "../models/User";

interface FriendRequestInterface {
  user: User;
  friend: User;
  key: string;
  handleAcceptRequest: (currentId: string)=> void,
  handleDeclineRequest: (friend: User)=> void,

}

function FriendRequest(props: FriendRequestInterface) {
  const {user,friend,handleAcceptRequest,handleDeclineRequest} = props;

  return (
    <div className="flex flex-row bg-my-dark p-5 rounded-lg mt-5">
      <img
        src={user.profile_picture}
        className=" rounded-full w-40 h-40 border-my-orange border-4 object-cover"
      />
      <div className=" ml-5 flex flex-col justify-evenly">
        <p className=" font-semibold text-3xl">
          {user.first_name + " " + user.last_name}
        </p>
        <p> {props.user.country}</p>
        <div className="flex flex-row">
          <button
            className={`btn small bg-my-purple text-xs`}
            onClick={()=> handleAcceptRequest(String(user.id))}
          >
            Accept
          </button>
          <button
            className={`btn small bg-my-red text-xs`}
            onClick={()=>handleDeclineRequest(user)}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendRequest;
