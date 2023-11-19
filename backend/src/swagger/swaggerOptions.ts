import path from "path";
import YAML from "yaml";
import fs from "fs";

const swaggerYamlPath = path.join(__dirname, "swagger.yaml");

const swaggerDocument = fs.readFileSync(swaggerYamlPath, "utf8");

const yamlContents = YAML.parse(swaggerDocument);

const swaggerOptions = {
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
    ...yamlContents, 
  },
  apis: [path.join(__dirname, "../routes/*.ts")],
};

  export default swaggerOptions;

  