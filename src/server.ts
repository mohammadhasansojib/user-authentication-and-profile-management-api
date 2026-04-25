import express from "express";
import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()
import { prisma } from "../lib/prisma";
import {add} from 'date-fns'
import nodemailer from "nodemailer"
import {networkInterfaces} from "os"
import cookieParser from "cookie-parser"
import session from "express-session"
import { createClient } from "redis";
import userRouter from "./routes/user.route"

export const redis = createClient({
    username: 'default',
    password: process.env.REDIS_DB_PASSWORD,
    socket: {
        host: 'redis-13333.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13333
    }
});

redis.on('error', err => console.log('Redis Client Error', err));


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
}))


// user router
app.use("/api", userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    })
})

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

app.get('/api/date', (req: Request, res: Response) => {
    let result = add(new Date(), {
        seconds: -50
    });
    let now = new Date();

    console.log(result);

    return res.json({
        now,
        expires_at: result,
        isExpired: now > result,
        dateType: typeof result
    });
})

app.post('/api/send-mail', async (req: Request, res: Response) => {
    const {to, subject, text, user_name, reset_link} = req.body;

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Password Reset</title></head><body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table width="100%" style="max-width:600px;background:#ffffff;"><tr><td style="background:#2563eb;padding:25px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">Your Company</td></tr><tr><td style="padding:40px 30px;"><h1 style="font-size:24px;margin-bottom:20px;color:#333;">Password Reset Request</h1><p style="font-size:16px;color:#555;line-height:1.6;">Hello ${user_name},</p><p style="font-size:16px;color:#555;line-height:1.6;">We received a request to reset your password. Click the button below to choose a new password.</p><p style="text-align:center;margin:30px 0;"><a href="${reset_link}" target="_blank" style="display:inline-block;padding:14px 28px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Reset Password</a></p><p style="font-size:16px;color:#555;line-height:1.6;">If the button doesn't work, copy and paste this link into your browser:</p><p style="word-break:break-all;font-size:14px;color:#555;">${reset_link}</p><p style="font-size:16px;color:#555;line-height:1.6;">If you didn’t request a password reset, you can safely ignore this email.</p><p style="font-size:16px;color:#555;line-height:1.6;">Thanks,<br>Your Company Team</p></td></tr><tr><td style="text-align:center;font-size:13px;color:#888;padding:20px;">© 2026 Your Company. All rights reserved.</td></tr></table></td></tr></table></body></html>`;


    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USERNAME;
    const pass = process.env.SMTP_PASSWORD;

    const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        // secure: true,
        auth: {
            user,
            pass,
        }
    });

    const info = await transporter.sendMail({
        from: `"My App" <mohammadhasansojib@gmail.com>`,
        to,
        subject,
        text,
        html,
    });

    res.json({
        message: info.response,
        id: info.messageId
    });

})

app.get('/api/device-details', async (req: Request, res: Response) => {
    const nets = networkInterfaces();
    const results = Object.create(null);

    for (const name of Object.keys(nets)) {
        for (const net of nets[name] as any) {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }


    // let ip: string;

    // dns.lookup(os.hostname(), { family: 4 }, async (err, addr) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.log(`IPv4 address: ${addr}`);
    //         ip = addr;
    //     }
    // });

    res.cookie("sid", req.sessionID, {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })

    res.cookie("token", "mytoken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        signed: true
    })


    res.json({
        device: {
            device_details: results,
            sid: req.cookies.sid,
            token: req.signedCookies.token
        }
    });
})


app.get("/api/redis-set", async (req: Request, res: Response) => {
    // // Initial hash creation
    // await client.hSet('user:101', {
    //     name: 'Shahroz',
    //     email: 'shahroz@example.com',
    //     age: 27,
    // });

    // // Update the 'age' field to a new value
    // await client.hSet('user:101', 'age', 28);
    // console.log('User age updated!');

    await redis.connect();

    const refresh_token = {
        token: "-------",
        ip: "192.168.1.5",
        device: "Android"
    };

    await redis.hSet("auth:refresh:userID-1:sid-1", refresh_token);
    await redis.hSet("auth:refresh:userID-1:sid-2", refresh_token);
    await redis.hSet("auth:refresh:userID-1:sid-3", refresh_token);

    await redis.expire("auth:refresh:userID-1:sid-1", 50);
    await redis.expire("auth:refresh:userID-1:sid-2", 50);
    await redis.expire("auth:refresh:userID-1:sid-3", 50);

    await redis.quit();


    res.json({
        message: "refresh token has been set"
    })
})

app.get("/api/redis-get", async (req: Request, res: Response) => {

    await redis.connect();

    // const keys = await client.keys("auth:refresh:userID-1:*");
    // const ttl = await client.ttl("auth:refresh:userID:sid");

    let refresh_tokens = [];

    for await (const keys of redis.scanIterator({
        MATCH: "auth:refresh:userID-1:*"
    })){
        const tokens = await Promise.all(
            keys.map((key) => redis.hGetAll(key))
        );
        
        refresh_tokens.push(...tokens);
    }

    await redis.quit();

    res.json({
        refresh_tokens
    })
})

app.get('/api/redis-del', async (req: Request, res: Response) => {
    await redis.connect()

    for await (const key of redis.scanIterator({
        MATCH: "auth:refresh:userID-1:*"
    })){
        await redis.del(key);
    }

    await redis.quit();

    res.json({message: "Deleted successfully"})
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at port ${port}...`));