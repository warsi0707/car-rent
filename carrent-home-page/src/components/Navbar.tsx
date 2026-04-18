"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { User } from "lucide-react";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const navItems = [
    { id: 1, name: "Vehicles", href: "/vehicles" },
    { id: 2, name: "About", href: "/about" },
    { id: 3, name: "Contact", href: "/contact" },
  ];
  const initials = user?.fullName
    ?.split(" ")
    ?.map((name) => name[0]?.toUpperCase())
    ?.join("");
  const displayName = user?.fullName || "User";
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md text-white border-b border-white/5 shadow-lg shadow-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href={"/"} className="text-lg font-semibold tracking-wide">
          <span className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            Rentify
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ?
          <button onClick={()=> router.push("/bookings")} className="hidden cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90 sm:inline-flex">
            Bookings
          </button>:
          <button onClick={()=> router.push("/vehicles")} className="hidden cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90 sm:inline-flex">
            Book a car
          </button>}
          {isSignedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-black/30 backdrop-blur transition hover:border-white/40 hover:bg-white/15"
              >
                <User className="h-4 w-4" />
                <span className="uppercase tracking-[0.2em] text-xs">
                  {initials || "U"}
                </span>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/15 bg-slate-950/95 p-4 text-white shadow-2xl shadow-black/50 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Signed in as
                  </p>
                  <p className="mt-2 text-sm font-semibold">{displayName}</p>
                  <p className="mt-1 text-xs text-white/60">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                  <div className="mt-4 grid gap-2 text-xs text-white/70">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <span>Status</span>
                      <span className="font-semibold text-emerald-400">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <span>Member since</span>
                      <span className="font-semibold text-white">2024</span>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="mt-4 w-full rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/sign-in")}
              className="hidden rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white hover:text-white md:inline-flex"
            >
              Sign in
            </button>
          )}
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white shadow-lg shadow-black/30 backdrop-blur transition hover:border-white/40 hover:bg-white/15 md:hidden"
            aria-label="Toggle menu"
          >
            <span className="h-4 w-4">
              <span className="block h-0.5 w-4 bg-white"></span>
              <span className="mt-1 block h-0.5 w-4 bg-white/80"></span>
              <span className="mt-1 block h-0.5 w-4 bg-white/60"></span>
            </span>
          </button>
        </div>
      </div>
      {isMobileOpen && (
        <div className="md:hidden">
          <div className="mx-auto mt-3 w-[calc(100%-3rem)] max-w-6xl rounded-3xl border border-white/15 bg-slate-950/95 p-5 text-white shadow-2xl shadow-black/40 backdrop-blur">
            <div className="grid gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/30 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {isSignedIn ? <button onClick={()=> router.push("/bookings")} className="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90">
                Bookings
              </button>:
              <button onClick={()=> router.push("/vehicles")} className="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/90">
                Book a car
              </button>}
              {!isSignedIn && (
                <button
                  onClick={() => router.push("/sign-in")}
                  className="w-full rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Sign in
                </button>
              )}
            </div>

            {isSignedIn && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Signed in as
                </p>
                <p className="mt-2 text-sm font-semibold">{displayName}</p>
                <p className="mt-1 text-xs text-white/60">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <button
                  onClick={() => signOut()}
                  className="mt-4 w-full rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mx-auto h-px w-[calc(100%-3rem)] max-w-6xl bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </nav>
  );
}
