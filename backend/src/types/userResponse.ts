import {
  CustomResponse,
  ErrorResponse,
  OkResponse,
  UserResponse,
  UsersResponse,
  FriendsResponse,
  UsersSearchResponse,
  AuthResponse,
  FriendsPageResponse,
  FriendRequestsPageResponse,
  FriendSuggestionsPageResponse,
  MessagesResponse,
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
  FriendSuggestionsPageResponse | ErrorResponse
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
