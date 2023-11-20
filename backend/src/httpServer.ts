import servers from "./server";
import driver from "./driver/driver";
import CreateMeetingDto from "./dtos/createMeeting";
import { sign, verify } from "jsonwebtoken";
const {app} = servers;
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";


app.post("/meeting", async (req, res) => {
    try {
        const {ownerId, guestId} = req.body as CreateMeetingDto;
        const session = driver.session();
        const newMeetingRequest = await session.run(`
            MATCH (u1:User) WHERE id(u1)=$ownerId
            MATCH (u2:User) WHERE id(u2)=$guestId
            MATCH (u1)-[:FRIENDS]-(u2)
            WHERE NOT (u1)-[:MEETING]-(u2)
            CREATE (u1)-[m:MEETING]->(u2)
            RETURN m
        `, {ownerId, guestId});
        await session.close();
        if (newMeetingRequest.records.length === 0) {
            return res.status(404).json({ status: "error", errors: {message: "Cannot create new meeting"} });
        }
        const meetingId = newMeetingRequest.records[0].get(0).identity.low;
        const token = sign({ownerId, guestId, meetingId}, linkSecret);
        return res.json({token});      
    } catch (err) {
        console.log("Error:", err);
        return res.status(404).json({ status: "error", errors: err as object });
    }
});

app.post("/decode", (req, res) => {
    const {token} = req.body as {token: string};
    const decodedData = verify(token, linkSecret);
    return res.json({decodedData});
});

app.get("/guest-token/:guestId", async (req, res) => {
    try {
        const guestId = Number(req.params.guestId);
        const session = driver.session();
        const guestRequest = await session.run(`
            MATCH (u:User) WHERE id(u)=$guestId RETURN u
        `,{guestId});
        await session.close();
        if (guestRequest.records.length === 0) {
            return res.status(404).json({ status: "error", errors: {message: "User does not exist"} });
        }
        const {identity, properties} = guestRequest.records[0].get(0);
        const token = sign({id: identity.low, ...properties}, linkSecret);
        return res.json({token});
    } catch (err) {
        console.log("Error:", err);
        return res.status(404).json({ status: "error", errors: err as object });
    }
});