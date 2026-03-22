import Link from 'next/link'
import React from 'react'

export default function Feature() {
  const cars = [
    { id: 1, name: 'Audi A6', price: '$72/day', image: '/car.jpeg' },
    { id: 2, name: 'BMW M4', price: '$89/day', image: '/car.jpeg' },
    { id: 3, name: 'Mercedes C-Class', price: '$78/day', image: '/car.jpeg' },
    { id: 4, name: 'Porsche 911', price: '$140/day', image: '/car.jpeg' },
    { id: 5, name: 'Tesla Model 3', price: '$64/day', image: '/car.jpeg' },
    { id: 6, name: 'Range Rover Evoque', price: '$96/day', image: '/car.jpeg' },
  ]

  return (
    <section className='w-full px-6 py-16  sm:py-20'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-xs uppercase tracking-[0.35em] '>
              Featured vehicles
            </p>
            <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              Drive the cars that make every mile feel special
            </h2>
            <p className='mt-3 max-w-2xl text-sm  sm:text-base'>
              Experience true driving with vehicles crafted for performance,
              comfort, and timeless design.
            </p>
          </div>
          <button className='inline-flex w-fit items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold transition text-black'>
            View all
          </button>
        </div>

        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className='group relative overflow-hidden rounded-3xl border border-white/40 bg-white/5 transition hover:-translate-y-1 hover:border-white'
            >
              <img
                src={car.image}
                alt={car.name}
                className='h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-5'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-white'>{car.name}</h3>
                  <span className='rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>
                    {car.price}
                  </span>
                </div>
                <p className='mt-2 text-xs text-white/70'>
                  Instant pickup • Free cancellation
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
