import {redis} from "../server"
import bcrypt from "bcryptjs";


const setLoginDetails = async (sid: string, userId: number, refresh_token: string) => {
    await redis.connect();

    const hash_refresh_token = await bcrypt.hash(refresh_token, 10);
    const login_details = {
        hash_refresh_token
    };

    const key = `auth:refresh:${userId}:${sid}`;

    await redis.hSet(key, login_details);
    await redis.expire(key, 60 * 60 * 24 * 7);

    await redis.quit();
}

const getLoginDetails = async (sid: string, userId: number) => {
    await redis.connect();

    const refresh_token = await redis.hGetAll(`auth:refresh:${userId}:${sid}`);

    await redis.quit();

    return refresh_token;
}

export default {
    setLoginDetails,
    getLoginDetails,

}