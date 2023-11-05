import express, { Express, Request, Response } from 'express';
import cors from "cors";

import usersRouter from './routes/usersRoute';
import importInitialData from './data/importData';

const app: Express = express();
const port: number = 5000;

const corsOptions = {
  origin: ['http://localhost:5000', 'http://localhost:5173'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

importInitialData().then((res) => console.log(res));


app.get("/", (_req: Request, res: Response) => {
  res.send("Mercury Project");
});

app.use(express.json());
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
