import Reaction from "./Reaction";
export default interface Message {
    id: string;
    date: Date;
    from_id: string;
    to_id: string;
    content: string;
    reactions: Reaction[];
}