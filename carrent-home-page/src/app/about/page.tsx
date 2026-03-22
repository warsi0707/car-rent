import React from 'react'

export default function page() {
  return (
    <main className='w-full bg-white text-slate-900'>
      <section className='relative overflow-hidden bg-slate-950 px-6 pb-12 pt-28 text-white'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black' />
        </div>
        <div className='relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
          <div>
            <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
              About Rentify
            </p>
            <h1 className='mt-3 text-4xl font-semibold leading-tight sm:text-5xl'>
              We make city‑to‑city travel feel effortless.
            </h1>
            <p className='mt-4 max-w-xl text-sm text-white/70 sm:text-base'>
              Rentify pairs premium vehicles with clear, upfront pricing. Our
              mission is to help you move with confidence—whether you are
              commuting, traveling, or hosting clients.
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <button className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90'>
                Explore vehicles
              </button>
              <button className='rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10'>
                Talk to us
              </button>
            </div>
          </div>
          <div className='relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/5 shadow-lg shadow-black/30'>
            <img
              src="/car.jpeg"
              alt="Rentify fleet"
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
            <div className='absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-white/80 backdrop-blur shadow-md shadow-black/30'>
              Average pickup in 3 minutes
            </div>
          </div>
        </div>
      </section>

      <section className='border-y border-slate-200 bg-slate-50 px-6 py-12'>
        <div className='mx-auto grid max-w-6xl gap-6 md:grid-cols-3'>
          {[
            { label: 'Cities', value: '34+' },
            { label: 'Vehicles', value: '1,200+' },
            { label: 'Trips completed', value: '120k+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className='rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm'
            >
              <p className='text-3xl font-semibold'>{stat.value}</p>
              <p className='mt-2 text-xs uppercase tracking-[0.35em] text-slate-500'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className='px-6 py-14'>
        <div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]'>
          <div className='rounded-3xl border border-slate-200 bg-white p-8 shadow-sm'>
            <h2 className='text-2xl font-semibold'>What makes us different</h2>
            <p className='mt-3 text-sm text-slate-600 sm:text-base'>
              Built for clarity and speed. We remove the typical rental stress
              with upfront pricing, flexible policies, and dependable support.
            </p>
            <div className='mt-6 space-y-4'>
              {[
                'Transparent pricing and zero hidden fees.',
                'Flexible pickup and drop-off options.',
                'Verified vehicles with routine maintenance.',
              ].map((item) => (
                <div
                  key={item}
                  className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700'
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className='grid gap-6 sm:grid-cols-2'>
            {[
              {
                title: 'Safety standards',
                desc: 'Multi‑point inspections and sanitized interiors before every pickup.',
              },
              {
                title: 'Live support',
                desc: '24/7 concierge support for roadside help and booking changes.',
              },
              {
                title: 'Smart booking',
                desc: 'Instant confirmation with flexible cancellation options.',
              },
              {
                title: 'Local partners',
                desc: 'Trusted fleet operators in every city we serve.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
              >
                <p className='text-xs uppercase tracking-[0.35em] text-slate-500'>
                  {item.title}
                </p>
                <p className='mt-3 text-sm text-slate-600'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 pb-16'>
        <div className='mx-auto max-w-6xl rounded-[2.5rem] border border-slate-200 bg-slate-900 px-8 py-10 text-white shadow-xl shadow-slate-300/40'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
                Our promise
              </p>
              <h2 className='mt-3 text-2xl font-semibold'>
                Every trip should feel effortless.
              </h2>
              <p className='mt-2 text-sm text-white/70'>
                We back every booking with priority support, fair pricing, and a
                fully verified fleet.
              </p>
            </div>
            <button className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-white/90'>
              View openings
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
