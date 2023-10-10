import User from "./User";
import Reaction from "./Reaction";
export default interface Message {
    id: string;
    date: Date;
    from: User;
    to: User;
    content: string;
    reactions: Reaction[];
}