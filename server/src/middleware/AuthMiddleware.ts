import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import AdminModel from "../models/admin.model.js";

interface AuthRequest extends Request {
  admin?: string;
}

export const AuthRequire =async(req:Request, res:Response, next:NextFunction)=>{
    const token = req.cookies.admin_token
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    const jwtSecret =  process.env.ADMIN_JWT_SECRET
    if(!jwtSecret){
        return res.status(500).json({message:"JWT secret is missing"})
    }
    try{
        const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload | string
        if (typeof decoded === "string" || !decoded?.id) {
            return res.status(401).json({ message: "Invalid token" })
        }
        const admin = await AdminModel.findById({_id: decoded.id}) as {id: string}
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.admin = admin.id
        next()
    }catch{
        return res.status(401).json({ message: "Invalid token" })
    }

}
