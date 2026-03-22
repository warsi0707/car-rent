import mongoose, { Schema, model, type InferSchemaType } from 'mongoose'

const currentYear = new Date().getFullYear() + 1

const CarSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1980,
      max: currentYear,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'hatchback',
        'sedan',
        'suv',
        'muv',
        'coupe',
        'convertible',
        'van',
        'pickup',
        'luxury',
        'sports',
        'electric',
      ],
    },
    fuelType: {
      type: String,
      required: true,
      trim: true,
      enum: ['petrol', 'diesel', 'cng', 'lpg', 'electric', 'hybrid'],
    },
    transmission: {
      type: String,
      required: true,
      trim: true,
      enum: ['manual', 'automatic'],
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    doors: {
      type: Number,
      default: 4,
      min: 2,
    },
    color: {
      type: String,
      trim: true,
    },
    mileageKm: {
      type: Number,
      min: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      addressLine: { type: String, trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    images: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'booked', 'maintenance', 'inactive'],
      default: 'available',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
)


const CarModel = mongoose.model('Car', CarSchema)

export default CarModel
