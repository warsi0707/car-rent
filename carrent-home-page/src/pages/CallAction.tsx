import React from 'react'

export default function CallAction() {
  return (
    <section className='w-full  px-6 py-16 '>
      <div className='mx-auto max-w-6xl'>
        <div className='relative overflow-hidden rounded-[2.5rem] border  px-8 py-12 shadow-xl shadow-black/40'>
          <div className='absolute -right-20 -top-24 h-48 w-48 rounded-full blur-3xl' />
          <div className='absolute -left-16 bottom-0 h-40 w-40 rounded-full  blur-3xl' />
          <div className='relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] '>
                Ready to hit the road?
              </p>
              <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
                Book your car in minutes and drive today.
              </h2>
            </div>
            <button className='w-fit rounded-full  px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90'>
              Book Your Car Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
