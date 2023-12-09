import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import ServerToClientEvents from "./events/ServerToClientEvents";
import ClientToServerEvents from "./events/ClientToServerEvents";

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:5173"],
  optionsSuccessStatus: 200,
};

const app: Express = express();
const port: number = 5000;

app.use(cors(corsOptions));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(cookieParser());
app.use(express.json());

const expressServer = createServer(app);

const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(
  expressServer,
  {
    cors: { origin: ["http://localhost:5173"] },
  },
);

expressServer.listen(port, () =>
  console.log(`HTTP server running on port ${port}`),
);

export default { expressServer, io, app };