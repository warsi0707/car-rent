import type { Request, Response } from "express";
import { AddOnModel } from "../models/addons.model.js";

export const createAddOn = async (req:Request, res:Response) => {
    try{
        const {name, price, description} = req.body;
        if(!name || price === undefined){
            return res.status(400).json({
                success: false,
                error: "Name and price are required"
            })
        }
        const newAddons = await AddOnModel.create({
            name,
            price,
            description
        })
        return res.json({
            success: true,
            message: "Addon created successfully",
            addon: newAddons
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            error: "Failed to create add-on",
        })
    }
}

export const getAddons = async(req:Request, res:Response) => {
    try{
        const addons = await AddOnModel.find().sort({createdAt: -1})
        return res.json({
            success: true,
            addons
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            error: "Failed to fetch add-ons",
        })
    }
}

export const deleteAddOn = async(req:Request, res:Response) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                error: "Addon ID is required"
            })
        }
        await AddOnModel.findByIdAndDelete(id)
        return res.json({
            success: true,
            message: "Addon deleted successfully",
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            error: "Failed to delete add-on",
        })
    }
}

export const updateAddOn = async(req:Request, res:Response) => {
    try{
        const {id} = req.params;
        const {name, price, description} = req.body;
        if(!id){
            return res.status(400).json({
                success: false,
                error: "Addon ID is required"
            })
        }
        const addon = await AddOnModel.findById(id)
        if(!addon){
            return res.status(404).json({
                success: false,
                error: "Addon not found"
            })
        }
        addon.name = name || addon.name;
        addon.price = price !== undefined ? price : addon.price;
        addon.description = description || addon.description;
        await addon.save();
        return res.json({
            success: true,
            message: "Addon updated successfully",
            addon
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            error: "Failed to update add-on",
        })
    }
}

export const getAddOnById = async(req:Request, res:Response) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                error: "Addon ID is required"
            })
        }
        const addon = await AddOnModel.findById(id)
        if(!addon){
            return res.status(404).json({
                success: false,
                error: "Addon not found"
            })
        }
        return res.json({
            success: true,
            addon
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            error: "Failed to fetch add-on",
        })
    }
}