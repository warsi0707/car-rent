"use client";

import { createAddon, deleteAddon, getAddons, updateAddon } from "@/server/addons";
import { Eye, Pencil, Trash, X, Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export type IAddon = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  status: string;
};

const initialForm: IAddon = { name: "", description: "", price: 0, status: "" };

const statusStyle = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "active") return "bg-emerald-50 text-emerald-700";
  if (s === "inactive") return "bg-slate-100 text-slate-600";
  if (s === "draft") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const FormFields = ({
  data,
  onChange,
}: {
  data: IAddon;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">Name</label>
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={onChange}
        placeholder="e.g. GPS Navigation"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
      />
    </div>
    <div className="flex gap-3">
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-xs font-medium text-slate-600">Price (₹/day)</label>
        <input
          type="number"
          name="price"
          value={data.price}
          onChange={onChange}
          placeholder="0"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-xs font-medium text-slate-600">Status</label>
        <select
          name="status"
          value={data.status}
          onChange={onChange}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
        >
          <option value="">Select status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">Description</label>
      <textarea
        name="description"
        value={data.description}
        onChange={onChange}
        rows={3}
        placeholder="Describe this addon..."
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none resize-none"
      />
    </div>
  </div>
);

export default function page() {
  const [query, setQuery] = useState("");
  const [addons, setAddons] = useState<IAddon[]>([]);
  const [formData, setFormData] = useState<IAddon>(initialForm);

  const [viewAddon, setViewAddon] = useState<IAddon | null>(null);
  const [editAddon, setEditAddon] = useState<IAddon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IAddon | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const [loading, setLoading] = useState(false);

  const filtered = addons.filter((a) =>
    [a.name, a.description, a.status, String(a.price)]
      .join(" ")
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const handleGetAddons = async () => {
    try {
      const res = await getAddons();
      if (res.success) setAddons(res.addons);
    } catch {
      toast.error("Failed to load addons");
    }
  };

  useEffect(() => { handleGetAddons(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditAddon((p) => p ? { ...p, [name]: value } : p);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await createAddon(formData);
      if (res.success) {
        toast.success(res.message || "Addon created");
        setIsPosting(false);
        setFormData(initialForm);
        handleGetAddons();
      } else toast.error(res.message || "Failed to create");
    } catch { toast.error("Error creating addon"); }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!editAddon?._id) return;
    setLoading(true);
    try {
      const res = await updateAddon(editAddon._id, editAddon);
      if (res.success) {
        toast.success(res.message || "Addon updated");
        setEditAddon(null);
        handleGetAddons();
      } else toast.error(res.message || "Failed to update");
    } catch { toast.error("Error updating addon"); }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setLoading(true);
    try {
      const res = await deleteAddon(deleteTarget._id);
      if (res.success) {
        toast.success(res.message || "Addon deleted");
        setDeleteTarget(null);
        handleGetAddons();
      } else toast.error(res.message || "Failed to delete");
    } catch { toast.error("Error deleting addon"); }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Addons</h1>
            <p className="text-sm text-slate-600">Manage car addons and extras.</p>
          </div>
          <button
            onClick={() => { setFormData(initialForm); setIsPosting(true); }}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition cursor-pointer"
          >
            + Create Addon
          </button>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex w-full max-w-md items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Filter</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, status, price..."
              className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{filtered.length}</span> {filtered.length === 1 ? "addon" : "addons"}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((addon) => (
                <tr key={addon._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{addon.name}</td>
                  <td className="px-4 py-4 text-slate-500 max-w-xs truncate">{addon.description}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">₹{addon.price}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle(addon.status)}`}>
                      {addon.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setViewAddon(addon)} className="text-emerald-500 hover:bg-emerald-50 rounded-md p-1 transition">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditAddon(addon)} className="text-slate-600 hover:bg-slate-100 rounded-md p-1 transition">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(addon)} className="text-rose-500 hover:bg-rose-50 rounded-md p-1 transition">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                    No addons found. Try adjusting your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── VIEW POPUP ── */}
      {viewAddon && (
        <div onClick={() => setViewAddon(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-slate-50 px-6 pt-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
                  <Package className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{viewAddon.name}</h2>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyle(viewAddon.status)}`}>
                    {viewAddon.status || "—"}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewAddon(null)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Price per day</span>
                <span className="text-lg font-semibold text-slate-900">₹{viewAddon.price}</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">{viewAddon.description || "No description provided."}</p>
              </div>
              {viewAddon._id && (
                <p className="text-xs text-slate-400">ID: {viewAddon._id}</p>
              )}
            </div>
            <div className="flex justify-end px-6 pb-5">
              <button
                onClick={() => { setViewAddon(null); setEditAddon(viewAddon); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                <Pencil className="w-4 h-4" /> Edit Addon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT POPUP ── */}
      {editAddon && (
        <div onClick={() => !loading && setEditAddon(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Edit Addon</h2>
                <p className="text-xs text-slate-500 mt-0.5">{editAddon.name}</p>
              </div>
              <button onClick={() => setEditAddon(null)} disabled={loading} className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <FormFields data={editAddon} onChange={handleEditChange} />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-5">
              <button
                onClick={() => setEditAddon(null)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-70"
              >
                {loading ? <><Spinner /> Saving…</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE POPUP ── */}
      {deleteTarget && (
        <div onClick={() => !loading && setDeleteTarget(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="bg-rose-50 px-6 pt-6 pb-4 flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 flex-shrink-0">
                <Trash className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Delete Addon</h2>
                <p className="text-sm text-slate-500 mt-0.5 font-medium">{deleteTarget.name}</p>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-slate-600">
                This will permanently remove this addon. This action <span className="font-medium text-slate-900">cannot be undone</span>.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-5">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 transition disabled:opacity-70"
              >
                {loading ? <><Spinner /> Deleting…</> : "Delete Addon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE POPUP ── */}
      {isPosting && (
        <div onClick={() => !loading && setIsPosting(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Create Addon</h2>
                <p className="text-xs text-slate-500 mt-0.5">Add a new addon to the fleet</p>
              </div>
              <button onClick={() => setIsPosting(false)} disabled={loading} className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <FormFields data={formData} onChange={handleChange} />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 pb-5">
              <button
                onClick={() => setIsPosting(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-70"
              >
                {loading ? <><Spinner /> Creating…</> : "Create Addon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
