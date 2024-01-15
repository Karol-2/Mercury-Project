import { Router, Request } from "express";

import bcrypt from "bcrypt";

import driver from "../driver/driver";
import {
  JWTRequest,
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
} from "../misc/jwt";

import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenErrorResponse } from "../types/authResponse";
import { CustomResponse, OkResponse } from "../models/Response";
import { OkErrorResponse } from "../types/userResponse";
import User from "../models/User";
import { leaveMeeting } from "../meetings";
import { disconnectFromSocket } from "../sockets";

const authRouter = Router();

function generateTokens(res: TokenErrorResponse, userId: string) {
  const token = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    maxAge: 1209600,
  });

  return token;
}

authRouter.post("/login", async (req: Request, res: TokenErrorResponse) => {
  const { mail, password } = req.body;

  try {
    const session = driver.session();

    const userRequest = await session.run(
      `MATCH (u:User {mail: $mail}) RETURN u`,
      { mail },
    );

    if (userRequest.records.length == 0) {
      return res.status(401).json({ status: "unauthorized" });
    }

    const user = userRequest.records[0].get("u").properties;
    await session.close();

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ status: "unauthorized" });
    }

    const token = generateTokens(res, user.id);
    res.json({ status: "ok", token });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

authRouter.post(
  "/logout",
  authenticateToken,
  async (req: JWTRequest, res: OkErrorResponse) => {
    res.clearCookie("refreshToken", {
      secure: true,
      httpOnly: true,
    });

    const userId = (req.token as any).userId;

    try {
      const session = driver.session();
      await leaveMeeting(session, userId);
      await session.close();
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }

    res.json({ status: "ok" });
  },
);

authRouter.post("/refresh", async (req: Request, res: TokenErrorResponse) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ status: "forbidden" });
  }

  try {
    const verifiedToken = jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET!,
    ) as JwtPayload;

    const token = generateTokens(res, verifiedToken.userId);
    return res.json({ status: "ok", token });
  } catch (e) {
    return res.status(403).json({ status: "forbidden" });
  }
});

export default authRouter;
