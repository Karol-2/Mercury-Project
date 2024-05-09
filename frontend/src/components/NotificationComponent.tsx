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
        <div>
            <div>
                {icon ? <FontAwesomeIcon icon={icon} /> : null}
            </div>
            <div>
                {content}
            </div>
            <div>
                <button onClick={action}>
                    {icon ? <FontAwesomeIcon icon={icon} /> : null}
                </button>
            </div>
            <div>
                <button onClick={deleteNotification}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    )
}

export default NotificationComponent;