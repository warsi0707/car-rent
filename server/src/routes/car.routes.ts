import express from 'express'
import { AuthRequire } from '../middleware/AuthMiddleware.js'
import { createCar, deleteCar, getCarById, listCars, updateCar } from '../controller/car.controller.js'
import { carAvailibility } from '../controller/booking.controller.js'

const CarRouter = express.Router()

CarRouter.post("/create", AuthRequire, createCar)
CarRouter.get("/", AuthRequire,listCars)

CarRouter.get("/public", listCars)
CarRouter.get("/public/:slugOrId", getCarById)
CarRouter.get("/available", carAvailibility)

CarRouter.get("/:slugOrId", AuthRequire, getCarById)
CarRouter.patch("/update/:slugOrId", AuthRequire, updateCar)
CarRouter.delete("/:slugOrId", AuthRequire, deleteCar)



export default CarRouter