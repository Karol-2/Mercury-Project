import express, { Express, Request, Response } from "express";
import cors from "cors";

import usersRouter from "./routes/usersRoute";
import importInitialData from "./data/importData";

const swaggerjsdoc = require("swagger-jsdoc")
const swaggerui = require("swagger-ui-express")

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

importInitialData().then((res) => console.log(res));

app.get("/", (_req: Request, res: Response) => {
  res.send("Mercury Project");
});

app.use(express.json());
app.use("/users", usersRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mercury backend API",
      version: "1.0.0",
      description:
        "This is an API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  apis: ["./routes/*.ts"],
}
const spacs = swaggerjsdoc(options);
app.use(
  "/api-docs",swaggerui.serve, swaggerui.setup(spacs)
)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
