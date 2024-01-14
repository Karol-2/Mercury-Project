import driver from "./driver/driver";

export async function cleanUpData() {
  const session = driver.session();
  await session.run(`MATCH (m:Meeting) DETACH DELETE m`);
  await session.run(`MATCH (s:Socket) DETACH DELETE s`);
  session.close();
}
