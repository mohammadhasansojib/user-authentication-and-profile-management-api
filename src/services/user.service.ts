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

const updateUser = async (data: {
    email?: string,
    name?: string,
    password?: string
}, id: number) => {
    const userData: {
        email?: string,
        name?: string,
        password_hash?: string
    } = {};

    if(data.hasOwnProperty("email")) userData.email = data.email;
    if(data.hasOwnProperty("name")) userData.name = data.name;
    if(data.hasOwnProperty("password")) userData.password_hash = data.password;

    if (data.hasOwnProperty("password")) {
        userData.password_hash = await bcrypt.hash(userData.password_hash as string, 10);
    }

    const updateUser = await prisma.users.update({
        where: { id },
        data: userData
    });

    return updateUser;
}

export default {
    createUser,
    updateUser,
    getUserByEmail,
    getUserById,
}