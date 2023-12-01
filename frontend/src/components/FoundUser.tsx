import { useState, useEffect } from "react";
import User from "../models/User";
import dataService from "../services/data";

interface FoundUserInterface {
  user: User;
  key: string;
  currentId: string | null | undefined;
  isFriend: boolean;
}

function FoundUser(props: FoundUserInterface) {
  const [requestSent, setRequestSent] = useState(false);

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

  return (
    <div className="flex flex-row bg-my-dark p-5 rounded-lg mt-5">
      <img
        src={props.user.profile_picture}
        className="rounded-full w-40 h-40 border-my-orange border-4 object-cover"
      />
      <div className="ml-5 flex flex-col justify-evenly">
        <p className="font-semibold text-3xl">
          {props.user.first_name + " " + props.user.last_name}
        </p>
        <p>{props.user.country}</p>
        <button
          className={`btn small bg-my-purple text-xs`}
          disabled={props.isFriend || requestSent}
          onClick={handleAddFriend}
        >
          {requestSent
            ? "Request Sent"
            : props.isFriend
              ? "You are already friends!"
              : "Add Friend"}
        </button>
      </div>
    </div>
  );
}

export default FoundUser;
