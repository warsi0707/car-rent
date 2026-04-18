"use client";

import { banUser, unbanUser } from "@/server/users";
import { ShieldOff, ShieldCheck, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface EmailAddress {
  id: string;
  emailAddress: string;
}

interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  username?: string | null;
  imageUrl?: string;
  emailAddresses: EmailAddress[];
  primaryEmailAddressId?: string | null;
  banned?: boolean;
  createdAt?: number;
  lastSignInAt?: number | null;
}

type UsersPageProps = {
  users: User[];
  totalCount: number;
};

const fmt = (ts?: number | null) => {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function UsersPage({ users = [], totalCount = 0 }: UsersPageProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => {
      const primaryEmail =
        u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
          ?.emailAddress ?? u.emailAddresses[0]?.emailAddress ?? "";
      const hay = [
        u.id,
        u.firstName,
        u.lastName,
        u.fullName,
        u.username,
        primaryEmail,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [users, query]);

  const handleBan = async (userId: string, isBanned: boolean) => {
    setActionLoading(userId);
    try {
      const res = isBanned ? await unbanUser(userId) : await banUser(userId);
      if (res.message) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error("Action failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const getEmail = (u: User) =>
    u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
      ?.emailAddress ?? u.emailAddresses[0]?.emailAddress ?? "—";

  const getInitials = (u: User) => {
    const name = u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "?";
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">
            All users registered via the homepage. Total:{" "}
            <span className="font-medium text-slate-900">{totalCount}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
          <Users className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">{users.length} loaded</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex w-full max-w-md items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, ID..."
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm min-w-[640px]">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Last Sign-in</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered?.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullName ?? "user"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                        {getInitials(user)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900">
                        {user.fullName ||
                          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                          user.username ||
                          "—"}
                      </p>
                      <p className="text-xs text-slate-400 font-mono truncate max-w-[140px]">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">{getEmail(user)}</td>
                <td className="px-4 py-4 text-slate-500 text-xs">{fmt(user.createdAt)}</td>
                <td className="px-4 py-4 text-slate-500 text-xs">{fmt(user.lastSignInAt)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.banned
                        ? "bg-rose-50 text-rose-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {user.banned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    disabled={actionLoading === user.id}
                    onClick={() => handleBan(user.id, !!user.banned)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      user.banned
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    {actionLoading === user.id ? (
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : user.banned ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <ShieldOff className="h-3 w-3" />
                    )}
                    {user.banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  {query ? "No users match that search." : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
