import React from 'react'

export default function HowitWorks() {
  const steps = [
    {
      id: '01',
      title: 'Search your location and dates',
      desc: 'Tell us where you are and when you need a car. We will show live availability instantly.',
    },
    {
      id: '02',
      title: 'Choose your car',
      desc: 'Filter by price, body type, or features to find the perfect fit for your trip.',
    },
    {
      id: '03',
      title: 'Book instantly',
      desc: 'Confirm in seconds with secure payments and transparent pricing.',
    },
    {
      id: '04',
      title: 'Pick up and enjoy your ride',
      desc: 'Grab the keys, drive away, and return with flexible options and support.',
    },
  ]

  return (
    <section className='w-full bg-white px-6 py-16 text-slate-900 sm:py-20'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-xs uppercase tracking-[0.35em] text-slate-500'>
              How it works
            </p>
            <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
              Book a car in minutes, not hours
            </h2>
            <p className='mt-3 max-w-2xl text-sm text-slate-600 sm:text-base'>
              From search to pickup, every step is designed to be fast,
              flexible, and completely transparent.
            </p>
          </div>
          <button className='inline-flex w-fit items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-100'>
            Get started
          </button>
        </div>

        <div className='mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]'>
          <div className='grid gap-6 sm:grid-cols-2'>
            {steps.map((step) => (
              <div
                key={step.id}
                className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-200/60'
              >
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_55%)] opacity-0 transition group-hover:opacity-100' />
                <div className='relative'>
                  <span className='inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500'>
                    {step.id}
                  </span>
                  <h3 className='mt-4 text-lg font-semibold'>
                    {step.title}
                  </h3>
                  <p className='mt-2 text-sm text-slate-600'>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-white p-8 shadow-lg shadow-slate-200/60'>
            <div className='absolute -right-12 -top-10 h-40 w-40 rounded-full bg-slate-200/60 blur-2xl' />
            <p className='text-xs uppercase tracking-[0.35em] text-slate-500'>
              Pro tip
            </p>
            <h3 className='mt-3 text-2xl font-semibold'>
              Save more with weekly rentals
            </h3>
            <p className='mt-3 text-sm text-slate-600'>
              Book 7+ days and unlock up to 25% off, free upgrades, and priority
              pickup at popular hubs.
            </p>
            <div className='mt-6 space-y-3 text-sm text-slate-600'>
              <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3'>
                <span>Avg. pickup time</span>
                <span className='font-semibold text-slate-900'>3 min</span>
              </div>
              <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3'>
                <span>Instant confirmation</span>
                <span className='font-semibold text-slate-900'>Yes</span>
              </div>
              <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3'>
                <span>Support availability</span>
                <span className='font-semibold text-slate-900'>24/7</span>
              </div>
            </div>
            <button className='mt-6 inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300/80 transition hover:-translate-y-0.5 hover:bg-slate-800'>
              Explore memberships
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
