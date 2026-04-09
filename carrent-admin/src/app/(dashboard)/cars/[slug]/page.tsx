"use client"
import Link from "next/link";
import { getCar } from "@/server/car";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type Car = {
  _id: string;
  carId: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  seats: number;
  doors?: number;
  color?: string;
  mileageKm?: number;
  pricePerDay: number;
  currency?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    addressLine?: string;
    lat?: number;
    lng?: number;
  };
  images?: string[];
  features?: string[];
  description?: string;
  status: string;
  isActive?: boolean;
  addedBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

const formatPrice = (value: number, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
};

const statusStyles = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "available") return "bg-emerald-50 text-emerald-700";
  if (normalized === "booked") return "bg-amber-50 text-amber-700";
  if (normalized === "maintenance") return "bg-rose-50 text-rose-700";
  if (normalized === "inactive") return "bg-slate-100 text-slate-600";
  return "bg-slate-100 text-slate-600";
};

export default  function page() {
    const params = useParams()
    const slug = params?.slug as string
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

const handleGetCar = async (id: string) => {
    try {
      setLoading(true);
      const res = await getCar(id);
      console.log("Fetched car details:", res);
      setCar(res.car);
    } catch (error) {
      console.error("Error fetching car details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch car details when component mounts or when slug changes
  useEffect(() => {
    if (slug) {
      handleGetCar(slug);
    }
  }, [slug]);  

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
          </div>
          <p className="text-sm font-medium text-slate-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Car not found.
        </div>
      </div>
    );
  }

  const heroImage = car.images?.[0];
  const gallery = car.images?.slice(1) ?? [];
  const locationLine = [
    car.location?.city,
    car.location?.state,
    car.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Car Details</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            {car.brand} {car.model} • {car.name}
          </h1>
          <p className="text-sm text-slate-500">
            ID: {car.carId} • {car.year} • {car.category}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles(
              car.status
            )}`}
          >
            {car.status}
          </span>
          <Link
            href="/cars"
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back to Cars
          </Link>
          <Link
            href={`/cars/${slug}/edit`}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Edit Car
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-slate-100">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={`${car.brand} ${car.model}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No image uploaded
              </div>
            )}
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-4">
            {(gallery.length ? gallery : Array.from<string | undefined>({ length: 3 })).map((image, index) => (
              <div
                key={`${image ?? "placeholder"}-${index}`}
                className="aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={`Car image ${index + 2}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    Add gallery image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pricing</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-slate-900">
                {formatPrice(car.pricePerDay, car.currency)}
              </span>
              <span className="text-sm text-slate-500">per day</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Transmission</span>
                <span className="font-medium text-slate-900 capitalize">{car.transmission}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fuel Type</span>
                <span className="font-medium text-slate-900 capitalize">{car.fuelType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Seats</span>
                <span className="font-medium text-slate-900">{car.seats}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Doors</span>
                <span className="font-medium text-slate-900">{car.doors ?? 4}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mileage</span>
                <span className="font-medium text-slate-900">
                  {car.mileageKm ? `${car.mileageKm} km` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Color</span>
                <span className="font-medium text-slate-900">{car.color || "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{locationLine || "—"}</p>
            <p className="mt-1 text-sm text-slate-600">{car.location?.addressLine || ""}</p>
            {(car.location?.lat || car.location?.lng) && (
              <p className="mt-3 text-xs text-slate-500">
                Coordinates: {car.location?.lat ?? "—"}, {car.location?.lng ?? "—"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {car.description || "No description provided for this car yet."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Features</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {car.features?.length ? (
              car.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {feature}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No features listed.</span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Meta</p>
        <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Active</p>
            <p className="font-medium text-slate-900">{car.isActive ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Added By</p>
            <p className="font-medium text-slate-900">{car.addedBy?.name || "—"}</p>
            <p className="text-xs text-slate-500">{car.addedBy?.email || ""}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Created</p>
            <p className="font-medium text-slate-900">
              {car.createdAt ? new Date(car.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Last Updated</p>
            <p className="font-medium text-slate-900">
              {car.updatedAt ? new Date(car.updatedAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
