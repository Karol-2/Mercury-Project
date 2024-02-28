import {
  faUserMinus,
  faVideo,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "../models/User";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";

export interface FriendProps {
  friend: User;
  joinMeeting: (friendId: string) => Promise<string | void>;
  handleDeclineRequest: (friend: User) => Promise<void>;
}

function Friend(props: FriendProps) {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const friend: User = props.friend;
  const joinMeeting = props.joinMeeting;
  const handleDeclineRequest = props.handleDeclineRequest;

  return (
    <li key={friend.id} className="flex flex-row mt-5">
      <img
        src={friend.profile_picture}
        className="rounded-full w-28 h-28 border-my-orange border-2 object-cover"
      />
      <div className=" ml-5 flex flex-col justify-evenly">
        <p className="font-semibold text-2xl">
          <span className="">
            {" "}
            {friend.first_name} {friend.last_name}{" "}
          </span>
          <button
            className={` text-my-red text-sm my-2 p-2 rounded-md transition hover:scale-110 hover:bg-my-red hover:text-my-light active:translate-x-2`}
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            <FontAwesomeIcon icon={faUserMinus} />
          </button>
        </p>
        <div className="flex flex-col xl:flex-row">
          <button
            className={`btn small bg-my-orange text-xs my-2`}
            onClick={() => joinMeeting(friend.id)}
          >
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button
            className={`btn small bg-my-purple text-xs my-2`}
            onClick={() => navigate(`/messages/${friend.id}`)}
          >
            <FontAwesomeIcon icon={faCommentAlt} />
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <Modal
          text={`Are you sure that you want remove ${friend.first_name} ${friend.last_name} from your friends ?`}
          handleYes={() => {
            handleDeclineRequest(friend);
            setShowDeleteModal(false);
          }}
          handleNo={() => setShowDeleteModal(false)}
        ></Modal>
      )}
    </li>
  );
}

export default Friend;
