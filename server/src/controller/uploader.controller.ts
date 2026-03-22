import type { Request,Response } from "express";

export const imageUpload = async(req:Request, res:Response)=>{
    try{
        console.log(req.files)
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded",
                success: false
            })
        }

    }catch(error){
        return res.status(500).json({
            error: "Internal server error",
            success: false
        })
    }
}