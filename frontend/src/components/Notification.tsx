import RoomNotification from "../models/RoomNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faVideo } from "@fortawesome/free-solid-svg-icons";
interface NotificationProps {
    roomNotification: RoomNotification;
    handleRoomInvite: (id: string) => void;
    declineInvite: (id: string) => void;
}
function Notification({roomNotification, handleRoomInvite, declineInvite}: NotificationProps) {
    return (
        <div className="bg-my-light-dark p-3 text-xl rounded-2xl font-normal flex items-center gap-x-10">
            {roomNotification.userName} has invited you to meeting
            <button 
                onClick={() => handleRoomInvite(roomNotification.roomId)} 
                className="btn small bg-my-green flex gap-x-4"
            >
                <FontAwesomeIcon icon={faVideo} />
                Accept
            </button>
            <button 
                onClick={() => declineInvite(roomNotification.roomId)} 
                className="btn bg-my-red small flex justify-center items-center"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    )
}
export default Notification;