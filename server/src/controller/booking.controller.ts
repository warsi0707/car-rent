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

    if (car.status !== 'active') {
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

    // await CarModel.findByIdAndUpdate(car._id, { status: 'active' })

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookings = await (BookingModel as any).find({ userClerkId: clerkId })
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

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, paymentStatus } = req.body

    if (!id) {
      return res.status(400).json({ success: false, message: 'Booking id is required' })
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
    const validPaymentStatuses = ['unpaid', 'paid', 'refunded', 'failed']

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' })
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid paymentStatus value' })
    }

    const updateData: Record<string, string> = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const booking = await (BookingModel as any).findByIdAndUpdate(id, updateData, { new: true })
      .populate('car', 'name brand model images slug pricePerDay currency category')

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    // if booking is cancelled or completed, make car available again
    if (status === 'cancelled' || status === 'completed') {
      await CarModel.findByIdAndUpdate(booking.car?._id ?? booking.car, { status: 'available' })
    }

    return res.status(200).json({ success: true, message: 'Booking updated', booking })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: String(error),
    })
  }
}

export const carAvailibility =async(req:Request, res:Response)=>{
  try{
    const {carSlug, startDate, endDate} = req.query
    console.log('Checking availability for:', { carSlug, startDate, endDate })

    if(!carSlug || !startDate || !endDate){
      return res.status(400).json({
        success: false,
        message: "carId, startDate and endDate are required"
      })
    }

    const start = new Date(startDate as string)
    const end = new Date(endDate as string)
    console.log(start, end)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid dates provided' })
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      })
    }

    const car = await CarModel.findOne({ slug: carSlug as string })
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' })
    }
    const overlappingBookings = await BookingModel.find({
      car: car._id,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
        { startDate: { $lte: end }, endDate: { $exists: false } },
        { startDate: { $exists: false }, endDate: { $gte: start } },
      ],
    })
    console.log('Overlapping bookings:', overlappingBookings)

    const isAvailable = overlappingBookings.length === 0

    return res.status(200).json({
      success: true,
      carSlug,
      isAvailable,
      overlappingBookingsCount: overlappingBookings.length,
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    })
  }
}

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ success: false, message: 'Booking id is required' })
    }
    const booking = await BookingModel.findByIdAndDelete(id)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    return res.status(200).json({ success: true, message: 'Booking deleted successfully' })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: String(error),
    })
  }
}