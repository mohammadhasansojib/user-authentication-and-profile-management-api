import type { Request, Response } from "express";
import * as z from 'zod'
import { Prisma } from "../../generated/prisma/client";
import bcrypt from "bcryptjs"
import userService from "../services/user.service"
import tokenService from "../services/token.service";
import validationService from "../services/validation.service";
import jwt from "jsonwebtoken"
import mailService from "../services/mail.service";

const refreshTokenLifetime = Number(process.env.REFRESH_TOKEN_LIFETIME);


const register = async (req: Request, res: Response) => {
    try{
        const {email, name, password} = req.body;

        const validUser = await validationService.validateUser(email, name, password);

        const user = await userService.createUser(validUser.email, validUser.name, validUser.password);

        res.status(201).json({
            message: "registration successful",
            data: {
                name: validUser.name,
                email: validUser.email
            },
            // validUser

        })


    }catch(err){
        if(err instanceof z.ZodError){
            let messages = [];

            for(const issue of err.issues){
                messages.push(`${issue.message} -> ${issue.path}`);
            }

            res.status(400).json({
                messages,
                issues: err.issues
            })
        }else if(err instanceof Prisma.PrismaClientKnownRequestError as any){
            if((err as any).code === "P2002"){
                res.status(400).json({
                    message: "There is a unique constraint violation, a new user cannot be created with this email"
                })
            }else{
                res.status(400).json({
                    message: "invalid input"
                })
            }
        }else{
            res.status(500).json({message: `Something went wrong: ${(err as any).message}`});
        }


    }
}

const login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const user = await userService.getUserByEmail(email);
        if(!user) return res.status(404).json({
            message: "user not found"
        })

        const isValidPass = await bcrypt.compare(password, user.password_hash);
        if(!isValidPass) return res.status(401).json({
            message: "Invalid Credentials, wrong password"
        })

        res.clearCookie("uid");
        res.clearCookie("sid");
        res.clearCookie("refresh_token");

        const regenerateSession = (req: Request): Promise<void> => {
            return new Promise((resolve, reject) => {
                req.session.regenerate((err: any) => {
                    if(err) return reject(err);
                    resolve();
                });
            })
        }

        await regenerateSession(req);

        const sid = req.session.id;

        const accessToken = tokenService.createAccessToken(sid, user.id, user.email);
        const refreshToken = tokenService.createRefreshToken(sid, user.id, user.email);

        res.cookie("uid", user.id, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: '/',
            maxAge: refreshTokenLifetime
        })
        res.cookie("sid", sid, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: refreshTokenLifetime
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            signed: true,
            path: "/",
            maxAge: refreshTokenLifetime
        });

        // await redisService.setLoginDetails(sid, user.id, refreshToken);

        // // temp
        // const r_token = await redisService.getLoginDetails(sid, user.id);

        await tokenService.storeRefreshToken(user.id, refreshToken, sid);

        res.json({
            message: "login successful",
            accessToken,
        });

        return res.end();

    }catch(err){
        res.status(500).json({
            message: `Something went wrong: ${(err as any).message}`
        })
    }
}

const refresh = async (req: Request, res: Response) => {
    try{

        const userId = Number(req.cookies.uid);
        const sid = req.cookies.sid;
        const cookieToken = req.signedCookies.refresh_token;

        if(!userId || !sid) return res.status(401).json({
            message: "cookie not found",
        })

        const refreshToken = await tokenService.getRefreshToken(userId, sid);

        if(!refreshToken) return res.status(401).json({
            message: "refresh token does not exist!",
        })

        const isSame = await bcrypt.compare(cookieToken, refreshToken.hash_token);

        if(!isSame) return res.status(401).json({
            message: "invalid token",
        })

        const isValid = jwt.verify(cookieToken, process.env.JWT_SECRET as string);

        if(!isValid){
            await tokenService.deleteSingleRefreshToken(userId, sid);

            return res.status(401).json({
                message: "invalid token"
            })
        }

        const user = await userService.getUserById(userId);

        if(!user) return res.status(500).json({
            message: "Something went wrong",
        })

        await tokenService.deleteSingleRefreshToken(userId, sid);

        const newSid = req.session.id;
        const newAccessToken = tokenService.createAccessToken(newSid, user.id, user.email);
        const newRefreshToken = tokenService.createRefreshToken(newSid, user.id, user.email);

        res.cookie("uid", user.id, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: '/',
            maxAge: refreshTokenLifetime
        })
        res.cookie("sid", newSid, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: refreshTokenLifetime
        });
        res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            signed: true,
            path: "/",
            maxAge: refreshTokenLifetime
        });

        await tokenService.storeRefreshToken(user.id, newRefreshToken, newSid);

        res.json({
            message: "access token get successfully",
            accessToken: newAccessToken
        })

    }catch(err){
        res.status(500).json({
            message: "Something went wrong!",
        })
    }
}

