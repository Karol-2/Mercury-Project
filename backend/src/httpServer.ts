import dotenv from "dotenv";
import servers from "./server";
import usersRouter from "./routes/usersRoute";
import authRouter from "./routes/authRoute";
import chatRouter from "./routes/chatRoute";
import { cleanUpData, importInitialData } from "./db";

const { app } = servers;

dotenv.config();

cleanUpData();
importInitialData().then((res) => console.log(res));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
