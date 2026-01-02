import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { authentication, random } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.sendStatus(400).json({ message: "Missing required fields" });
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400).json({ message: "User already exists" });
        }

        const salt = random();
        // Registration logic goes here (e.g., hashing password, saving user to DB)
        const user = await createUser(username, email, authentication(salt, password), salt);
        res.sendStatus(200).json({ message: "User registered successfully" }).end();
    } catch (error) {
        res.sendStatus(400).json({ message: "Internal server error" });
    }
}