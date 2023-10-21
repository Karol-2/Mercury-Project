import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import usersRouter from './routes/usersRoute';

const app: Express = express();
const port: number = 5000;

const corsOptions = {
  origin: "http://localhost:4173",
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.get("/", (req: Request, res: Response) => {
  res.send("Mercury Project");
});

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
