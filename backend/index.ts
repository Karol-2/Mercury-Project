import express, { Express, Request, Response } from 'express';
import usersRouter from './routes/usersRoute';
import importInitialData from './data/importData';

const app: Express = express();
const port: number = 5000;

importInitialData();

app.get("/", (req: Request, res: Response) => {
  res.send("Mercury Project");
});

app.use(express.json());
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
