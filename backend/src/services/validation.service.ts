import * as z from 'zod'

const validateUser = async (email: string, name: string, password: string) => {
    const trimMail = email.trim();

    const userSchema = z.object({
        email: z.email(),
        name: z.string().trim().min(3).max(20),
        password: z.string().min(8)
    });

    const user = await userSchema.parseAsync({
        email: trimMail,
        name,
        password
    })

    return user;
}

const validateUpdateInfo = async (data: {
    email?: string,
    name?: string,
    password?: string
}) => {

    const userSchema = z.object({
        email: z.optional(z.email()),
        name: z.optional(z.string().trim().min(3).max(20)),
        password: z.optional(z.string().min(8)),
    });
    const user = await userSchema.parseAsync(data);

    return user;
}


export default {
    validateUser,
    validateUpdateInfo,
}