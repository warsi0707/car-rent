import Link from 'next/link'
import React from 'react'

export default function page() {
  const car = {
    name: 'Audi A6',
    brand: 'Audi',
    model: 'A6 Premium',
    year: 2024,
    category: 'sedan',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    doors: 4,
    color: 'Metallic Gray',
    mileageKm: 18,
    pricePerDay: 7200,
    currency: 'INR',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      addressLine: 'Bandra Kurla Complex, Gate 4',
      lat: 19.0601,
      lng: 72.8562,
    },
    images: ['/car.jpeg', '/car.png', '/car.jpeg'],
    features: [
      'Panoramic sunroof',
      'Wireless Apple CarPlay',
      '360° camera',
      'Premium sound system',
      'Adaptive cruise control',
      'Heated seats',
    ],
    description:
      'A refined executive sedan with premium interiors, smooth handling, and a quiet cabin. Perfect for business trips or weekend drives.',
    status: 'available',
    isActive: true,
  }

  return (
    <main className='w-full bg-white text-slate-900'>
      <section className='relative overflow-hidden bg-slate-950 px-6 pb-10 pt-28 text-white'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black' />
        </div>
        <div className='mx-auto max-w-6xl'>
          <Link
            href="/vehicles"
            className='relative text-sm font-semibold text-white/70 transition hover:text-white'
          >
            ← Back to vehicles
          </Link>
          <div className='relative mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
                Vehicle details
              </p>
              <h1 className='mt-3 text-3xl font-semibold sm:text-4xl'>
                {car.brand} {car.model}
              </h1>
              <p className='mt-3 max-w-2xl text-sm text-white/70 sm:text-base'>
                {car.description}
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <span className='rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80'>
                {car.status}
              </span>
              <span className='rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80'>
                {car.category}
              </span>
              <span className='rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80'>
                {car.year}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 py-12'>
        <div className='mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.5fr_1fr]'>
          <div className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-[2fr_1fr]'>
              <div className='relative overflow-hidden rounded-3xl border border-slate-200'>
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className='h-full w-full object-cover'
                />
                <div className='absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-900'>
                  {car.currency} {car.pricePerDay.toLocaleString()} / day
                </div>
              </div>
              <div className='grid gap-4'>
                {car.images.slice(1).map((img, index) => (
                  <div
                    key={img + index}
                    className='overflow-hidden rounded-3xl border border-slate-200'
                  >
                    <img
                      src={img}
                      alt={`${car.name} view ${index + 2}`}
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
              <h2 className='text-xl font-semibold'>Key specs</h2>
              <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                    Powertrain
                  </p>
                  <p className='mt-2 text-sm text-slate-700'>
                    {car.fuelType} • {car.transmission}
                  </p>
                </div>
                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                    Seating
                  </p>
                  <p className='mt-2 text-sm text-slate-700'>
                    {car.seats} seats • {car.doors} doors
                  </p>
                </div>
                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                    Mileage
                  </p>
                  <p className='mt-2 text-sm text-slate-700'>
                    {car.mileageKm} km/l (avg.)
                  </p>
                </div>
                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                    Color
                  </p>
                  <p className='mt-2 text-sm text-slate-700'>{car.color}</p>
                </div>
              </div>
            </div>

            <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
              <h2 className='text-xl font-semibold'>Features</h2>
              <div className='mt-5 flex flex-wrap gap-3 text-sm text-slate-700'>
                {car.features.map((feature) => (
                  <span
                    key={feature}
                    className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2'
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className='space-y-6'>
            <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70'>
              <h2 className='text-xl font-semibold'>Book this car</h2>
              <p className='mt-2 text-sm text-slate-600'>
                Lock in this vehicle instantly. Free cancellation up to 24
                hours before pickup.
              </p>
              <div className='mt-6 space-y-3 text-sm text-slate-600'>
                <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3'>
                  <span>Daily price</span>
                  <span className='font-semibold text-slate-900'>
                    {car.currency} {car.pricePerDay.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3'>
                  <span>Deposit</span>
                  <span className='font-semibold text-slate-900'>
                    {car.currency} 5,000
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3'>
                  <span>Availability</span>
                  <span className='font-semibold text-emerald-600'>
                    Available today
                  </span>
                </div>
              </div>
              <button className='mt-6 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/80 transition hover:-translate-y-0.5 hover:bg-slate-800'>
                Book this car
              </button>
              <button className='mt-3 w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50'>
                Message owner
              </button>
            </div>

            <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
              <h2 className='text-xl font-semibold'>Pickup location</h2>
              <p className='mt-2 text-sm text-slate-600'>
                {car.location.addressLine}, {car.location.city},{' '}
                {car.location.state}
              </p>
              <div className='mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600'>
                <p className='font-semibold text-slate-900'>
                  {car.location.city}, {car.location.country}
                </p>
                <p className='mt-1'>
                  Coordinates: {car.location.lat}, {car.location.lng}
                </p>
              </div>
              <button className='mt-5 w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50'>
                Get directions
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
