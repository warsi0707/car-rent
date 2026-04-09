"use client"

import { deleteCar } from '@/server/car'
import { Eye, Pencil, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'


type Car = {
  _id: string
  carId:string,
  slug: string,
  name: string
  brand: string
  model: string
  year: number
  pricePerDay: number
  transmission: 'Automatic' | 'Manual'
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'
  seats: number
  status: 'Available' | 'Booked' | 'Maintenance'
  location: {
    city: string
  }
}


type CarHomeProps = {
  cars?: Car[]
}

export default function CarHome({ cars = [] }: CarHomeProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)


  const filteredCars = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return cars

    const safeCars = Array.isArray(cars) ? cars : []  

    return safeCars.filter((car: Car) => {
      const haystack = [
        car._id,
        car.carId,
        car.name,
        car.brand,
        car.model,
        car.year.toString(),
        car.pricePerDay.toString(),
        car.transmission,
        car.fuel,
        car.seats.toString(),
        car.status,
        car.location
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(term)
    })
  }, [query,])

  const handleDelete = async () => {
    if (!selectedCar) return
    setDeleteLoading(true)
    const res = await deleteCar(selectedCar._id)
    setDeleteLoading(false)
    if (res && res.success) {
      toast.success(res.message || "Car deleted successfully")
      setIsDeleting(false)
      setSelectedCar(null)
      router.refresh()
    } else {
      toast.error(res.message || "Failed to delete car")
    }
  }

  return (
    <>
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Cars</h1>
          <p className="text-sm text-slate-600">
            Manage the fleet, check availability, and take quick actions on any car.
          </p>
        </div>
        <button
        onClick={()=> router.push("/cars/create")}
          type="button"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 cursor-pointer"
        >
          + Create Car
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full max-w-md items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Filter</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, brand, status, location, price..."
            className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <p className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">{filteredCars.length}</span>{' '}
          {filteredCars.length === 1 ? 'car' : 'cars'}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price/Day</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCars?.map((car:Car) => (
              <tr key={car._id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-medium text-slate-900">{car.name}</div>
                  <div className="text-xs text-slate-500">ID: {car?.carId}</div>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <div>
                    {car.brand} {car.model} • {car.year}
                  </div>
                  <div className="text-xs text-slate-500">
                    {car.transmission} • {car.fuel} • {car.seats} seats
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      car.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700'
                        : car.status === 'Booked'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {car.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600">{car.location?.city}</td>
                <td className="px-4 py-4 font-medium text-slate-900">₹{car.pricePerDay}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                    onClick={()=> router.push(`/cars/${car.slug}`)}
                      type="button"
                      className="rounded-md text-green-400 border-slate-200  text-xs font-medium cursor-pointer transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Eye/>
                    </button>
                    <button
                      type="button"
                      className="rounded-md text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Pencil className='h-5 w-5'/>
                    </button>
                    <button
                    onClick={()=> {setIsDeleting(true); setSelectedCar(car);}}
                      type="button"
                      className="rounded-md  text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCars.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No cars match that filter. Try adjusting your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    {isDeleting && (
      <div
        onClick={() => !deleteLoading && setIsDeleting(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
        >
          {/* Red header strip */}
          <div className="bg-rose-50 px-6 pt-6 pb-4 flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-rose-100">
              <Trash className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Delete Car</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                <span className="font-medium text-slate-700">{selectedCar?.brand} {selectedCar?.model} — {selectedCar?.name}</span>
              </p>
            </div>
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-slate-600">
              This will permanently remove the car and all associated data. This action <span className="font-medium text-slate-900">cannot be undone</span>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-5">
            <button
              onClick={() => setIsDeleting(false)}
              disabled={deleteLoading}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 transition disabled:opacity-70"
            >
              {deleteLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Deleting…
                </>
              ) : (
                <>Delete Car</>
              )}
            </button>
          </div>
        </div>
      </div>
    )}  
    </>
  )
}
