import mongoose, { Schema, model, type InferSchemaType } from 'mongoose'

const BookingSchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    userClerkId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
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
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    securityDeposit: {
      type: Number,
      min: 0,
      default: 0,
    },
    addOns: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          price: { type: Number, required: true, min: 0 },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['unpaid', 'paid', 'refunded', 'failed'],
      default: 'unpaid',
    },
    paymentProvider: {
      type: String,
      trim: true,
    },
    paymentId: {
      type: String,
      trim: true,
    },
    cashfreeOrderId: {
      type: String,
      trim: true,
      index: true,
    },
    pickup: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      addressLine: { type: String, trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    dropoff: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      addressLine: { type: String, trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)



export type Booking = InferSchemaType<typeof BookingSchema>

const BookingModel = (mongoose.models.Booking || model('Booking', BookingSchema)) as mongoose.Model<Booking>

export default BookingModel
