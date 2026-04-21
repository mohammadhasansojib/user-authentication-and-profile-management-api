import jwt from "jsonwebtoken"
import {add} from "date-fns"
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

const accessTokenLifetime = Number(process.env.ACCESS_TOKEN_LIFETIME);
const refreshTokenLifetime = Number(process.env.REFRESH_TOKEN_LIFETIME);

// Access Token
const createAccessToken = (sid: string, userId: number, email: string) => {
    const accessToken = jwt.sign(
        {
            uid: userId,
            sid,
            email,
            type: "access"
        },
        process.env.JWT_SECRET as string,
        {expiresIn: accessTokenLifetime}
    );

    return accessToken;
}


// Refresh Token
const createRefreshToken = (sid: string, userId: number, email: string) => {
    const refreshToken = jwt.sign(
        {
            sid,
            userId,
            email,
            type: "refresh"
        },
        process.env.JWT_SECRET as string,
        {expiresIn: refreshTokenLifetime}
    );

    return refreshToken;
}
const storeRefreshToken = async (user_id: number, token: string, sid: string) => {
    const expireAt = add(new Date(), {
        days: 7
    });
    const hash_token = await bcrypt.hash(token, 10);

    const refreshToken = await prisma.refresh_tokens.create({
        data: {
            user_id,
            hash_token,
            sid,
            expires_at: expireAt,
        }
    });

    return refreshToken;
}
const getRefreshToken = async (user_id: number, sid: string) => {
    const refreshToken = await prisma.refresh_tokens.findUnique({
        where: {
            user_id,
            sid
        }
    });

    return refreshToken;
}
const deleteRefreshToken = async (user_id: number, sid: string) => {
    const refreshToken = await prisma.refresh_tokens.delete({
        where: {
            user_id,
            sid
        }
    })

    return refreshToken;
}


// Reset Token
const createResetToken = (email: string) => {
    const resetToken = jwt.sign(
        {
            email,
            type: "reset"
        },
        process.env.JWT_SECRET as string,
        {expiresIn: 60 * 10}
    );

    return resetToken;
}



export default {
    createAccessToken,

    createRefreshToken,
    storeRefreshToken,
    getRefreshToken,
    deleteRefreshToken,

    createResetToken,
}