import { Router } from "express";
import User from "../models/User";
import chatRouter from "./chatsRoute";
import driver from "../driver/driver";

const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
    const session = driver.session();
    const usersRequest = await session.run(
        `MATCH (u:User) RETURN ID(u), u`
    );
    const users = usersRequest.records.map(user => ({
        id: user.get(0).low, 
        ...user.get(1).properties 
    }));
    await session.close();
    return res.send(users);
});

usersRouter.get("/:userId", async (req, res) => {
    try {
        const session = driver.session();
        const userId = Number(req.params.userId);
        const userRequest = await session.run(
            `MATCH (u:User) WHERE id(u) = $userId 
            RETURN ID(u),u`
        , {userId});
        const user = userRequest.records.map(user => ({
            id: user.get(0).low, 
            ...user.get(1).properties 
        }));
        await session.close();
        return user.length === 0
        ? res.status(404).send(`NOT FOUND`)
        : res.send(user[0]);
    } catch (err) {
        return res.status(404).send(err);
    }
});

usersRouter.post("/", async (req, res) => {
    try {
        const userConstuctor: User = req.body;
        const {
            nick, 
            last_name, 
            first_name, 
            mail, 
            country, 
            profile_picture
        } = userConstuctor;
        const session = driver.session();
        const userExists = await session.run(
            `MATCH (u:User {nick: $nick}) RETURN u`
        , {nick});
        if (userExists.records.length > 0) {
            await session.close();
            return res.status(404).send("ALREADY EXISTS");
        }
        const newUserRequest = await session.run(
            `MERGE (u:User {nick: $nick, first_name: $first_name, 
            last_name: $last_name, mail: $mail, 
            country: $country, profile_picture: $profile_picture}) 
            RETURN ID(u),u`, 
        {nick, first_name, last_name, mail, country, profile_picture});
        const newUser = newUserRequest.records.map(user => ({
            id: user.get(0).low, 
            ...user.get(1).properties 
        }))[0];
        await session.close();
        return res.send(newUser);
    } catch (err) {
        return res.status(404).send(err);
    }
});

usersRouter.put("/:userId", async (req, res) => {
    try {
        const userPropertiesToUpdate: User = req.body;
        const {
            nick, 
            last_name, 
            first_name, 
            mail, 
            country, 
            profile_picture
        } = userPropertiesToUpdate;
        const session = driver.session();
        const userId = Number(req.params.userId);
        const userExists = await session.run(
            `MATCH (u:User) WHERE id(u) = $userId RETURN u`
        , {userId});
        if (userExists.records.length === 0) {
            await session.close();
            return res.status(404).send("NOT EXIST");
        }
        console.log({userId, nick, first_name, last_name, mail, country, profile_picture})
        await session.run(
            `MATCH (u:User) WHERE id(u)=$userId SET 
            u.nick=$nick, u.first_name=$first_name, 
            u.last_name=$last_name, u.mail=$mail, 
            u.country=$country, u.profile_picture=$profile_picture`
        , {userId, nick, first_name, last_name, mail, country, profile_picture}); 
        await session.close();
        return res.send("UPDATED");
    } catch (err) {
        return res.status(404).send(err);
    }
});

usersRouter.delete("/:userId", async (req, res) => {
    try {
        const session = driver.session();
        const userId = Number(req.params.userId);
        const userExists = await session.run(
            `MATCH (u:User) WHERE id(u) = $userId RETURN u`
        , {userId});
        if (userExists.records.length === 0) {
            await session.close();
            return res.send("NOT EXISTS");
        }
        await session.run(
            `MATCH (u:User) WHERE id(u) = $userId DETACH DELETE u`
        ,{userId});
        await session.close();
        return res.send("DELETED");
    } catch (err) {
        return res.status(404).send("DELETED");
    }
});

usersRouter.use("/:userId/chats", chatRouter);

export default usersRouter;