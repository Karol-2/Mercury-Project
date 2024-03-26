import {
  CustomResponse,
  JWTResponse,
  AuthResponse,
  ErrorResponse,
} from "../models/Response.js";

export type TokenErrorResponse = CustomResponse<
  JWTResponse | AuthResponse | ErrorResponse
>;
