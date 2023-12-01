import User from "../models/User";
import dataService from "../services/data";

interface FriendRequestInterface {
  user: User;
  key: string;
  currentId: number;
}

function FriendRequest(props: FriendRequestInterface) {
  const handleAcceptRequest = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await dataService.fetchData(
      `/users/${props.currentId}/add/${props.user.id}`,
      "POST",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(props.currentId, props.user.id);
  };

  const handleDeclineRequest = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await dataService.fetchData(
      `/users/${props.currentId}/remove/${props.user.id}`,
      "DELETE",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  };

  return (
    <div className="flex flex-row bg-my-dark p-5 rounded-lg mt-5">
      <img
        src={props.user.profile_picture}
        className=" rounded-full w-40 h-40 border-my-orange border-4 object-cover"
      />
      <div className=" ml-5 flex flex-col justify-evenly">
        <p className=" font-semibold text-3xl">
          {" "}
          {props.user.first_name + " " + props.user.last_name}
        </p>
        <p> {props.user.country}</p>
        <div className="flex flex-row">
          <button
            className={`btn small bg-my-orange text-xs`}
            onClick={handleAcceptRequest}
          >
            Accept
          </button>
          <button
            className={`btn small bg-my-purple text-xs`}
            onClick={handleDeclineRequest}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendRequest;
