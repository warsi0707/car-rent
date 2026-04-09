"use client";
import LogFormInput from "@/components/LogFormInput";
import { signIn } from "@/server/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignin = async () => {
    try {
      const res = await signIn(formData)
      console.log(res)
      if(res.success){
        toast.success(res.message)
        router.push("/dashboard")
      }else{
        toast.error(res.error)
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen w-full justify-center items-center">
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Sign in
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Manage your rentals
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter your admin credentials to continue.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <LogFormInput
                value={formData.email}
                name="email"
                onChange={handleChange}
                type="email"
                label="Email Address"
              />
              <LogFormInput
                value={formData.password}
                name="password"
                onChange={handleChange}
                type="password"
                label="password"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Remember me
                </label>
                <span className="text-xs text-slate-400">
                  Use 8+ characters
                </span>
              </div>

              <button
                onClick={handleSignin}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Sign in to dashboard
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">New to Carrent?</p>
              <p className="mt-2">
                Ask your admin lead for access or request an invite to join the
                platform.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
