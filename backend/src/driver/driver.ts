import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI || "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);

export default driver;