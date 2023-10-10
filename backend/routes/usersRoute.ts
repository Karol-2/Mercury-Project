import { Router } from "express";
const usersRouter = Router();

usersRouter.get("/", (_req, res) => {
    return res.send("All users will be received");
});

usersRouter.get("/:userId", (req, res) => {
    return res.send(`User with ${req.params.userId} ID will be received`);
});

usersRouter.post("/", (_req, res) => {
    return res.send("New user will be created");
});

usersRouter.put("/:userId", (req, res) => {
    return res.send(`User with ${req.params.userId} ID will be updated`);
});

usersRouter.delete("/:userId", (req, res) => {
    return res.send(`User with ${req.params.userId} ID will be deleted`);
});

export default usersRouter;