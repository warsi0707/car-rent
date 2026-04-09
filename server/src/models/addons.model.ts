import mongoose, { Schema } from "mongoose";


export interface IAddOn {
    name: string,
    price: number,  
    description?: string,
    status?: string
    }

const addOnsSchema:Schema<IAddOn> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active',
    },
}, { timestamps: true })

export const AddOnModel = mongoose.model('AddOn', addOnsSchema)

export type AddOn = mongoose.InferSchemaType<typeof addOnsSchema>

