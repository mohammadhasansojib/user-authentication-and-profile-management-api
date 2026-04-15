import jwt from "jsonwebtoken"

const getAccessToken = (sid: string, userId: number, email: string) => {
    const accessToken = jwt.sign(
        {
            sid,
            userId,
            email: email,
            type: "access"
        },
        process.env.JWT_SECRET as string,
        {expiresIn: 60 * 15}
    );

    return accessToken;
}

const getRefreshToken = (sid: string, userId: number, email: string) => {
    const refreshToken = jwt.sign(
        {
            sid,
            userId,
            email,
            type: "refresh"
        },
        process.env.JWT_SECRET as string,
        {expiresIn: 60 * 60 * 24 * 7}
    );

    return refreshToken;
}

const getResetToken = (email: string) => {
    const resetToken = jwt.sign(
        {
            email,
            type: "reset"
        },
        process.env.JWT_SECRET as string,
        {expiresIn: 60 * 60 * 24 * 7}
    );

    return resetToken;
}



export default {
    getAccessToken,
    getRefreshToken,
    getResetToken,

}