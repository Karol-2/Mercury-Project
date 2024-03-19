import User from "./User.js";

export default interface DbUser extends User {
  password: string;
  name_embedding: number[]
}
