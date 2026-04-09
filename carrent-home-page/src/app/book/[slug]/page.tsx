"use client"
import { getCar } from "@/server/car"
import { createBooking } from "@/server/booking"
import { useUser } from "@clerk/nextjs"
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Loader2,
  MapPin,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { getAddons } from "@/server/addons"

interface CarLocation {
  city: string
  state: string
  country: string
  addressLine: string
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
  pricePerDay: number
  currency: string
  images: string[]
  status: string
  location?: CarLocation
}


interface IAddon {
  _id: string
  name: string
  description: string
  price: number
}



const SECURITY_DEPOSIT = 5000

export default function BookingPage() {
  const params = useParams()
  const slug = params?.slug as string | undefined
  const router = useRouter()
  const { user, isSignedIn, isLoaded: clerkLoaded } = useUser()

  const [car, setCar] = useState<Car | null>(null)
  const [carLoading, setCarLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [addons, setAddons] = useState<IAddon[]>([])

  const todayISO = new Date().toISOString().split("T")[0]
  const tomorrowISO = new Date(Date.now() + 86_400_000).toISOString().split("T")[0]

  const [form, setForm] = useState({
    startDate: todayISO,
    endDate: tomorrowISO,
    sameDropoff: true,
    pickupCity: "",
    pickupAddress: "",
    dropoffCity: "",
    dropoffAddress: "",
    selectedAddons: [] as string[],
    notes: "",
  })

  const handleGetAddons =async()=>{
    try{
      if(!slug) return
      const res = await getAddons()
      if(res.length >0){
        setAddons(res)
      }
    }catch(error){
      console.log("Error while laoding addons")
    }
  }
  useEffect(()=>{
    handleGetAddons()
  },[slug])

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      try {
        const data = await getCar(slug)
        setCar(data)
        
        if (data?.location) {
          setForm(f => ({
            ...f,
            pickupCity: data.location?.city || "",
            pickupAddress: data.location?.addressLine || "",
          }))
        }
      } catch {
        /* noop */
      } finally {
        setCarLoading(false)
      }
    })()
  }, [slug])

  const totalDays = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0
    const diff =
      new Date(form.endDate).getTime() - new Date(form.startDate).getTime()
    return diff > 0 ? Math.ceil(diff / 86_400_000) : 0
  }, [form.startDate, form.endDate])

  const rentalCost = (car?.pricePerDay ?? 0) * totalDays

  const addOnsBreakdown = useMemo(
    () =>
      addons.filter(a => form.selectedAddons.includes(a._id)).map(a => ({
        ...a,
        total: a.price ? a.price * totalDays : a.price,
      })),
    [form.selectedAddons, totalDays]
  )

  const addOnsTotal = addOnsBreakdown.reduce((s, a) => s + a.total, 0)
  const grandTotal = rentalCost + addOnsTotal + SECURITY_DEPOSIT
  const currency = car?.currency ?? "INR"

  const toggleAddon = (id: string) =>
    setForm(f => ({
      ...f,
      selectedAddons: f.selectedAddons.includes(id)
        ? f.selectedAddons.filter(a => a !== id)
        : [...f.selectedAddons, id],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!isSignedIn || !user) {
      router.push(`/sign-in?redirect_url=/book/${slug}`)
      return
    }
    if (totalDays <= 0) {
      setSubmitError("Please select valid dates — return date must be after pick-up date.")
      return
    }

    setSubmitting(true)
    try {
      await createBooking({
        carSlug: car!.slug,
        userClerkId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress ?? "",
        userName: user.fullName ?? "",
        startDate: form.startDate,
        endDate: form.endDate,
        pickup: { city: form.pickupCity, addressLine: form.pickupAddress },
        dropoff: form.sameDropoff
          ? { city: form.pickupCity, addressLine: form.pickupAddress }
          : { city: form.dropoffCity, addressLine: form.dropoffAddress },
        addOns: addOnsBreakdown.map(a => ({ name: a.name, price: a.total })),
        notes: form.notes,
        securityDeposit: SECURITY_DEPOSIT,
      })
      setSuccess(true)
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Booking failed. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (carLoading || !clerkLoaded) return <LoadingSkeleton />
  if (!car) return <CarNotFound />
  if (success) return <SuccessState car={car} />

  const minEndDate = new Date(new Date(form.startDate).getTime() + 86_400_000)
    .toISOString()
    .split("T")[0]

  return (
    <main className="min-h-screen w-full bg-slate-50 pb-32 text-slate-900 sm:pb-0">
      {/* Header */}
      <div className="bg-slate-950 px-6 pt-24 pb-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/vehicles/${car.slug}`}
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to vehicle
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Booking
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {car.brand}{" "}
                <span className="text-white/70">{car.model}</span>
              </h1>
              <p className="mt-1 text-sm text-white/50">
                Complete the form below to reserve this vehicle
              </p>
            </div>
            <div className="hidden flex-col items-end sm:flex">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Per day
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {currency} {car.pricePerDay.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <form id="booking-form" onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* ── Left column ── */}
            <div className="space-y-5">
              {/* 01 Dates */}
              <FormSection
                number="01"
                icon={<CalendarDays />}
                title="Trip dates"
                subtitle="Choose your pick-up and return dates"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <DateField
                    label="Pick-up date"
                    value={form.startDate}
                    min={todayISO}
                    onChange={v =>
                      setForm(f => ({
                        ...f,
                        startDate: v,
                        endDate: f.endDate <= v ? minEndDate : f.endDate,
                      }))
                    }
                  />
                  <DateField
                    label="Return date"
                    value={form.endDate}
                    min={minEndDate}
                    onChange={v => setForm(f => ({ ...f, endDate: v }))}
                  />
                </div>

                {totalDays > 0 && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-sm text-emerald-800">
                      <span className="font-semibold">
                        {totalDays} day{totalDays > 1 ? "s" : ""}
                      </span>{" "}
                      rental &mdash; base cost{" "}
                      <span className="font-semibold">
                        {currency} {rentalCost.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
              </FormSection>

              {/* 02 Location */}
              <FormSection
                number="02"
                icon={<MapPin />}
                title="Pickup & drop-off"
                subtitle="Where should we bring the car and where will you return it?"
              >
                <div className="space-y-5">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Pickup location
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InputField
                        label="City"
                        value={form.pickupCity}
                        placeholder="Mumbai"
                        onChange={v => setForm(f => ({ ...f, pickupCity: v }))}
                      />
                      <InputField
                        label="Address"
                        value={form.pickupAddress}
                        placeholder="Building or street name"
                        onChange={v =>
                          setForm(f => ({ ...f, pickupAddress: v }))
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm(f => ({ ...f, sameDropoff: !f.sameDropoff }))
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      form.sameDropoff
                        ? "border-slate-200 bg-slate-50 text-slate-700"
                        : "border-slate-900 bg-slate-900 text-white"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                        form.sameDropoff
                          ? "border-slate-900 bg-slate-900"
                          : "border-white/60"
                      }`}
                    >
                      {form.sameDropoff && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    Drop-off at same location as pickup
                  </button>

                  {!form.sameDropoff && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Drop-off location
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InputField
                          label="City"
                          value={form.dropoffCity}
                          placeholder="Pune"
                          onChange={v =>
                            setForm(f => ({ ...f, dropoffCity: v }))
                          }
                        />
                        <InputField
                          label="Address"
                          value={form.dropoffAddress}
                          placeholder="Building or street name"
                          onChange={v =>
                            setForm(f => ({ ...f, dropoffAddress: v }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </FormSection>

              {/* 03 Add-ons */}
              <FormSection
                number="03"
                icon={<Plus />}
                title="Extras & add-ons"
                subtitle="Enhance your trip with optional upgrades"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {addons.map(addon => {
                    const selected = form.selectedAddons.includes(addon._id)
                    return (
                      <button
                        type="button"
                        key={addon._id}
                        onClick={() => toggleAddon(addon._id)}
                        className={`relative flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:shadow-sm"
                        }`}
                      >
                        <span className="text-2xl leading-none">
                          {/* {addon.icon} */}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{addon.name}</p>
                          <p
                            className={`mt-0.5 text-xs ${selected ? "text-white/60" : "text-slate-500"}`}
                          >
                            {addon.description}
                          </p>
                          <p
                            className={`mt-2 text-sm font-semibold ${selected ? "text-white" : "text-slate-700"}`}
                          >
                            {currency} {addon.price.toLocaleString()}
                            {addon.price ? "/day" : " flat"}
                          </p>
                        </div>
                        <div
                          className={`absolute right-4 top-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            selected ? "border-white bg-white" : "border-slate-300"
                          }`}
                        >
                          {selected && (
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </FormSection>

              {/* 04 Personal info */}
              <FormSection
                number="04"
                icon={<FileText />}
                title="Your details"
                subtitle="Confirm your info and add any special requests"
              >
                <div className="space-y-4">
                  {!isSignedIn ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <p className="text-sm text-amber-800">
                        You need to{" "}
                        <Link
                          href={`/sign-in?redirect_url=/book/${slug}`}
                          className="font-semibold underline underline-offset-2"
                        >
                          sign in
                        </Link>{" "}
                        to complete your booking.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Full name
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {user?.fullName || "—"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          Email
                        </p>
                        <p className="mt-1 truncate font-semibold text-slate-900">
                          {user?.primaryEmailAddress?.emailAddress || "—"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Notes{" "}
                      <span className="font-normal text-slate-400">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      rows={3}
                      placeholder="Any special requests or information for the rental team..."
                      value={form.notes}
                      onChange={e =>
                        setForm(f => ({ ...f, notes: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </FormSection>

              {submitError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}
            </div>

            {/* ── Right column — summary ── */}
            <div>
              <div className="sticky top-24 space-y-4">
                {/* Car card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                  <div className="relative h-44">
                    <img
                      src={car.images?.[0] ?? "/car.jpeg"}
                      alt={car.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-slate-900">
                        {car.category}
                      </span>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      {car.brand} {car.model}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {car.year} &middot; {car.fuelType} &middot;{" "}
                      {car.transmission}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Price breakdown
                  </h3>

                  <div className="mt-4 space-y-3">
                    <SummaryRow
                      label={`${currency} ${car.pricePerDay.toLocaleString()} × ${totalDays} day${totalDays !== 1 ? "s" : ""}`}
                      value={`${currency} ${rentalCost.toLocaleString()}`}
                    />

                    {addOnsBreakdown.map(a => (
                      <SummaryRow
                        key={a._id}
                        label={a.name}
                        value={`${currency} ${a.total.toLocaleString()}`}
                      />
                    ))}

                    <SummaryRow
                      label="Security deposit (refundable)"
                      value={`${currency} ${SECURITY_DEPOSIT.toLocaleString()}`}
                    />

                    <div className="border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-slate-900">
                          {currency} {grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={submitting || totalDays <= 0 || !isSignedIn}
                  className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-400/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Confirm booking"
                  )}
                </button>
                <p className="text-center text-xs text-slate-400">
                  Free cancellation up to 24 hrs before pickup
                </p>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { emoji: "🛡️", text: "Insured" },
                    { emoji: "✅", text: "Verified" },
                    { emoji: "🔄", text: "Refundable" },
                  ].map(b => (
                    <div
                      key={b.text}
                      className="rounded-2xl border border-slate-200 bg-white py-3 text-xs text-slate-500"
                    >
                      <div className="text-lg">{b.emoji}</div>
                      <div className="mt-0.5 font-medium">{b.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-900">
              {currency} {grandTotal.toLocaleString()}
            </p>
          </div>
          <button
            type="submit"
            form="booking-form"
            disabled={submitting || totalDays <= 0 || !isSignedIn}
            className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </main>
  )
}

/* ── Reusable sub-components ── */

function FormSection({
  number,
  icon,
  title,
  subtitle,
  children,
}: {
  number: string
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-white">
          {icon}
        </div>
        <div>
          <p className="font-mono text-xs text-slate-400">{number}</p>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function DateField({
  label,
  value,
  min,
  onChange,
}: {
  label: string
  value: string
  min: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="date"
        required
        value={value}
        min={min}
        onChange={e => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </label>
  )
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="shrink-0 font-medium text-slate-900">{value}</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-slate-50">
      <div className="h-44 bg-slate-900" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="h-52 rounded-3xl bg-slate-200" />
            <div className="h-52 rounded-3xl bg-slate-200" />
            <div className="h-52 rounded-3xl bg-slate-200" />
            <div className="h-40 rounded-3xl bg-slate-200" />
          </div>
          <div className="space-y-4">
            <div className="h-60 rounded-3xl bg-slate-200" />
            <div className="h-52 rounded-3xl bg-slate-200" />
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
        The vehicle you&apos;re trying to book doesn&apos;t exist or is no longer available.
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

function SuccessState({ car }: { car: Car }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-6 pb-12 pt-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 shadow-lg shadow-emerald-100">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Booking confirmed!
        </h1>
        <p className="mt-3 max-w-sm text-slate-500">
          Your{" "}
          <span className="font-semibold text-slate-900">
            {car.brand} {car.model}
          </span>{" "}
          has been reserved. A confirmation will be sent to your email shortly.
        </p>
      </div>

      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <img
          src={car.images?.[0] ?? "/car.jpeg"}
          alt={car.name}
          className="h-44 w-full object-cover"
        />
        <div className="p-5 text-left">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
            {car.category}
          </span>
          <p className="mt-3 text-lg font-bold text-slate-900">
            {car.brand} {car.model}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">{car.year}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/vehicles"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 hover:bg-slate-50"
        >
          Browse more vehicles
        </Link>
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

