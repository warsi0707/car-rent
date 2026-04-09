"use client"
import { getCar } from "@/server/car"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  DoorClosed,
  Fuel,
  Gauge,
  MapPin,
  Palette,
  Settings2,
  Shield,
  Star,
  Users,
} from "lucide-react"

interface CarLocation {
  city: string
  state: string
  country: string
  addressLine: string
  lat: number
  lng: number
}

interface Car {
  _id: string
  carId: string
  slug: string
  name: string
  brand: string
  model: string
  year: number
  category: string
  fuelType: string
  transmission: string
  seats: number
  doors?: number
  color?: string
  mileageKm?: number
  pricePerDay: number
  currency: string
  images: string[]
  features?: string[]
  description?: string
  status: string
  location?: CarLocation
}

const statusStyles: Record<string, string> = {
  available: "text-emerald-700 bg-emerald-50 border-emerald-200",
  booked: "text-orange-700 bg-orange-50 border-orange-200",
  maintenance: "text-red-700 bg-red-50 border-red-200",
  inactive: "text-slate-500 bg-slate-100 border-slate-200",
  draft: "text-slate-500 bg-slate-100 border-slate-200",
}

export default function CarDetailPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const data = await getCar(id)
        console.log(data)
        setCar(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <LoadingSkeleton />
  if (!car) return <CarNotFound />

  const statusClass = statusStyles[car.status] ?? statusStyles.inactive
  const isAvailable = car.status === "available"
  const currency = car.currency ?? "INR"

  return (
    <main className="min-h-screen w-full bg-slate-50 pb-24 text-slate-900 sm:pb-0">
      {/* Dark header */}
      <div className="bg-slate-950 px-6 pt-24 pb-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to vehicles
          </Link>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-white/80">
                  {car.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {car.year}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
                >
                  {car.status}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {car.brand} {car.model}
              </h1>
              <p className="mt-1 text-sm text-white/50">{car.name}</p>
            </div>

            <div className="hidden flex-col items-end sm:flex">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Per day
              </p>
              <p className="mt-1 text-4xl font-bold text-white">
                {currency} {car.pricePerDay.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Image gallery */}
            <div className="space-y-3">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-slate-200 sm:aspect-video">
                <img
                  src={car.images?.[activeImage] ?? "/car.jpeg"}
                  alt={car.name}
                  className="h-full w-full object-cover transition-all duration-300"
                />
                {car.images?.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {activeImage + 1} / {car.images.length}
                  </div>
                )}
              </div>

              {car.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {car.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        activeImage === idx
                          ? "border-slate-900"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {car.description && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">About this car</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {car.description}
                </p>
              </div>
            )}

            {/* Specs */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Specifications</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SpecCard
                  icon={<Fuel />}
                  label="Fuel type"
                  value={car.fuelType}
                />
                <SpecCard
                  icon={<Settings2 />}
                  label="Transmission"
                  value={car.transmission}
                />
                <SpecCard
                  icon={<Users />}
                  label="Seats"
                  value={`${car.seats} seats`}
                />
                {car.doors != null && (
                  <SpecCard
                    icon={<DoorClosed />}
                    label="Doors"
                    value={`${car.doors} doors`}
                  />
                )}
                {car.mileageKm != null && (
                  <SpecCard
                    icon={<Gauge />}
                    label="Mileage"
                    value={`${car.mileageKm} km/l`}
                  />
                )}
                {car.color && (
                  <SpecCard
                    icon={<Palette />}
                    label="Color"
                    value={car.color}
                  />
                )}
              </div>
            </div>

            {/* Features */}
            {(car.features?.length ?? 0) > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Features & amenities</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {car.features!.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {car.location?.city && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Pickup location</h2>
                <div className="mt-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <MapPin className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {car.location.city}, {car.location.state}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {car.location.addressLine}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {car.location.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — booking card ── */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">
                      Price per day
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {currency} {car.pricePerDay.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
                  >
                    {car.status}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-600">Daily rate</span>
                    <span className="font-semibold text-slate-900">
                      {currency} {car.pricePerDay.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-600">Security deposit</span>
                    <span className="font-semibold text-slate-900">
                      {currency} 5,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-600">Availability</span>
                    <span
                      className={`font-semibold capitalize ${
                        isAvailable ? "text-emerald-600" : "text-orange-600"
                      }`}
                    >
                      {car.status}
                    </span>
                  </div>
                </div>

                <button
                onClick={()=> router.push(`/book/${car.slug}`)}
                  disabled={!isAvailable}
                  className="mt-6 w-full cursor-pointer rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-400/30 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isAvailable ? "Book this car" : "Currently unavailable"}
                </button>
                <button className="mt-3 w-full rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50">
                  Save to wishlist
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <Shield className="h-4 w-4 text-slate-500" />
                    </div>
                    Insurance included in every rental
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <Clock className="h-4 w-4 text-slate-500" />
                    </div>
                    Instant booking confirmation
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <Star className="h-4 w-4 text-slate-500" />
                    </div>
                    Top rated by 200+ renters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-6 py-4 sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Per day</p>
            <p className="text-xl font-bold text-slate-900">
              {currency} {car.pricePerDay.toLocaleString()}
            </p>
          </div>
          <button
          onClick={()=> router.push(`/book/${car.slug}`)}
            disabled={!isAvailable}
            className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isAvailable ? "Book now" : "Unavailable"}
          </button>
        </div>
      </div>
    </main>
  )
}

function SpecCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-slate-500">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold capitalize text-slate-900">
          {value}
        </p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-slate-50">
      <div className="h-52 bg-slate-900" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="aspect-video rounded-3xl bg-slate-200" />
            <div className="h-28 rounded-3xl bg-slate-200" />
            <div className="h-48 rounded-3xl bg-slate-200" />
            <div className="h-40 rounded-3xl bg-slate-200" />
          </div>
          <div className="space-y-4">
            <div className="h-80 rounded-3xl bg-slate-200" />
            <div className="h-36 rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CarNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <AlertCircle className="h-12 w-12 text-slate-400" />
      <h1 className="text-2xl font-semibold text-slate-900">Car not found</h1>
      <p className="text-slate-500">
        The vehicle you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/vehicles"
        className="mt-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Browse vehicles
      </Link>
    </div>
  )
}
