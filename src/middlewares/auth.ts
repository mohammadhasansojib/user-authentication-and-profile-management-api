import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const accessAuth = (req: Request, res: Response, next: NextFunction) => {
    try{
        let token = req.headers.authorization?.split(" ")[1];

        let payload = jwt.verify(token as string, process.env.JWT_SECRET as string);

        
    }catch(err){

    }
}

export default accessAuth;