import React from 'react'

export default function Footer() {
  return (
    <footer className='w-full bg-slate-950 px-6 py-14 text-white sm:py-16'>
      <div className='mx-auto max-w-6xl'>
        <div className='grid gap-10 md:grid-cols-[1.1fr_1fr]'>
          <div>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.35em] text-white/70'>
              Rentify
            </div>
            <h3 className='mt-4 text-2xl font-semibold'>
              Your next ride, ready in minutes.
            </h3>
            <p className='mt-3 max-w-md text-sm text-white/70'>
              Book premium cars with transparent pricing, flexible pickups, and
              24/7 support anywhere you travel.
            </p>
            <div className='mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70'>
              <span className='rounded-full border border-white/20 px-4 py-2'>
                34 cities
              </span>
              <span className='rounded-full border border-white/20 px-4 py-2'>
                1200+ cars
              </span>
              <span className='rounded-full border border-white/20 px-4 py-2'>
                24/7 support
              </span>
            </div>
          </div>

          <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-3'>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
                Company
              </p>
              <ul className='mt-4 space-y-3 text-sm text-white/70'>
                <li>About</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Partners</li>
              </ul>
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
                Explore
              </p>
              <ul className='mt-4 space-y-3 text-sm text-white/70'>
                <li>Vehicles</li>
                <li>Locations</li>
                <li>Pricing</li>
                <li>Membership</li>
              </ul>
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
                Support
              </p>
              <ul className='mt-4 space-y-3 text-sm text-white/70'>
                <li>Help center</li>
                <li>Safety</li>
                <li>Cancellation</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between'>
          <p>© 2026 Rentify. All rights reserved.</p>
          <div className='flex flex-wrap gap-4'>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
