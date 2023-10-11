import express, { Express, Request, Response } from 'express';
import usersRouter from './routes/usersRoute';

const app: Express = express();
const port: number = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Mercury Project");
});

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
