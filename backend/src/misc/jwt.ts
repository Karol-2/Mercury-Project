import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  keycloakCredentials,
  keycloakIssuer,
  keycloakUri,
} from "../kcAdminClient.js";
import DecodedData from "../models/DecodedData.js";
import Issuer from "../models/Issuer.js";
import { AuthResponse, CustomResponse } from "../models/Response.js";
import TokenPayload from "../models/TokenPayload.js";

export interface JWTRequest extends Request {
  token?: TokenPayload;
  tokenStr?: string;
}

export const issuers: Record<Issuer, string> = {
  mercury: `${keycloakIssuer}/realms/mercury`,
  rest: "http://localhost:5000",
};

export function generateAccessToken(userId: string) {
  return jwt.sign({ iss: issuers["rest"], userId }, process.env.TOKEN_SECRET!, {
    expiresIn: 900,
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ iss: issuers["rest"], userId }, process.env.TOKEN_SECRET!, {
    expiresIn: 1209600,
  });
}

function tokenIssuerToName(issuer: string): Issuer | "unknown" {
  return (
    (Object.keys(issuers) as Issuer[]).find((i) => issuers[i] == issuer) ||
    "unknown"
  );
}

export async function verifyKeycloakToken(tokenStr: string): Promise<boolean> {
  const response = await fetch(
    `${keycloakUri}/realms/mercury/protocol/openid-connect/token/introspect`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${keycloakCredentials}`,
      },
      body: `token=${tokenStr}`,
    },
  );

  return response.status == 200;
}

export async function checkToken(
  tokenStr: string,
): Promise<TokenPayload | null> {
  const tokenDecoded = jwt.decode(tokenStr) as TokenPayload | null;
  if (!tokenDecoded) {
    return null;
  }

  const issuer = tokenIssuerToName(tokenDecoded.iss || "");

  if (issuer == "mercury") {
    const valid = await verifyKeycloakToken(tokenStr);
    if (valid) {
      return tokenDecoded;
    }
    return null;
  }

  if (issuer == "rest") {
    try {
      const verifiedToken = jwt.verify(tokenStr, process.env.TOKEN_SECRET!);
      return verifiedToken as TokenPayload;
    } catch (e) {
      return null;
    }
  }

  return null;
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

  const verifiedToken = await checkToken(token);
  if (verifiedToken) {
    req.token = verifiedToken as TokenPayload;
    next();
  } else {
    return res.status(403).json({ status: "forbidden" });
  }
}

export async function getToken(
  req: JWTRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token != null) {
    const verifiedToken = await checkToken(token);
    if (verifiedToken) {
      req.token = verifiedToken as jwt.Jwt;
    } else {
      return res.status(403).json({ status: "forbidden" });
    }
  }

  next();
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
