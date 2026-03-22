import React from 'react'

export default function page() {
  const vehicles = [
    {
      id: 1,
      name: 'Audi A6',
      price: '$72/day',
      type: 'Sedan',
      seats: '5 seats',
      image: '/car.jpeg',
    },
    {
      id: 2,
      name: 'BMW M4',
      price: '$89/day',
      type: 'Coupe',
      seats: '4 seats',
      image: '/car.jpeg',
    },
    {
      id: 3,
      name: 'Mercedes C-Class',
      price: '$78/day',
      type: 'Sedan',
      seats: '5 seats',
      image: '/car.jpeg',
    },
    {
      id: 4,
      name: 'Range Rover Evoque',
      price: '$96/day',
      type: 'SUV',
      seats: '5 seats',
      image: '/car.jpeg',
    },
    {
      id: 5,
      name: 'Tesla Model 3',
      price: '$64/day',
      type: 'EV',
      seats: '5 seats',
      image: '/car.jpeg',
    },
    {
      id: 6,
      name: 'Porsche 911',
      price: '$140/day',
      type: 'Sports',
      seats: '2 seats',
      image: '/car.jpeg',
    },
    {
      id: 7,
      name: 'Toyota Camry',
      price: '$48/day',
      type: 'Sedan',
      seats: '5 seats',
      image: '/car.jpeg',
    },
    {
      id: 8,
      name: 'Jeep Wrangler',
      price: '$84/day',
      type: 'SUV',
      seats: '5 seats',
      image: '/car.jpeg',
    },
  ]

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
            <button className='rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90'>
              View deals
            </button>
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
            {vehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className='group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-200/70'
              >
                <div className='relative'>
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className='h-52 w-full object-cover sm:h-56'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent' />
                  <div className='absolute bottom-4 left-4 flex items-center gap-2'>
                    <span className='rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900'>
                      {vehicle.type}
                    </span>
                    <span className='rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white'>
                      {vehicle.price}
                    </span>
                  </div>
                </div>
                <div className='p-5'>
                  <h3 className='text-lg font-semibold'>{vehicle.name}</h3>
                  <p className='mt-2 text-sm text-slate-600'>
                    {vehicle.seats} • Automatic • Premium interior
                  </p>
                  <div className='mt-5 flex items-center justify-between text-sm'>
                    <span className='text-slate-500'>Instant pickup</span>
                    <button className='text-sm font-semibold text-slate-900 transition group-hover:text-slate-700'>
                      View details →
                    </button>
                  </div>
                </div>
              </article>
            ))}
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
