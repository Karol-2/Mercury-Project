import {
  CustomResponse,
  JWTResponse,
  AuthResponse,
  ErrorResponse,
} from "../models/Response";

export type TokenErrorResponse = CustomResponse<
  JWTResponse | AuthResponse | ErrorResponse
>;
