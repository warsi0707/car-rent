import dotenv from 'dotenv'
dotenv.config()


import express from 'express'
import ConnectDB from './utils/ConnectDB.js'
import AuthRouter from './routes/auth.routes.js'
import cookieParser from "cookie-parser";
import CarRouter from './routes/car.routes.js'
import multer from 'multer'
import UploaderRoutes from './routes/uploader.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/uploader", UploaderRoutes)

app.use("/api/admin/auth", AuthRouter)
app.use("/api/admin/cars", CarRouter)


const main =async()=>{
    app.listen(process.env.PORT)
    console.log(`App listing on port ${process.env.PORT}`)
    await ConnectDB()
}
main()