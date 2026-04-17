import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs"

const getUserByEmail = async (email: string) => {
    const user = await prisma.users.findUnique({
        where: {
            email
        }
    })

    return user;
}

const getUserById = async (id: number) => {
    const user = await prisma.users.findUnique({
        where: {
            id
        }
    })

    return user;
}

const createUser = async (email: string, name: string, password: string) => {
    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            email,
            name,
            password_hash
        }
    });

    return user;
}

export default {
    createUser,
    getUserByEmail,
    getUserById,
}