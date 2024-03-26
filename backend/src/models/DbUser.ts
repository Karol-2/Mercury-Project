import { Either } from "../misc/Either.js";
import ExternalUser from "./ExternalUser.js";
import NativeUser from "./NativeUser.js";
import User from "./User.js";

export interface DbUserBase extends User {
  name_embedding: number[];
}

type DbUser = DbUserBase & Either<NativeUser, ExternalUser>;

export default DbUser;
