import { Router, Request } from "express";

import driver from "../driver/driver";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../misc/jwt";
import { CustomResponse, JWTResponse, AuthResponse, ErrorResponse } from "../models/Response";

const authRouter = Router()

type TokenErrorResponse = CustomResponse<
  JWTResponse | AuthResponse | ErrorResponse
>;

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

    if (user.password != password) {
      return res.status(401).json({ status: "unauthorized" });
    }

    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: 1209600,
    });
    res.json({ status: "ok", token });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
})

export default authRouter;
