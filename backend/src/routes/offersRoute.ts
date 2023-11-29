import { Router } from "express";

const offersRouter = Router();

offersRouter.get("/", async (req, res) => {
    return res.json("offers");
});

export default offersRouter;