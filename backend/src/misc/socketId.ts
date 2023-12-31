import driver from "../driver/driver";
export async function setSocketId(socketId: string, userId: string) {
  try {
    const session = driver.session();
    await session.run(`MATCH (u:User {id: $userId}) SET u.socketId=$socketId`, {
      userId,
      socketId,
    });
    await session.close();
  } catch (err) {
    return;
  }
}

export async function getSocketId(userId: string) {
  try {
    const session = driver.session();
    const socketIdResponse = await session.run(
      `MATCH (u:User {id: $userId}) RETURN u.socketId`,
      {
        userId,
      },
    );
    await session.close();
    const socketId = socketIdResponse.records[0].get(0);
    return socketId;
  } catch (err) {
    return;
  }
}
