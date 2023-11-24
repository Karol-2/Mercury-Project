import servers from "./server";
import driver from "./driver/driver";
import usersRouter from "./routes/usersRoute";
import authRouter from "./routes/authRoute";
import importInitialData from "./data/importData";
const {app} = servers;

importInitialData().then((res) => console.log(res));

app.use("/users", usersRouter);
app.use("/auth", authRouter);