const getMe = async (req: Request, res: Response) => {
    try{
        const id = Number(req.user?.uid);
        
        const user = await userService.getUserById(id);

        if(!user) return res.status(404).json({
            message: "user not found"
        });

        res.json({
            message: "user get successfully",
            user
        })

    }catch(err){
        res.status(500).json({
            message: (err as any).message
        })
    }
}

const updateMe = async (req: Request, res: Response) => {
    try{

        const id = Number(req.user?.uid);
        const data: {
            email?: string,
            name?: string,
            password?: string
        } = req.body;

        const user = await userService.getUserById(id);
        if(!user) return res.status(404).json({
            message: "user not found"
        })

        if(data.hasOwnProperty("name")) user.name = data.name as string;
        if(data.hasOwnProperty("email")) user.email = data.email as string;
        if(data.hasOwnProperty("password")){
            user.password_hash = data.password as string;
        }

        const validData = await validationService.validateUpdateInfo(data);
        if(!validData) return res.status(401).json({
            message: "Invalid data"
        })

        const newUser = await userService.updateUser(validData, id);


        res.json({
            message: "updated successfully",
            data: newUser
        })

    } catch(err) {
        if(err instanceof z.ZodError){
            let messages = [];

            for(const issue of err.issues){
                messages.push(`${issue.message} -> ${issue.path}`);
            }

            res.status(400).json({
                messages,
                issues: err.issues
            })
        } else {
            res.status(500).json({
                message: "Soemthing went wrong"
            })
        }
    }
}

const logout = async (req: Request, res: Response) => {
    try{

        const all_device = req.query.all_device;
        let isAllDevice: boolean;
        const id = Number(req.user?.uid);
        const sid = req.user?.sid;
        let message: string;

        if(all_device !== "true" && all_device !== "false"){
            return res.status(400).json({
                message: "bad request, query must be 'true' or 'false'"
            })
        } else {
            if(all_device === "true") isAllDevice = true;
            else isAllDevice = false;
        }

        if(isAllDevice){
            const refreshTokens = await tokenService.deleteAllRefreshToken(id);
            message = "deleted all refresh tokens successfully";
        } else {
            const refreshToken = await tokenService.deleteSingleRefreshToken(id, sid as string);
            message = "deleted refresh token successfully";
        }

        res.clearCookie("uid");
        res.clearCookie("sid");
        res.clearCookie("refresh_token");

        res.json({message})

        return res.end();

    } catch(err) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const forgetPass = async (req: Request, res: Response) => {
    try{
        const email = req.body.email;

        const user = await userService.getUserByEmail(email);
        if(!user){
            return res.status(200).json({
                message: "sent reset mail to your email, it will be expired in 10 minutes"
            })
        }

        const resetToken = tokenService.createResetToken(email);
        await tokenService.storeResetToken(resetToken, user.id);

        const sendMail = await mailService.sendResetLink(email, user.name, resetToken);

        return res.status(200).json({
            message: "sent reset mail to your email, it will be expired in 10 minutes"
        })

    } catch(err) {
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

const resetPass = async (req: Request, res: Response) => {
    res.json({
        message: "Welcome to password reset page"
    })
}


export default {
    register,
    login,
    refresh,
    getMe,
    updateMe,
    logout,
    forgetPass,
    resetPass,
};