import type { Request, Response } from "express";
import * as z from 'zod'
import { Prisma } from "../../generated/prisma/client";
import bcrypt from "bcryptjs"
import userService from "../services/user.service"
import tokenService from "../services/token.service";
import validationService from "../services/validation.service";
import refreshService from "../services/refresh.service";


const register = async (req: Request, res: Response) => {
    try{
        const {email, name, password} = req.body;

        const validUser = await validationService.validateUser(email, name, password);

        const user = await userService.createUser(validUser.email, validUser.name, validUser.password);

        res.status(201).json({
            message: "registration successful",
            data: {
                name: user.name,
                email: user.email
            }
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

        const sid = req.session.id;
        const accessToken = tokenService.getAccessToken(sid, user.id, user.email);
        const refreshToken = tokenService.getRefreshToken(sid, user.id, user.email);

        res.cookie("sid", sid, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            signed: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        // await redisService.setLoginDetails(sid, user.id, refreshToken);

        // // temp
        // const r_token = await redisService.getLoginDetails(sid, user.id);

        await refreshService.addRefreshToken(user.id, refreshToken, sid);

        res.json({
            message: "login successful",
            accessToken,
        });

    }catch(err){
        res.status(500).json({
            message: `Something went wrong: ${(err as any).message}`
        })
    }
}

const refresh = async (req: Request, res: Response) => {
    try{



        res.json({
            sidFromCookie: req.cookies.sid,
            refreshTokenFromCookie: req.signedCookies.refresh_token
        })

    }catch(err){
        res.status(500).json({
            message: "Something went wrong!",
        })
    }
}

const getMe = async (req: Request, res: Response) => {

}

const updateMe = async (req: Request, res: Response) => {

}

const logout = async (req: Request, res: Response) => {

}

const forgetPass = async (req: Request, res: Response) => {

}

const resetPass = async (req: Request, res: Response) => {

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