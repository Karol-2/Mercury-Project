import { Router } from "express";
import { isFriend } from "../users";
import driver from "../driver/driver";
const roomRouter = Router();

roomRouter.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const session = driver.session();
    const roomsQuery = await session.run(
      `
            MATCH (room:Room)-[:INVITED]-(u:User {id: $userId})
            RETURN room
        `,
      { userId },
    );
    await session.close();
    const rooms = roomsQuery.records
      .map((record) => record.get("room").properties)
      .map((record) => ({
        ...record,
        title: "Join meeting",
      }));
    return res.json({ status: "ok", rooms });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

roomRouter.post("/", async (req, res) => {
  try {
    const newRoomProps = req.body;
    const { roomId, from, to } = newRoomProps;
    const session = driver.session();
    const areFriends = await isFriend(session, from, to);
    if (!areFriends) {
      await session.close();
      return res
        .status(400)
        .json({ status: "error", errors: { id: "no friends" } });
    }
    await session.run(`CREATE (r: Room $room)`, { room: newRoomProps });
    await session.run(
      `
            MATCH (u:User {id: $userId})
            MATCH (r:Room {roomId: $roomId})
            CREATE (r)-[:INVITED]->(u)
        `,
      { userId: to, roomId },
    );
    await session.close();
    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

roomRouter.delete("/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const session = driver.session();
    await session.run(`MATCH (r:Room {roomId: $roomId}) DETACH DELETE r`, {
      roomId,
    });
    await session.close();
    return res.json({ status: "ok" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(404).json({ status: "error", errors: err as object });
  }
});

export default roomRouter;
