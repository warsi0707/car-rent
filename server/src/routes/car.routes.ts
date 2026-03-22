import express from 'express'
import { AuthRequire } from '../middleware/AuthMiddleware.js'
import { createCar, deleteCar, getCarById, listCars, updateCar } from '../controller/car.controller.js'

const CarRouter = express.Router()

CarRouter.post("/create", AuthRequire, createCar)
CarRouter.get("/", AuthRequire,listCars)
CarRouter.get("/:id", AuthRequire, getCarById)
CarRouter.patch("/update/:id", AuthRequire, updateCar)
CarRouter.delete("/:id", AuthRequire, deleteCar)



export default CarRouter