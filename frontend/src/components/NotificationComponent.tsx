import Notification from "../models/Notification";
import { IconDefinition, faCommentAlt, faTrash, faVideo, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
interface NotificationComponentProps {
    notification: Notification
}

function NotificationComponent({notification}: NotificationComponentProps) {
    const {type, senderFullName, action, deleteNotification} = notification;
    const [icon, setIcon] = useState<IconDefinition | null>(null);
    const [content, setContent] = useState<string>("");
    useEffect(() => {
        switch (type) {
            case "call":
                setIcon(faVideo);
                setContent(`${senderFullName} has invited you to meeting`);
                break;
            case "message":
                setIcon(faCommentAlt);
                setContent(`${senderFullName} has sent you a message`);
                break;
            case "friend":
                setIcon(faUser);
                setContent(`${senderFullName} has sent you a friend request`);
                break;
            default:
                break;
        }
    }, []);
    return (
        <div className="mx-20 bg-my-dark p-5 flex items-center rounded-xl">
            <div className="flex-1 flex items-center gap-10">
                <div className="text-4xl">
                    {icon ? <FontAwesomeIcon icon={icon} /> : null}
                </div>
                <div className="text-2xl">
                    {content}
                </div>
            </div>
            <div className="flex-1 flex gap-10 justify-end items-center">
                <div className="text-3xl w-1/4">
                    <button className="btn bg-my-green p-3 w-full" onClick={action}>
                        {icon ? <FontAwesomeIcon icon={icon} /> : null}
                    </button>
                </div>
                <div className="text-3xl w-1/4">
                    <button className="btn bg-my-red p-3 w-full" onClick={deleteNotification}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotificationComponent;