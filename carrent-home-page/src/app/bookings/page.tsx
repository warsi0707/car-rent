"use client"

import { getBookings } from "@/server/booking"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface CarInBooking {
  _id: string
  name: string
  slug: string
  brand: string
  model: string
  images?: string[]
  category?: string
  seats?: number
  transmission?: string
  fuelType?: string
}

interface Booking {
  _id: string
  car: CarInBooking
  userClerkId: string
  userEmail: string
  userName: string
  startDate: string
  endDate: string
  totalDays: number
  pricePerDay: number
  totalAmount: number
  securityDeposit: number
  currency: string
  pickup: { city: string; addressLine: string }
  dropoff: { city: string; addressLine: string }
  addOns: { name: string; price: number }[]
  notes: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "unpaid" | "paid" | "refunded"
  createdAt: string
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending:   { label: "Pending",   classes: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  confirmed: { label: "Confirmed", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  cancelled: { label: "Cancelled", classes: "bg-red-500/15 text-red-400 border-red-500/30" },
  completed: { label: "Completed", classes: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
}

const paymentConfig: Record<string, { label: string; classes: string }> = {
  unpaid:   { label: "Unpaid",   classes: "bg-red-500/15 text-red-400 border-red-500/30" },
  paid:     { label: "Paid",     classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  refunded: { label: "Refunded", classes: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function BookingCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div className="flex gap-4">
        <div className="h-24 w-36 rounded-xl bg-white/10 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-48 rounded bg-white/10" />
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 w-20 rounded-full bg-white/10" />
            <div className="h-5 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-white/10" />
        ))}
      </div>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const status = statusConfig[booking.status] ?? statusConfig.pending
  const payment = paymentConfig[booking.paymentStatus] ?? paymentConfig.unpaid
  const car = booking.car

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-colors">
      {/* Car banner */}
      <div className="flex flex-col sm:flex-row gap-0">
        <div className="relative sm:w-44 sm:shrink-0">
          <img
            src={car.images?.[0] ?? "/car.jpeg"}
            alt={car.name}
            className="h-44 sm:h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent sm:bg-linear-to-r" />
        </div>

        <div className="flex-1 p-5 space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight">{car.name}</h3>
              <p className="text-sm text-white/50 mt-0.5">
                {car.brand} · {car.model}
                {car.category && ` · ${car.category}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${status.classes}`}>
                {status.label}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${payment.classes}`}>
                {payment.label}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/8 px-3 py-1.5 border border-white/10">
              <span className="text-white/40 text-xs">PICK-UP</span>
              <span className="text-white font-medium">{formatDate(booking.startDate)}</span>
            </div>
            <span className="text-white/30 text-xs">→</span>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/8 px-3 py-1.5 border border-white/10">
              <span className="text-white/40 text-xs">DROP-OFF</span>
              <span className="text-white font-medium">{formatDate(booking.endDate)}</span>
            </div>
            <span className="text-white/50 text-xs">{booking.totalDays} day{booking.totalDays !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="border-t border-white/8 px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="space-y-0.5">
          <p className="text-white/40 text-xs uppercase tracking-wide">Pickup Location</p>
          <p className="text-white/90 font-medium">{booking.pickup?.city}</p>
          <p className="text-white/50 text-xs">{booking.pickup?.addressLine}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-white/40 text-xs uppercase tracking-wide">Dropoff Location</p>
          <p className="text-white/90 font-medium">{booking.dropoff?.city}</p>
          <p className="text-white/50 text-xs">{booking.dropoff?.addressLine}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-white/40 text-xs uppercase tracking-wide">Rate</p>
          <p className="text-white/90 font-medium">
            {booking.currency} {booking.pricePerDay.toLocaleString("en-IN")}<span className="text-white/40 text-xs">/day</span>
          </p>
          <p className="text-white/50 text-xs">Deposit: {booking.currency} {booking.securityDeposit.toLocaleString("en-IN")}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-white/40 text-xs uppercase tracking-wide">Total Amount</p>
          <p className="text-xl font-bold text-white">
            {booking.currency} {booking.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Add-ons & notes */}
      {(booking.addOns?.length > 0 || booking.notes) && (
        <div className="border-t border-white/8 px-5 py-3 flex flex-wrap gap-4 text-sm">
          {booking.addOns?.length > 0 && (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Add-ons</p>
              <div className="flex flex-wrap gap-1.5">
                {booking.addOns.map((a, i) => (
                  <span key={i} className="rounded-full bg-white/8 border border-white/10 px-2.5 py-0.5 text-xs text-white/80">
                    {a.name} · {booking.currency} {a.price}
                  </span>
                ))}
              </div>
            </div>
          )}
          {booking.notes && (
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Notes</p>
              <p className="text-white/60 text-xs max-w-xs">{booking.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/8 px-5 py-2.5 flex items-center justify-between text-xs text-white/30">
        <span>Booking ID: {booking._id}</span>
        <span>Booked on {formatDate(booking.createdAt)}</span>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setLoading(false)
      return
    }
    getBookings(user.id)
      .then((data) => setBookings(data?.bookings ?? data ?? []))
      .catch((err) => setError(err?.message ?? "Failed to load bookings"))
      .finally(() => setLoading(false))
  }, [isLoaded, isSignedIn])

  return (
    <div className="min-h-screen bg-[#171717] px-4 py-12 pt-32 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <p className="mt-1.5 text-sm text-white/40">
            {isSignedIn ? `Logged in as ${user?.emailAddresses?.[0]?.emailAddress}` : "Sign in to view your bookings"}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-5">
            {[...Array(2)].map((_, i) => <BookingCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Not signed in */}
        {!loading && !isSignedIn && !error && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-white/50 text-sm">Please sign in to view your bookings.</p>
          </div>
        )}

        {/* Empty */}
        {!loading && isSignedIn && !error && bookings.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
            <p className="text-3xl mb-3">🚗</p>
            <p className="text-white font-medium">No bookings yet</p>
            <p className="text-white/40 text-sm mt-1">Your future rentals will appear here.</p>
          </div>
        )}

        {/* Bookings list */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((b) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
