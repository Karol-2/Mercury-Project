import driver from "../driver/driver";
import { userExists } from "../routes/usersRoute";
async function setSocketId(socketId: string, userId: string) {
    try {
        const session = driver.session();        
        await session.run(`MATCH (u:User {id: $userId}) SET u.socketId=$socketId`, {
            userId,
            socketId
        });
        await session.close();
    } catch (err) { 
        return;
    }
}
export default setSocketId;