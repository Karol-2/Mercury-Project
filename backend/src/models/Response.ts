import User from "./User"

import { Response } from "express"

type Send<J, T = Response> = (body?: J) => T

export interface CustomResponse<J> extends Response {
  json: Send<J, this>
}

export interface ErrorResponse {
  status: "error",
  errors: object
}

export interface OkResponse {
  status: "ok"
}

export interface UserResponse {
  status: "ok",
  user: User
}

export interface UsersResponse {
  status: "ok",
  users: User[]
}

export interface FriendsResponse {
  status: "ok",
  friends: User[]
}
