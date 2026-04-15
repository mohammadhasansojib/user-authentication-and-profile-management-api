import {add} from "date-fns"
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

const addRefreshToken = async (user_id: number, token: string) => {
    const expireAt = add(new Date(), {
        days: 7
    });
    const hash_token = await bcrypt.hash(token, 10);

    const refreshToken = await prisma.refresh_tokens.create({
        data: {
            user_id,
            token: hash_token,
            expires_at: expireAt,
        }
    });

    return refreshToken;
}


export default {
    addRefreshToken,
}


