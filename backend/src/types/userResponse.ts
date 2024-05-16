import {
  AuthResponse,
  CustomResponse,
  ErrorResponse,
  FriendRequestsPageResponse,
  FriendsPageResponse,
  FriendsResponse,
  FriendSuggestionsPageResponse,
  MessagesResponse,
  OkResponse,
  UserResponse,
  UsersResponse,
  UsersSearchResponse,
} from "../models/Response.js";

export type UsersErrorResponse = CustomResponse<UsersResponse | ErrorResponse>;
export type UserErrorResponse = CustomResponse<UserResponse | ErrorResponse>;
export type OkErrorResponse = CustomResponse<OkResponse | ErrorResponse>;
export type AuthOkErrorResponse = CustomResponse<
  AuthResponse | OkResponse | ErrorResponse
>;
export type FriendsErrorResponse = CustomResponse<
  FriendsResponse | ErrorResponse
>;
export type FriendRequestsPageErrorResponse = CustomResponse<
  FriendRequestsPageResponse | ErrorResponse
>;
export type FriendSuggestionsPageErrorResponse = CustomResponse<
  AuthResponse | FriendSuggestionsPageResponse | ErrorResponse
>;
export type FriendsPageErrorResponse = CustomResponse<
  AuthResponse | FriendsPageResponse | ErrorResponse
>;
export type UsersSearchErrorResponse = CustomResponse<
  UsersSearchResponse | ErrorResponse
>;

export type AuthMessagesErrorResponse = CustomResponse<
  AuthResponse | MessagesResponse | ErrorResponse
>;
