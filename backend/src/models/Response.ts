import User from "./User";

export default interface Response {
    status: "ok" | "error",
    result?: User[],
    errors?: object[]
}