import User from "./User";

export default interface DbUser extends User {
  password: string;
  name_embedding: number[]
}
