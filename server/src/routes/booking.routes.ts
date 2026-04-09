import express from 'express'
import { AuthRequire } from '../middleware/AuthMiddleware.js'
import {
  createBooking,
  listBookings,
  getBookingsByUser,
} from '../controller/booking.controller.js'

const BookingRouter = express.Router()

BookingRouter.post('/create', createBooking)
BookingRouter.get('/', AuthRequire, listBookings)
BookingRouter.get('/user/:clerkId', getBookingsByUser)

export default BookingRouter
