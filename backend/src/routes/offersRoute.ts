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

offersRouter.post(
  "/",
  async (req, res) => {
    try {
      const session = driver.session();
      const newOfferProps = req.body;
      const newOfferResult = await session.run(`CREATE (o:Offer $offer) RETURN o`, {
        offer: newOfferProps,
      });
      const offer = newOfferResult.records[0].get(0).properties;
      await session.close();
      return res.json({ status: "ok", offer });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  }
);

offersRouter.put(
  "/:userId",
  async (req, res) => {
    try {
      const newProps = req.body;
      const {answer} = newProps;

      const session = driver.session();
      const userId = req.params.userId;
  
      await session.run(`MATCH (o:Offer)-[:DEDICATED]-(u:User {id: $userId}) SET o.answer=$answer`, {
        userId,
        answer
      });
  
      return res.json({ status: "ok" });
    } catch (err) {
      console.log("Error:", err);
      return res.status(404).json({ status: "error", errors: err as object });
    }
  }
)

export default offersRouter;