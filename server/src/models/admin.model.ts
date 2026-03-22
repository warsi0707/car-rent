import mongoose, { Schema, model } from 'mongoose'
import type { IAdmin } from '../types/types.js'

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
      default: 'SUPER_ADMIN',
    },
  },
  {
    timestamps: true,
  }
)



const AdminModel = mongoose.model('Admin', AdminSchema)

export default AdminModel
