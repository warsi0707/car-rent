"use client"
import CarCrad from "@/components/CarCrad"
import { getCars } from "@/server/car"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
const LIMIT = 6;
export interface ICar {
    _id: string,
    carId: string,
    slug: string,
    name: string,
    brand: string,
    model: string,
    year: number,
    category: string,
    color?: string,
    fuelType: string,
    transmission: string,
    seats: number,
    doors?: number,
    mileageKm?: number,
    pricePerDay: number,
    currency?: string,
    images?: string[],
    features?: string[],
    description?: string,
    status?: string,
    location?: {
        city: string,
        state: string,
        country: string,
        addressLine: string,
        lat: number,
        lng: number,
    },
    addedBy?: string,
}

export default function Vehicles() {
    const [currentPage, setCurrentPage] = useState(1)
    const [cars, setCars] = useState<ICar[]>([])
    console.log(cars)
    const [hasMore, setHasMore] = useState(true)
    console.log(hasMore)
    const [isLoading, setIsLoading] = useState(false)

    const handleGetCars = useCallback(async () => {
        setIsLoading(true)
        try {
            const offset = (currentPage - 1) * LIMIT
            const res = await getCars(LIMIT, offset)
            setCars(res || [])
            setHasMore((res?.length || 0) === LIMIT)
        } catch (error) {
            console.log("Error while loading cars:", error)
            setCars([])
        } finally {
            setIsLoading(false)
        }
    }, [currentPage])
  
  const handleNext = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1)
    }
  }
  
  const handleBack = () => {
    if (currentPage === 1) return
    setCurrentPage((prev) => prev - 1)
  }
  
  useEffect(() => {
        handleGetCars()
    }, [handleGetCars])

  return (
    <main className='w-full bg-white text-slate-900'>
      <section className='relative overflow-hidden bg-slate-950 px-6 pb-16 pt-28 text-white sm:pt-32'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black' />
        </div>
        <div className='relative mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
              Vehicles
            </p>
            <h1 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              Choose a ride that matches your trip
            </h1>
            <p className='mt-3 max-w-2xl text-sm text-white/70 sm:text-base'>
              Browse our curated lineup of premium cars, from comfortable
              sedans to adventure-ready SUVs. All rentals include insurance and
              free cancellation.
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            {/* <button className='rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90'>
              View deals
            </button> */}
            {/* <button className='rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10'>
              Filter cars
            </button> */}
          </div>
        </div>
      </section>

      <section className='px-6 py-12'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-10 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-200/70 backdrop-blur'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
              <div>
                <p className='text-xs uppercase tracking-[0.35em] text-slate-500'>
                  Filters
                </p>
                <h2 className='mt-2 text-xl font-semibold text-slate-900'>
                  Find the right car in seconds
                </h2>
              </div>
              <button className='inline-flex w-fit items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50'>
                Clear filters
              </button>
            </div>

            <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <label className='flex flex-col gap-2 text-sm text-slate-600'>
                Location
                <select className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400'>
                  <option>San Francisco</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                </select>
              </label>
              <label className='flex flex-col gap-2 text-sm text-slate-600'>
                Car type
                <select className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400'>
                  <option>All types</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Sports</option>
                  <option>EV</option>
                </select>
              </label>
              <label className='flex flex-col gap-2 text-sm text-slate-600'>
                Price range
                <select className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400'>
                  <option>$40 - $80</option>
                  <option>$80 - $120</option>
                  <option>$120 - $180</option>
                  <option>$180+</option>
                </select>
              </label>
              <label className='flex flex-col gap-2 text-sm text-slate-600'>
                Seats
                <select className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400'>
                  <option>2 seats</option>
                  <option>4 seats</option>
                  <option>5 seats</option>
                  <option>7 seats</option>
                </select>
              </label>
            </div>

            <div className='mt-4 flex flex-wrap gap-3 text-xs text-slate-600'>
              <span className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2'>
                Free cancellation
              </span>
              <span className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2'>
                Instant pickup
              </span>
              <span className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2'>
                Automatic transmission
              </span>
              <span className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2'>
                Unlimited miles
              </span>
            </div>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {isLoading ? (
              <div className='col-span-full text-center py-12'>
                <p className='text-slate-600'>Loading cars...</p>
              </div>
            ) : cars.length > 0 ? (
              cars.map((car) => (
                <CarCrad key={car._id} car={car} />
              ))
            ) : (
              <div className='col-span-full text-center py-12'>
                <p className='text-slate-600'>No cars available</p>
              </div>
            )}
          </div>

          <div className="w-full flex items-center justify-center p-10 gap-5">
            <button 
              onClick={handleBack} 
              disabled={currentPage === 1}
              className="border p-2 rounded-md text-sm flex gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5"/> 
              <span>Back</span>
            </button>
            <p className="min-w-8 text-center">{currentPage}</p>
            <button 
              onClick={handleNext} 
              disabled={!hasMore}
              className="border p-2 rounded-md text-sm flex gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <span>Next</span>
              <ArrowRight className="h-5 w-5"/>
            </button>
          </div>

          <div className='mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-8 text-center sm:flex-row sm:text-left'>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-slate-500'>
                Membership
              </p>
              <h2 className='mt-3 text-2xl font-semibold'>
                Unlock exclusive pricing and priority pickup
              </h2>
              <p className='mt-2 text-sm text-slate-600'>
                Save up to 25% with weekly rentals and get free upgrades at
                select locations.
              </p>
            </div>
            <button className='rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition hover:-translate-y-0.5 hover:bg-slate-800'>
              Join membership
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
