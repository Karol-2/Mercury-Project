import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import usersRouter from "./routes/usersRoute";
import importInitialData from "./data/importData";
import authRouter from "./routes/authRoute";

dotenv.config();

const app: Express = express();
const port: number = 5000;

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cookieParser());

importInitialData().then((res) => console.log(res));

app.get("/", (_req: Request, res: Response) => {
  res.send("Mercury Project");
});

app.use(express.json());
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
