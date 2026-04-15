import { prisma } from "../../lib/prisma";
import userService from "../services/user.service"
import jwt from "jsonwebtoken"
import type {Request, Response} from "express";

const login = (email: string, password: string, req: Request, res: Response) => {


}


export default {
    login,

}