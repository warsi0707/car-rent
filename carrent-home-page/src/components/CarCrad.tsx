import { ICar } from "@/pages/Vehicles";
import Link from "next/link";
import React from "react";

function CarCrad({ car }: { car: ICar }) {
  return (
    <Link
      href={`/vehicles/${car.slug}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-200/70"
    >
      <div className="relative">
        <img
          src={car.images?.[0] ?? "/car.jpeg"}
          alt={car.name}
          className="h-52 w-full object-cover sm:h-56"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-slate-900">
            {car.category}
          </span>
          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            {car.currency ?? "INR"} {car.pricePerDay.toLocaleString()}/day
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
        <p className="mt-1 text-xs text-slate-500">{car.year}</p>
        <p className="mt-2 text-sm text-slate-600 capitalize">
          {car.seats} seats • {car.transmission} • {car.fuelType}
        </p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
            car.status === "available"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-500"
          }`}>
            {car.status ?? "available"}
          </span>
          <span className="text-sm font-semibold text-slate-900 transition group-hover:text-slate-700">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CarCrad;
