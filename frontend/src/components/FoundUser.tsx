import { useState, useEffect } from "react";
import User from "../models/User";
import dataService from "../services/data";

interface FoundUserProps {
  user: User;
  key: string;
  currentId: string | null | undefined;
  isFriend: boolean;
}

function FoundUser(props: FoundUserProps) {
  const [requestSent, setRequestSent] = useState(false);
  const { user, isFriend } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsRequestsResponse = await dataService.fetchData(
          `/users/${props.user.id}/friend-requests`,
          "GET",
          {},
        );

        const isRequestSent = friendsRequestsResponse.friends.some(
          (friend: User) => String(friend.id) === props.currentId,
        );

        setRequestSent(isRequestSent);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddFriend = async () => {
    try {
      await dataService.fetchData(
        `/users/${props.currentId}/add/${props.user.id}`,
        "POST",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setRequestSent(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let buttonColor = "";
  let buttonText = "";

  if (requestSent) {
    buttonColor = "bg-my-orange";
    buttonText = "Request sent";
  } else if (isFriend) {
    buttonColor = "bg-my-darker";
    buttonText = "You are already friends!";
  } else {
    buttonColor = "bg-my-purple";
    buttonText = "Add friend";
  }

  return (
    <div className="flex flex-row bg-my-dark p-5 rounded-lg mt-5">
      <img
        src={user.profile_picture}
        className="rounded-full w-40 h-40 border-my-orange border-4 object-cover"
      />
      <div className="ml-5 flex flex-col justify-evenly">
        <p className="font-semibold text-3xl">
          {user.first_name + " " + user.last_name}
        </p>
        <p>{user.country}</p>
        <button
          className={`btn small text-xs w-52 ${buttonColor}`}
          disabled={isFriend || requestSent}
          onClick={handleAddFriend}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default FoundUser;
