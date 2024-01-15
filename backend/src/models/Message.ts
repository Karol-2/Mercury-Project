export default interface Message {
  type: "sent" | "received" | "info";
  sentDate: Date;
  fromUserId: string;
  toUserId: string;
  content: string;
}
