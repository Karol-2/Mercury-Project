import Chat from "./Chat";
export default interface User {
    id: string;
    nick: string;
    first_name: string;
    last_name: string;
    country: string;
    profile_picture: string;
    mail: string;
    friend_ids: string[];
    chats: Chat[];
}