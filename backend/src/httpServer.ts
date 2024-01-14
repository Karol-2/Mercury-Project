import dotenv from "dotenv";
import servers from "./server";
import usersRouter from "./routes/usersRoute";
import authRouter from "./routes/authRoute";
import chatRouter from "./routes/chatRoute";
import importInitialData from "./data/importData";
import { cleanUpData } from "./db";

const { app } = servers;

dotenv.config();

importInitialData().then((res) => console.log(res));
cleanUpData();

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
