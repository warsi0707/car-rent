import React from 'react'

export default function Starter1() {
  return (
    <section className='relative w-full min-h-screen overflow-hidden bg-black text-white'>
        <img
            src="/car.jpeg"
            className='absolute inset-0 h-full w-full object-cover object-center'
            alt="Premium car parked in a city"
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20' />

        <div className='relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 py-20 text-center lg:flex-row lg:items-center lg:text-left'>
            <div className='w-full lg:w-[58%]'>
                <p className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-white/80'>
                    Drive in minutes
                </p>
                <h1 className='text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl'>
                    Rent your perfect car, anytime, anywhere
                </h1>
                <p className='mt-4 max-w-xl text-base text-white/80 sm:text-lg'>
                    Affordable, reliable, and hassle-free car rentals for daily
                    commutes, weekend escapes, and business travel.
                </p>
                <div className='mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start'>
                    <button className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90'>
                        Book now
                    </button>
                    <button className='rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10'>
                        Explore cars
                    </button>
                </div>
                <div className='mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80 lg:justify-start'>
                    <div className='flex items-center gap-3'>
                        <span className='text-2xl font-semibold text-white'>
                            4.9
                        </span>
                        <span className='leading-tight'>
                            Average rating
                            <br />
                            from 12k+ trips
                        </span>
                    </div>
                    <div className='h-8 w-px bg-white/20' />
                    <div className='leading-tight'>
                        <span className='text-white'>Free cancellation</span>
                        <br />
                        up to 24 hours
                    </div>
                </div>
            </div>

            <div className='relative w-full lg:w-[42%]'>
                {/* <div className='absolute -right-2 -top-6 hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-white/80 backdrop-blur-md sm:block'>
                    <p className='text-white'>Pickup in 3 min</p>
                    <p className='text-white/60'>City Center Hub</p>
                </div>
                <div className='absolute -left-2 bottom-6 hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-white/80 backdrop-blur-md sm:block'>
                    <p className='text-white'>1200+ cars</p>
                    <p className='text-white/60'>Across 34 cities</p>
                </div> */}
            </div>
        </div>
    </section>
  )
}
