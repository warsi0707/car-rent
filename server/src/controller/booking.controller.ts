import type { Request, Response } from 'express'
import BookingModel from '../models/booking.model.js'
import CarModel from '../models/car.model.js'

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      carSlug,
      userClerkId,
      userEmail,
      userName,
      startDate,
      endDate,
      pickup,
      dropoff,
      notes,
      addOns = [],
      securityDeposit = 5000,
    } = req.body || {}

    if (!carSlug || !userClerkId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'carSlug, userClerkId, startDate and endDate are required',
      })
    }

    const car = await CarModel.findOne({
      $or: [{ slug: carSlug }, { carId: carSlug }],
    })

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' })
    }

    if (car.status !== 'available') {
      return res.status(409).json({
        success: false,
        message: 'Car is not available for booking',
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid dates provided' })
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      })
    }

    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )

    const pricePerDay = car.pricePerDay
    const addOnsTotal = (addOns as { name: string; price: number }[]).reduce(
      (sum, a) => sum + a.price,
      0
    )
    const totalAmount = pricePerDay * totalDays + addOnsTotal

    const booking = await BookingModel.create({
      car: car._id,
      userClerkId,
      userEmail,
      userName,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay,
      currency: car.currency || 'INR',
      totalAmount,
      securityDeposit: securityDeposit || 0,
      addOns,
      pickup: pickup || car.location,
      dropoff: dropoff || car.location,
      notes,
      status: 'pending',
      paymentStatus: 'unpaid',
    })

    await CarModel.findByIdAndUpdate(car._id, { status: 'booked' })

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: String(error),
    })
  }
}

export const listBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.find()
      .populate('car', 'name brand model images slug pricePerDay currency category')
      .sort({ createdAt: -1 })
    return res.status(200).json({ success: true, bookings })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: String(error),
    })
  }
}

export const getBookingsByUser = async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.params
    if (!clerkId) {
      return res.status(400).json({ success: false, message: 'clerkId is required' })
    }
    const bookings = await BookingModel.find({ userClerkId: clerkId })
      .populate('car', 'name brand model images slug pricePerDay currency category')
      .sort({ createdAt: -1 })
    return res.status(200).json({ success: true, bookings })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: String(error),
    })
  }
}
