import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()
import { prisma } from "../lib/prisma";

const app = express();

app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    res.json({message: "Hello World"});
})

app.get("/api/users", async (req: Request, res: Response) => {
    const users = await prisma.users.findMany();

    return res.json(users);
})

app.post("/api/users", async (req: Request, res: Response) => {
    const {email, name, password_hash} = req.body;

    const user = await prisma.users.create({
        data: {
            email,
            password_hash,
            name
        }
    });

    return res.json(user);
})


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ${port}...`));