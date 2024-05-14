import neo4j from "neo4j-driver";

const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!username) {
  throw new Error("NEO4J_USERNAME environment variable not provided!");
}

if (!password) {
  throw new Error("NEO4J_PASSWORD environment variable not provided!");
}

const driver = neo4j.driver(
  process.env.NEO4J_URI || "neo4j://localhost:7687",
  neo4j.auth.basic(username, password),
);

export default driver;
