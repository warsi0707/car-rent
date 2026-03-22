import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import CarModel from '../models/car.model.js'

const parseNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const pickCarPayload = (source: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {}
  const fields = [
    'name',
    'brand',
    'model',
    'year',
    'category',
    'fuelType',
    'transmission',
    'seats',
    'doors',
    'color',
    'mileageKm',
    'pricePerDay',
    'currency',
    'location',
    'images',
    'features',
    'description',
    'status',
    'isActive',
    'addedBy',
  ]

  for (const field of fields) {
    if (source[field] !== undefined) {
      payload[field] = source[field]
    }
  }

  return payload
}

export const createCar = async (req: Request, res: Response) => {
  try {
    const payload = pickCarPayload(req.body || {})

    const required = [
      'name',
      'brand',
      'model',
      'year',
      'category',
      'fuelType',
      'transmission',
      'seats',
      'pricePerDay',
    ]

    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        return res.status(400).json({ message: `${field} is required` })
      }
    }

    const car = await CarModel.create(payload)

    return res.status(201).json({
        success: true,
      message: 'Car created successfully',
      car,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to create car', error: String(error) })
  }
}

export const listCars = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseNumber(req.query.limit, 20), 100)
    const offset = parseNumber(req.query.offset, 0)
    const cars = await CarModel.find().sort({ createdAt: -1 }).skip(offset).limit(limit)
    return res.status(200).json({
      cars,
      limit,
      offset,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch cars', error: String(error) })
  }
}

export const getCarById = async (req: Request, res: Response) => {
  try {
    const carId = req.params.id
    if (!carId) {
      return res.status(400).json({ message: 'Invalid car id' })
    }

    const car = await CarModel.findById(carId)
    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }

    return res.status(200).json({ car })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch car', error: String(error) })
  }
}

export const updateCar = async (req: Request, res: Response) => {
  try {
    const carId = req.params.id
    if (!carId) {
      return res.status(400).json({ message: 'Invalid car id' })
    }

    const payload = pickCarPayload(req.body || {})
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    const car = await CarModel.findByIdAndUpdate({_id:carId}, payload, {
      new: true,
      runValidators: true,
    })

    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }

    return res.status(200).json({
      message: 'Car updated successfully',
      car,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to update car', error: String(error) })
  }
}

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const carId = req.params.id
    if (!carId) {
      return res.status(400).json({ message: 'Invalid car id' })
    }

    const car = await CarModel.findByIdAndDelete({_id: carId})
    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }

    return res.status(200).json({
      message: 'Car deleted successfully',
      carId,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to delete car', error: String(error) })
  }
}
