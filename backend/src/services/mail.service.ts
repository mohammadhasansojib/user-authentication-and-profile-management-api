import nodemailer from "nodemailer"
import resetLinkMailTemplate from "../utils/resetLinkMailTemplate";


const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USERNAME;
const pass = process.env.SMTP_PASSWORD;

const resetUrl = process.env.RESET_URL;

const sendResetLink = async (
    to: string,
    user_name: string,
    token: string) => {
        const reset_link = `${resetUrl}?token=${token}`;
        const html = resetLinkMailTemplate(user_name, reset_link);

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
            subject: "Password Reset Mail",
            text: "Password Reset Mail",
            html,
        });

        return {
            message: info.response,
            id: info.messageId
        }
}


export default {
    sendResetLink,
}