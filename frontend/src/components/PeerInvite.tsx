import { useRef } from "react";
import User from "../models/User";

export interface PeerInviteProps {
  friend: User;
  inviteFriendToRoom: (id: string) => void;
}

function PeerInvite({ friend, inviteFriendToRoom }: PeerInviteProps) {
  const inviteButtonRef = useRef<HTMLButtonElement>(null);
  const handleInviteFriendToRoom = (friendId: string) => {
    inviteFriendToRoom(friendId);
    inviteButtonRef.current!.disabled = true;
  }
  return (
    <li className="flex flex-row justify-center gap-4">
      <img
        src={friend.profile_picture}
        className="rounded-full w-14 h-14 border-my-orange border-2 object-cover"
      />
      <div className="flex flex-col justify-evenly items-center gap-2">
        <p className="font-semibold">
          <span className="">
            {" "}
            {friend.first_name} {friend.last_name}{" "}
          </span>
        </p>
        <div className="flex flex-col xl:flex-row">
          <button
            ref={inviteButtonRef}
            className={`btn small bg-my-green text-xs`}
            onClick={() => handleInviteFriendToRoom(friend.id)}
          >
            invite
          </button>
        </div>
      </div>
    </li>
  );
}

export default PeerInvite;
