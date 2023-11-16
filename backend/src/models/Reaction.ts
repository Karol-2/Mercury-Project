export default interface Reaction {
	id: string;
	user_id: string;
	type: "like" | "super" | "ha-ha" | "angry" | "sad";
}
