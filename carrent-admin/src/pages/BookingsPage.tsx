"use client";

import { deleteBooking, updateBooking } from "@/server/booking";
import { X, CalendarDays, User, CreditCard, MapPin, Package, ChevronDown, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";

type Car = {
  _id: string;
  name: string;
  brand: string;
  model: string;
  slug: string;
  pricePerDay: number;
  currency: string;
  images?: string[];
};

type AddOn = {
  name: string;
  price: number;
};

type Location = {
  city?: string;
  state?: string;
  country?: string;
  addressLine?: string;
};

type Booking = {
  _id: string;
  car: Car;
  userClerkId: string;
  userEmail?: string;
  userName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  currency: string;
  totalAmount: number;
  securityDeposit: number;
  addOns: AddOn[];
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded" | "failed";
  paymentProvider?: string;
  paymentId?: string;
  pickup: Location;
  dropoff: Location;
  notes?: string;
  createdAt: string;
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
};

const paymentBadge = (status: string) => {
  const map: Record<string, string> = {
    unpaid: "bg-slate-100 text-slate-600",
    paid: "bg-emerald-50 text-emerald-700",
    refunded: "bg-purple-50 text-purple-700",
    failed: "bg-rose-50 text-rose-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
};

const fmt = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const fmtMoney = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

type BookingsPageProps = {
  bookings: Booking[];
};

export default function BookingsPage({ bookings = [] }: BookingsPageProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    let list = bookings;
    if (statusFilter !== "all") list = list.filter((b) => b.status === statusFilter);
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter((b) => {
      const hay = [
        b._id,
        b.userEmail,
        b.userName,
        b.userClerkId,
        b.car?.name,
        b.car?.brand,
        b.status,
        b.paymentStatus,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [bookings, query, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteBooking(deleteTarget._id);
      if (res.success) {
        toast.success("Booking deleted");
        setDeleteTarget(null);
        if (selected?._id === deleteTarget._id) setSelected(null);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete booking");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, field: "status" | "paymentStatus", value: string) => {
    setUpdating(true);
    try {
      const res = await updateBooking(bookingId, { [field]: value });
      if (res.success) {
        toast.success("Booking updated!");
        router.refresh();
        if (selected && selected._id === bookingId) {
          setSelected({ ...selected, [field]: value } as Booking);
        }
      } else {
        toast.error(res.message || "Failed to update booking");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-4 md:p-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Bookings</h1>
            <p className="text-sm text-slate-500">
              Manage all bookings, update status and payment info.
            </p>
          </div>
          <div className="text-sm text-slate-500 self-end">
            Total:{" "}
            <span className="font-medium text-slate-900">{bookings.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="name, email, car, status..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  statusFilter === s
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500 ml-auto">
            Showing <span className="font-medium text-slate-900">{filtered.length}</span>
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{booking.userName || "—"}</div>
                    <div className="text-xs text-slate-500">{booking.userEmail || booking.userClerkId}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{booking.car?.name || "—"}</div>
                    <div className="text-xs text-slate-500">
                      {booking.car?.brand} {booking.car?.model}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    <div>{fmt(booking.startDate)}</div>
                    <div className="text-xs text-slate-500">→ {fmt(booking.endDate)}</div>
                    <div className="text-xs text-slate-400">{booking.totalDays}d</div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {fmtMoney(booking.totalAmount, booking.currency)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusDropdown
                      value={booking.status}
                      options={["pending", "confirmed", "completed", "cancelled"]}
                      badgeFn={statusBadge}
                      disabled={updating}
                      onChange={(v) => handleStatusUpdate(booking._id, "status", v)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <StatusDropdown
                      value={booking.paymentStatus}
                      options={["unpaid", "paid", "refunded", "failed"]}
                      badgeFn={paymentBadge}
                      disabled={updating}
                      onChange={(v) => handleStatusUpdate(booking._id, "paymentStatus", v)}
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelected(booking)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteTarget(booking)}
                        className="px-2 py-1.5 rounded-md text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          onClick={() => !updating && setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Booking Details</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{selected._id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Customer + Car */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoBlock icon={<User className="h-4 w-4" />} label="Customer">
                  <p className="font-medium text-slate-900">{selected.userName || "—"}</p>
                  <p className="text-xs text-slate-500">{selected.userEmail}</p>
                  <p className="text-xs text-slate-400 font-mono">{selected.userClerkId}</p>
                </InfoBlock>
                <InfoBlock icon={<Package className="h-4 w-4" />} label="Car">
                  <p className="font-medium text-slate-900">{selected.car?.name || "—"}</p>
                  <p className="text-xs text-slate-500">
                    {selected.car?.brand} {selected.car?.model}
                  </p>
                  <p className="text-xs text-slate-400">{fmtMoney(selected.car?.pricePerDay, selected.currency)}/day</p>
                </InfoBlock>
              </div>

              {/* Dates */}
              <InfoBlock icon={<CalendarDays className="h-4 w-4" />} label="Dates">
                <div className="flex gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-slate-500">Start</p>
                    <p className="font-medium text-slate-900">{fmt(selected.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">End</p>
                    <p className="font-medium text-slate-900">{fmt(selected.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="font-medium text-slate-900">{selected.totalDays} days</p>
                  </div>
                </div>
              </InfoBlock>

              {/* Pickup / dropoff */}
              <InfoBlock icon={<MapPin className="h-4 w-4" />} label="Pickup / Dropoff">
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-xs text-slate-500">Pickup</p>
                    <p className="text-sm text-slate-900">
                      {[selected.pickup?.addressLine, selected.pickup?.city, selected.pickup?.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Dropoff</p>
                    <p className="text-sm text-slate-900">
                      {[selected.dropoff?.addressLine, selected.dropoff?.city, selected.dropoff?.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                </div>
              </InfoBlock>

              {/* Payment */}
              <InfoBlock icon={<CreditCard className="h-4 w-4" />} label="Payment">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="font-semibold text-slate-900">{fmtMoney(selected.totalAmount, selected.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Security Deposit</p>
                    <p className="text-sm text-slate-900">{fmtMoney(selected.securityDeposit, selected.currency)}</p>
                  </div>
                  {selected.paymentId && (
                    <div>
                      <p className="text-xs text-slate-500">Payment ID</p>
                      <p className="text-xs font-mono text-slate-700">{selected.paymentId}</p>
                    </div>
                  )}
                </div>
              </InfoBlock>

              {/* Add-ons */}
              {selected.addOns?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-2">Add-ons</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.addOns.map((a, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                        {a.name} — {fmtMoney(a.price, selected.currency)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.notes && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Notes</p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2">{selected.notes}</p>
                </div>
              )}

              {/* Actions in modal */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500 uppercase mb-3">Admin Actions</p>
                <div className="flex flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Booking Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                        <button
                          key={s}
                          disabled={updating || selected.status === s}
                          onClick={() => handleStatusUpdate(selected._id, "status", s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                            ${selected.status === s
                              ? "ring-2 ring-slate-900 " + statusBadge(s)
                              : statusBadge(s) + " hover:opacity-80"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Payment Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {["unpaid", "paid", "refunded", "failed"].map((s) => (
                        <button
                          key={s}
                          disabled={updating || selected.paymentStatus === s}
                          onClick={() => handleStatusUpdate(selected._id, "paymentStatus", s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                            ${selected.paymentStatus === s
                              ? "ring-2 ring-slate-900 " + paymentBadge(s)
                              : paymentBadge(s) + " hover:opacity-80"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          onClick={() => !deleting && setDeleteTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
          >
            <div className="bg-rose-50 px-6 pt-6 pb-4 flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-rose-100">
                <Trash className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Delete Booking</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-700">
                    {deleteTarget.userName || deleteTarget.userEmail} — {deleteTarget.car?.name}
                  </span>
                </p>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-600">
                This will permanently remove the booking. This action{" "}
                <span className="font-medium text-slate-900">cannot be undone</span>.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-5">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 transition disabled:opacity-70 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Deleting…
                  </>
                ) : (
                  "Delete Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// small reusable info block
function InfoBlock({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase mb-2">
        {icon}
        {label}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

// inline status dropdown
function StatusDropdown({
  value,
  options,
  badgeFn,
  disabled,
  onChange,
}: {
  value: string;
  options: string[];
  badgeFn: (s: string) => string;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative inline-block">
      <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badgeFn(value)}`}>
        <span>{value}</span>
        <ChevronDown className="h-3 w-3" />
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
