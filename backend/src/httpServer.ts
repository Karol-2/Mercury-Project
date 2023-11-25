import { sign, verify } from "jsonwebtoken";
import {v4} from "uuid";
import dotenv from "dotenv";
import servers from "./server";
import driver from "./driver/driver";
import usersRouter from "./routes/usersRoute";
import authRouter from "./routes/authRoute";
import importInitialData from "./data/importData";
import CreateMeetingDto from "./dtos/createMeeting";

const {app} = servers;

dotenv.config();
const linkSecret = process.env.LINK_SECRET;

importInitialData().then((res) => console.log(res));

app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.post("/meeting", async (req, res) => {
    try {
        const {ownerId, guestId} = req.body as CreateMeetingDto;
        const meetingId = v4();
        const session = driver.session();
        const newMeetingRequest = await session.run(`
            MATCH (u1:User) WHERE u1.id=$ownerId
            MATCH (u2:User) WHERE u2.id=$guestId
            MATCH (u1)-[:IS_FRIENDS_WITH]-(u2)
            WHERE NOT (u1)-[:MEETING]-(u2)
            CREATE (u1)-[m:MEETING {meetingId: $meetingId}]->(u2)
            RETURN m
        `, {ownerId, guestId, meetingId});
        await session.close();
        if (newMeetingRequest.records.length === 0) {
            return res.status(404).json({ status: "error", errors: {message: "Cannot create new meeting"} });
        }
        const token = sign({ownerId, guestId, meetingId}, linkSecret!);
        return res.json({token});      
    } catch (err) {
        console.log("Error:", err);
        return res.status(404).json({ status: "error", errors: err as object });
    }
});

app.post("/decode", (req, res) => {
    const {token} = req.body as {token: string};
    const decodedData = verify(token, linkSecret!);
    return res.json({decodedData});
});

app.get("/guest-token/:guestId", async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const session = driver.session();
        const guestRequest = await session.run(`
            MATCH (u:User) WHERE u.id=$guestId RETURN u
        `,{guestId});
        await session.close();
        if (guestRequest.records.length === 0) {
            return res.status(404).json({ status: "error", errors: {message: "User does not exist"} });
        }
        const guest = guestRequest.records[0].get(0).properties;
        const token = sign(guest, linkSecret!);
        return res.json({token});
    } catch (err) {
        console.log("Error:", err);
        return res.status(404).json({ status: "error", errors: err as object });
    }
});