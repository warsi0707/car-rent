"use client"

import { verifyPayment } from "@/server/payment"
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

interface CarData {
  name: string
  brand: string
  model: string
  year: number
  images: string[]
  category: string
  fuelType: string
  transmission: string
  pricePerDay: number
  currency: string
}

interface BookingData {
  _id: string
  status: string
  paymentStatus: string
  totalAmount: number
  totalDays: number
  startDate: string
  endDate: string
  car: CarData
  userName: string
  userEmail: string
  cashfreeOrderId: string
}

type VerifyResult =
  | { state: "loading" }
  | { state: "success"; booking: BookingData; orderStatus: string }
  | { state: "failed"; orderStatus?: string; booking?: BookingData }
  | { state: "error"; message: string }

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [result, setResult] = useState<VerifyResult>({ state: "loading" })

  useEffect(() => {
    if (!orderId) {
      setResult({ state: "error", message: "No order ID found in URL." })
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const data = await verifyPayment(orderId)
        if (cancelled) return
        if (data.orderStatus === "PAID") {
          setResult({ state: "success", booking: data.booking, orderStatus: data.orderStatus })
        } else {
          setResult({ state: "failed", orderStatus: data.orderStatus, booking: data.booking })
        }
      } catch (err) {
        if (cancelled) return
        setResult({
          state: "error",
          message: err instanceof Error ? err.message : "Could not verify payment.",
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [orderId])

  if (result.state === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6">
        <Loader2 className="h-12 w-12 animate-spin text-slate-400" />
        <p className="text-lg font-medium text-slate-600">Verifying your payment…</p>
      </div>
    )
  }

  if (result.state === "success") {
    const { booking } = result
    const car = booking?.car
    const currency = car?.currency ?? "INR"

    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-6 pb-12 py-12 text-center">
        {/* Icon */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-lg shadow-emerald-100">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payment successful!</h1>
          <p className="mt-3 max-w-md text-slate-500">
            Your booking for{" "}
            <span className="font-semibold text-slate-900">
              {car?.brand} {car?.model}
            </span>{" "}
            has been confirmed. A confirmation will be sent to{" "}
            <span className="font-semibold text-slate-900">{booking.userEmail}</span>.
          </p>
        </div>

        {/* Car card */}
        {car && (
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <img
              src={car.images?.[0] ?? "/car.jpeg"}
              alt={car.name}
              className="h-44 w-full object-cover"
            />
            <div className="p-5 text-left">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                Confirmed
              </span>
              <p className="mt-3 text-lg font-bold text-slate-900">
                {car.brand} {car.model}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                {car.year} · {car.fuelType} · {car.transmission}
              </p>
            </div>
          </div>
        )}

        {/* Booking summary */}
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 text-left">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Booking summary
          </h2>
          <div className="space-y-3 text-sm">
            <SummaryRow label="Booking ID" value={booking._id.slice(-8).toUpperCase()} />
            <SummaryRow
              label="Dates"
              value={`${new Date(booking.startDate).toLocaleDateString()} → ${new Date(booking.endDate).toLocaleDateString()}`}
            />
            <SummaryRow label="Duration" value={`${booking.totalDays} day${booking.totalDays !== 1 ? "s" : ""}`} />
            <SummaryRow
              label="Total paid"
              value={`${currency} ${booking.totalAmount.toLocaleString()}`}
            />
            <SummaryRow label="Status" value="Confirmed ✓" highlight />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/bookings"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50"
          >
            View my bookings
          </Link>
          <Link
            href="/vehicles"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Browse more vehicles
          </Link>
        </div>
      </main>
    )
  }

  if (result.state === "failed") {
    const { orderStatus, booking } = result
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-6 pb-12 py-12 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 shadow-lg shadow-red-100">
          <XCircle className="h-12 w-12 text-red-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payment failed</h1>
          <p className="mt-3 max-w-md text-slate-500">
            {orderStatus === "EXPIRED"
              ? "Your payment session expired before the transaction could be completed."
              : orderStatus === "CANCELLED"
              ? "The payment was cancelled."
              : "Something went wrong with your payment. No charges have been made."}
          </p>
          {orderStatus && (
            <p className="mt-2 text-xs text-slate-400">
              Order status: <span className="font-medium">{orderStatus}</span>
            </p>
          )}
          {booking && (
            <p className="mt-1 text-xs text-slate-400">
              Booking ID: <span className="font-medium">{booking._id.slice(-8).toUpperCase()}</span> (unpaid)
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/vehicles"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50"
          >
            Browse vehicles
          </Link>
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Go to homepage
          </Link>
        </div>
      </main>
    )
  }

  // state === "error"
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
        <AlertCircle className="h-12 w-12 text-amber-500" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verification error</h1>
        <p className="mt-2 max-w-sm text-slate-500">
          {"message" in result ? result.message : "Unable to verify payment status."}
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Go to homepage
      </Link>
    </main>
  )
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${highlight ? "text-emerald-600" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}
