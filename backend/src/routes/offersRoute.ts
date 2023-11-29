import { Router } from "express";
import { userExists } from "./usersRoute";
import driver from "../driver/driver";
const offersRouter = Router();

offersRouter.get(
    "/:userId", 
    async (req, res) => {
        try {
            const session = driver.session();
            const userId = req.params.userId;
      
            const user = await userExists(session, res, userId);
            if ("json" in user) {
              await session.close();
              return res;
            }
      
            const offersRequest = await session.run(
              `MATCH (o:Offer)-[:DEDICATED]-(u:User {id: $userId}) RETURN o`,
              { userId },
            );
            await session.close();
      
            const offers = offersRequest.records.map((o) => o.get("o").properties);
            return res.json({ status: "ok", offers });
        } catch (err) {
            console.log("Error:", err);
            return res.status(404).json({ status: "error", errors: err as object });
        }
    }
);

export default offersRouter;