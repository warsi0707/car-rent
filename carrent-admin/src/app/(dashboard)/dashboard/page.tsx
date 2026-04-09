import React from 'react'

const KPI_CARDS = [
  { label: 'Active Cars', value: '128', delta: '+12%', trend: 'up' },
  { label: 'Bookings Today', value: '46', delta: '+8%', trend: 'up' },
  { label: 'Revenue (MTD)', value: '₹4.2L', delta: '+15%', trend: 'up' },
  { label: 'Cars in Service', value: '9', delta: '-3%', trend: 'down' },
]

const RECENT_BOOKINGS = [
  { id: 'BK-2041', customer: 'Rahul Mehta', car: 'Honda City ZX', date: 'Mar 27', status: 'Confirmed', amount: '₹2,800' },
  { id: 'BK-2040', customer: 'Priya Sharma', car: 'Tata Nexon EV', date: 'Mar 27', status: 'Pending', amount: '₹3,500' },
  { id: 'BK-2039', customer: 'Arjun Singh', car: 'Hyundai Creta SX', date: 'Mar 26', status: 'Completed', amount: '₹3,200' },
  { id: 'BK-2038', customer: 'Neha Gupta', car: 'Maruti Swift ZXi', date: 'Mar 26', status: 'Cancelled', amount: '₹1,800' },
]

const FLEET_STATUS = [
  { label: 'Available', value: 76, color: 'bg-emerald-500' },
  { label: 'Booked', value: 32, color: 'bg-amber-500' },
  { label: 'Maintenance', value: 11, color: 'bg-rose-500' },
  { label: 'Inactive', value: 9, color: 'bg-slate-400' },
]

export default function page() {
  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Track bookings, revenue, and fleet performance at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Export Report
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Create Booking
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-2xl font-semibold text-slate-900">{card.value}</span>
              <span
                className={`text-xs font-semibold ${
                  card.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {card.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Revenue Overview</h2>
                <p className="text-sm text-slate-500">Daily earnings for the last 14 days.</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-white">14 days</span>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-600">
                  30 days
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-14 items-end gap-2">
              {[32, 44, 36, 52, 48, 60, 58, 46, 50, 66, 72, 64, 58, 70].map((height, index) => (
                <div
                  key={index}
                  className="h-24 rounded-md bg-slate-100"
                >
                  <div
                    className="w-full rounded-md bg-slate-900"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Mar 14</span>
              <span>Mar 27</span>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
                <p className="text-sm text-slate-500">Latest activity from the fleet.</p>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                View all
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RECENT_BOOKINGS.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{booking.id}</div>
                        <div className="text-xs text-slate-500">{booking.car}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{booking.customer}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : booking.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700'
                                : booking.status === 'Completed'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">
                        {booking.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Fleet Status</h2>
            <p className="mt-1 text-sm text-slate-500">Current availability breakdown.</p>
            <div className="mt-6 space-y-4">
              {FLEET_STATUS.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-medium text-slate-900">{item.value}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Operations</h2>
            <p className="mt-1 text-sm text-slate-500">Quick actions for admins.</p>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Approve maintenance requests
                <span className="text-xs text-slate-400">3 pending</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Review overdue returns
                <span className="text-xs text-slate-400">2 alerts</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Generate weekly summary
                <span className="text-xs text-slate-400">PDF</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
