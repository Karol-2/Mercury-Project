import User from "../models/User";

export interface PeerInviteProps {
  friend: User;
  inviteFriendToRoom: (id: string) => void;
}

function PeerInvite({ friend, inviteFriendToRoom }: PeerInviteProps) {
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
            className={`btn small bg-my-green text-xs`}
            onClick={() => inviteFriendToRoom(friend.id)}
          >
            invite
          </button>
        </div>
      </div>
    </li>
  );
}

export default PeerInvite;
