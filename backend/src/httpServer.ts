import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { createServer } from "node:http";

import usersRouter from "./routes/usersRoute.js";
import authRouter from "./routes/authRoute.js";
import chatRouter from "./routes/chatRoute.js";

const app = express();
const port: number = 5000;

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

const expressServer = createServer(app);

expressServer.listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
});

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);

export {expressServer}
