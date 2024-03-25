import User from "./User";

import { Response } from "express";
import { Jwt } from "jsonwebtoken";

type Send<J, T = Response> = (body?: J) => T;

export interface CustomResponse<J> extends Response {
  json: Send<J, this>;
}

export interface ErrorResponse {
  status: "error";
  errors: Record<string, any> & { length?: never };
}

export interface OkResponse {
  status: "ok";
}

export interface UserResponse {
  status: "ok";
  user: User;
}

export interface UsersResponse {
  status: "ok";
  users: User[];
}

export interface FriendsResponse {
  status: "ok";
  friends: User[];
}

export interface UsersSearchResponse {
  status: "ok";
  allUsersSize: number;
  totalPage: number;
  users: User[];
}

export interface JWTResponse extends OkResponse {
  token: string;
}

export interface AuthResponse {
  status: "unauthorized" | "forbidden";
}
