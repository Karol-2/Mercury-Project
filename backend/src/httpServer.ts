import dotenv from "dotenv";
import servers from "./server.js";
import usersRouter from "./routes/usersRoute.js";
import authRouter from "./routes/authRoute.js";
import chatRouter from "./routes/chatRoute.js";
import { cleanUpData, importInitialData } from "./db.js";

const { app } = servers;

dotenv.config();

cleanUpData();
importInitialData().then((res) => console.log(res));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
