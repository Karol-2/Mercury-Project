import {
  AuthResponse,
  CustomResponse,
  ErrorResponse,
  JWTResponse,
} from "../models/Response.js";

export type TokenErrorResponse = CustomResponse<
  JWTResponse | AuthResponse | ErrorResponse
>;
