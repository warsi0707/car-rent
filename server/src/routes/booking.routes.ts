import express from 'express'
import { AuthRequire } from '../middleware/AuthMiddleware.js'
import {
  createBooking,
  listBookings,
  getBookingsByUser,
  updateBookingStatus,
  deleteBooking,
} from '../controller/booking.controller.js'

const BookingRouter = express.Router()

BookingRouter.post('/create', createBooking)
BookingRouter.get('/', AuthRequire, listBookings)
BookingRouter.get('/user/:clerkId', getBookingsByUser)
BookingRouter.patch('/update/:id', AuthRequire, updateBookingStatus)
BookingRouter.delete('/:id', AuthRequire, deleteBooking)

export default BookingRouter
