import dotenv from 'dotenv'
dotenv.config()


import express from 'express'
import ConnectDB from './utils/ConnectDB.js'
import AuthRouter from './routes/auth.routes.js'
import cookieParser from "cookie-parser";
import CarRouter from './routes/car.routes.js'
import BookingRouter from './routes/booking.routes.js'
import multer from 'multer'
import UploaderRoutes from './routes/uploader.routes.js'
import cors from 'cors'
import AddOnRouter from './routes/addons.routes.js'
import PaymentRouter from './routes/payment.routes.js'
import UserRouter from './routes/user.routes.js'

const app = express()


app.use(express.json())
app.use(cookieParser())

const allowedOrigins = process.env.FRONTEND_URL?.split(",").map((url: string) => url.trim()) || []
console.log("Allowed Origins:", allowedOrigins)
app.use(cors({
  origin: (origin, callback) => {
    console.log("CORS Origin:", origin) // Log the incoming origin for debugging
    // Allow requests with no origin (like mobile apps, curl requests)
    // or if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.error("CORS blocked origin:", origin)
      callback(new Error("CORS not allowed"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400
}))

app.get("/", (req, res) => {
    res.send("Welcome to Car Rental API")
})

app.use("/api/uploader", UploaderRoutes)

app.use("/api/admin/auth", AuthRouter)
app.use("/api/admin/cars", CarRouter)
app.use("/api/admin/bookings", BookingRouter)
app.use("/api/addons", AddOnRouter)
app.use("/api/cars", CarRouter)
app.use("/api/payment", PaymentRouter)
app.use("/api/admin/users", UserRouter)


const main =async()=>{
    app.listen(process.env.PORT)
    console.log(`App listing on port ${process.env.PORT}`)
    await ConnectDB()
}
main()
