import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

interface userType {
    uid: number,
    sid?: string,
    type: "access" | "refresh" | "reset"
}

declare global {
    namespace Express {
        interface Request {
            user?: userType
        }
    }
}


// const accessAuth = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             const err = new Error("Authorization header missing or malformed");
//             (err as any).status = 401;
//             return next(err);
//         }

//         const token = authHeader.split(" ")[1];

//         if (!token) {
//             const err = new Error("Token not found");
//             (err as any).status = 401;
//             return next(err);
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

//         if (typeof decoded !== "object" || !decoded || !("uid" in decoded) || !("sid" in decoded)) {
//             const err = new Error("Invalid token payload");
//             (err as any).status = 401;
//             return next(err);
//         }

//         req.user = decoded as userType;

//         const refreshToken = await prisma.refresh_tokens.findUnique({
//             where: {
//                 sid: req.user.sid,
//                 user_id: req.user.uid,
//             }
//         });

//         if (!refreshToken) {
//             const err = new Error("Session invalid or expired");
//             (err as any).status = 401;
//             return next(err);
//         }

//         next();
//     } catch (err) {
//         const error = new Error((err as Error).message || "Authentication failed");
//         (error as any).status = 401;
//         next(error);
//     }
// };


const accessAuth = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            let err = new Error("Token not found");
            (err as any).status = 401;
            throw err;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        await prisma.refresh_tokens.deleteMany({
            where: {
                user_id: (decoded as userType).uid,
                expires_at: {
                    lte: new Date()
                }
            }
        })

        const refreshToken = await prisma.refresh_tokens.findUnique({
            where: {
                sid: (decoded as userType).sid,
                user_id: (decoded as userType).uid
            }
        });

        if(!refreshToken){
            let err = new Error("Refresh token does not exist");
            (err as any).status = 401;
            throw err;
        }

        req.user = decoded as userType;

        next();

    } catch(err) {
        let error = new Error(`${(err as any).message}`);
        (error as any).status = 401;
        next(error);
    }
}



export default accessAuth;