import User from "./User.js";

import { Response } from "express";

type Send<J, T = Response> = (body?: J) => T;

export interface CustomResponse<J> extends Response {
  json: Send<J, this>;
}

export type Errors = {
  [key: string]: Errors | string;
};

export interface ErrorResponse {
  status: "error";
  errors: Errors;
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

export interface FriendsPageResponse {
  status: "ok";
  pageCount: number;
  friends: User[];
}

export interface FriendRequestsPageResponse {
  status: "ok";
  pageCount: number;
  friendRequests: User[];
}

export interface FriendSuggestionsPageResponse {
  status: "ok";
  pageCount: number;
  friendSuggestions: User[];
}

export interface UsersSearchResponse {
  status: "ok";
  pageCount: number;
  users: User[];
}

export interface JWTResponse extends OkResponse {
  token: string;
}

export interface AuthResponse {
  status: "unauthorized" | "forbidden";
}
