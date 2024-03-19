import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthResponse, CustomResponse } from "../models/Response.js";
import DecodedData from "../models/DecodedData.js";

export interface JWTRequest extends Request {
  token?: jwt.Jwt;
}

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, process.env.TOKEN_SECRET!, { expiresIn: 900 });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, process.env.TOKEN_SECRET!, {
    expiresIn: 1209600,
  });
}

export async function authenticateToken(
  req: JWTRequest,
  res: CustomResponse<AuthResponse> | Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).send({ status: "unauthorized" });
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.TOKEN_SECRET!);
    req.token = verifiedToken as jwt.Jwt;
    next();
  } catch (e) {
    return res.status(403).json({ status: "forbidden" });
  }
}

export function decodeSocketData(
  handshakeData: string,
  linkSecret: string,
): DecodedData | null {
  try {
    const decodedData = jwt.verify(handshakeData, linkSecret);
    return decodedData as DecodedData;
  } catch (_e) {
    return null;
  }
}
