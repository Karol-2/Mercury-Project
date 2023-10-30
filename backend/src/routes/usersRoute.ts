import { Router } from "express";
import User from "../models/User";
import chatRouter from "./chatsRoute";
import driver from "../driver/driver";
import Response from "../models/Response";

const usersRouter = Router();

usersRouter.get<{},Response,{},{}>("/", async (_req, res) => {
    try {
        const session = driver.session();
        const usersRequest = await session.run(
            `MATCH (u:User) RETURN ID(u), u`
        );
        const users = usersRequest.records.map(user => ({
            id: user.get(0).low, 
            ...user.get(1).properties 
        }));
        await session.close();
        return res.json({status: "ok", result: users});
    } catch (err) {
        return res.status(404).json({status: "error", errors: [err as object]});
    }
});

usersRouter.get<{userId: number},Response,{},{}>("/:userId", async (req, res) => {
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
        ? res.status(404).json({status: "error", errors: [{name: "NOT_FOUND"}]})
        : res.json({status: "ok", result: [user[0]]});
    } catch (err) {
        return res.status(404).json({status: "error", errors: [err as object]});
    }
});

usersRouter.post<{}, Response, User, {}>("/", async (req, res) => {
    try {
        const userConstuctor = req.body;
        const {
            nick,
            password,
            last_name,
            first_name,
            mail,
            country,
            profile_picture
        } = userConstuctor;
        const session = driver.session();

        const highestIdRequest = await session.run(
            "MATCH (u:User) RETURN max(toInteger(u.id)) AS highestId"
        );
        const highestId = highestIdRequest.records[0].get("highestId");

        const newUserId = highestId === null ? 0 : highestId + 1;

        const newUserRequest = await session.run(
            `CREATE (u:User {id: $newUserId, nick: $nick, password: $password,
            first_name: $first_name, last_name: $last_name, mail: $mail, 
            country: $country, profile_picture: $profile_picture}) 
            RETURN ID(u), u`,
            {
                newUserId,
                nick,
                first_name,
                last_name,
                mail,
                country,
                profile_picture,
                password
            }
        );

        const newUser = newUserRequest.records.map(user => ({
            id: user.get(0).low,
            ...user.get(1).properties
        }))[0];

        await session.close();
        return res.json({ status: "ok", result: [newUser] });
    } catch (err) {
        return res.status(404).json({ status: "error", errors: [err as object] });
    }
});

usersRouter.put<{userId:number},Response,User,{}>("/:userId", async (req, res) => {
    try {
        const userPropertiesToUpdate = req.body;
        const {
            nick,
            password,
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
            return res.status(404).json({status: "error", errors: [{name: "NOT_FOUND"}]});
        }
        await session.run(
            `MATCH (u:User) WHERE id(u)=$userId SET 
            u.nick=$nick, u.password=$password, 
            u.first_name=$first_name, u.last_name=$last_name, 
            u.mail=$mail, u.country=$country,
            u.profile_picture=$profile_picture`
        , {userId, nick, password, first_name, last_name, mail, country, profile_picture}); 
        await session.close();
        return res.json({status: "ok"});
    } catch (err) {
        return res.status(404).json({status: "error", errors: [err as object]});
    }
});

usersRouter.delete<{userId:number},Response,{},{}>("/:userId", async (req, res) => {
    try {
        const session = driver.session();
        const userId = Number(req.params.userId);
        const userExists = await session.run(
            `MATCH (u:User) WHERE id(u) = $userId RETURN u`
        , {userId});
        if (userExists.records.length === 0) {
            await session.close();
            return res.status(404).json({status: "error", errors: [{name: "NOT_FOUND"}]});
        }
        await session.run(
            `MATCH (u:User) WHERE id(u) = $userId DETACH DELETE u`
        ,{userId});
        await session.close();
        return res.json({status: "ok"});
    } catch (err) {
        return res.status(404).json({status: "error", errors: [err as object]});
    }
});

usersRouter.use("/:userId/chats", chatRouter);

export default usersRouter;