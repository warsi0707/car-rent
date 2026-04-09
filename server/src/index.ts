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

const app = express()


app.use(express.json())
app.use(cookieParser())

const allowedOrigins = process.env.FRONTEND_URL?.split(",") || []
// console.log("Allowed Origins:", allowedOrigins)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("CORS not allowed"))
    }
  },
  credentials: true
}))

app.get("/", (req, res) => {
    res.send("Welcome to Car Rental API")
})

app.use("/api/uploader", UploaderRoutes)

app.use("/api/admin/auth", AuthRouter)
app.use("/api/admin/cars", CarRouter)
app.use("/api/admin/bookings", BookingRouter)
app.use("/api/addons", AddOnRouter)


const main =async()=>{
    app.listen(process.env.PORT)
    console.log(`App listing on port ${process.env.PORT}`)
    await ConnectDB()
}
main()
