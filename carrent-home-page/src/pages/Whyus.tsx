import React from 'react'

export default function Whyus() {
  const perks = [
    {
      id: 1,
      title: 'Transparent pricing',
      desc: 'No hidden charges. What you see is what you pay, always.',
    },
    {
      id: 2,
      title: 'Flexible bookings',
      desc: 'Pick up or return in minutes with easy rescheduling.',
    },
    {
      id: 3,
      title: 'Trusted protection',
      desc: 'Insurance, roadside help, and 24/7 support included.',
    },
  ]

  return (
    <section className='w-full px-6 py-16 text-slate-900 sm:py-20'>
        <div className='mx-auto max-w-6xl'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                    <p className='text-xs uppercase tracking-[0.35em] text-slate-500'>
                        Why choose us
                    </p>
                    <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
                        A rental experience built on trust and comfort
                    </h2>
                    <p className='mt-3 max-w-2xl text-sm text-slate-600 sm:text-base'>
                        Experience a seamless car-rental process with clarity,
                        flexibility, and premium support from start to finish.
                    </p>
                </div>
                <button className='inline-flex w-fit items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-100'>
                    Learn more
                </button>
            </div>

            <div className='mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]'>
                <div className='relative overflow-hidden rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/60'>
                    <img
                        src="/car.jpeg"
                        alt="Luxury car interior"
                        className='h-full w-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
                    <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8'>
                        <p className='text-xs uppercase tracking-[0.35em] text-white/80'>
                            Premium comfort
                        </p>
                        <h3 className='mt-3 text-2xl text-white font-semibold'>
                            Curated cars with five-star maintenance
                        </h3>
                        <p className='mt-3 max-w-md text-sm text-white/85'>
                            Every vehicle is inspected, sanitized, and ready for
                            the road, so you can book with confidence.
                        </p>
                        <div className='mt-5 flex flex-wrap gap-3'>
                            <span className='rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/95 backdrop-blur'>
                                Verified partners
                            </span>
                            <span className='rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/95 backdrop-blur'>
                                24/7 support
                            </span>
                        </div>
                    </div>
                </div>

                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-1'>
                    {perks.map((perk) => (
                        <div
                            key={perk.id}
                            className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-200/60'
                        >
                            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_55%)] opacity-0 transition group-hover:opacity-100' />
                            <div className='relative'>
                                <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-500'>
                                    Included
                                </div>
                                <h4 className='text-lg font-semibold'>
                                    {perk.title}
                                </h4>
                                <p className='mt-2 text-sm text-slate-600'>
                                    {perk.desc}
                                </p>
                                <button className='mt-5 inline-flex items-center text-sm font-semibold text-slate-900 transition group-hover:text-slate-700'>
                                    Learn more
                                    <span className='ml-2 text-base'>
                                        →
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  )
}
