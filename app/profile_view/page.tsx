"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, ChevronLeft } from "lucide-react";

import { data } from "@/Data/India-State-District";

/* ---------------- TYPES ---------------- */

type IdCardType = "AADHAR" | "PAN" | "PASSPORT" | "";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  pincode: string;
  idType: string;
  idNumber: string;
  kycVerified: boolean;
};

type StatesMap = Record<string, string[]>;

/* ---------------- COMPONENT ---------------- */

export default function ProfileView() {
  const router = useRouter();
  const { isLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Profile | null>(null);

  /* ---------------- STATE -> DISTRICT MAP ---------------- */

  const statesMap: StatesMap = useMemo(() => {
    const map: StatesMap = {};
    (data as any[]).forEach((item) => {
      const state = item.StateName;
      const district = item["DistrictName(InEnglish)"];
      if (!map[state]) map[state] = [];
      if (!map[state].includes(district)) map[state].push(district);
    });
    return map;
  }, []);

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile_view");

        if (!res.ok) throw new Error();

        const data = await res.json();
        setForm(data);
      } catch {
        toast.error("Profile not found. Complete setup first.");
        router.push("/profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  /* ---------------- SAVE ---------------- */

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);

    const res = await fetch("/api/profile_view", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Profile updated successfully");
    } else {
      toast.error("Update failed");
    }

    setSaving(false);
  }

  /* ---------------- UI STATES ---------------- */

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) return null;

  const input =
    "p-3 border border-gray-300 text-sm rounded-lg w-full focus:ring-2 focus:ring-indigo-500";

  const button =
    "p-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition";

  const cities = form.state ? statesMap[form.state] || [] : [];

  /* ---------------- UI ---------------- */

  return (
    <div className="p-10 max-w-3xl mx-auto shadow-xl rounded-xl bg-white">
      {/* BACK BUTTON */}
      <button 
        onClick={() => router.back()} 
        className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 flex items-center gap-1 group"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium hidden sm:inline">Back</span>
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Image src="/irctc_logo_2.png" alt="logo" width={50} height={50} />
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Image src="/logo3.png" alt="logo" width={30} height={30} />
      </div>

      <form onSubmit={handleSave} className="grid gap-8">

        {/* BASIC INFO */}
        <section>
          <h3 className="text-lg font-bold text-indigo-700 mb-3 border-b pb-2">
            Basic Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              className={input}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Full Name"
            />

            <input
              className={input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />

            <input
              className={input}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone"
            />

            <select
              className={input}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </section>

        {/* ADDRESS */}
        <section>
          <h3 className="text-lg font-bold text-indigo-700 mb-3 border-b pb-2">
            Address Details
          </h3>

          <div className="grid gap-4">
            <input
              className={input}
              value={form.addressLine1}
              onChange={(e) =>
                setForm({ ...form, addressLine1: e.target.value })
              }
              placeholder="Address Line 1"
            />

            <input
              className={input}
              value={form.addressLine2}
              onChange={(e) =>
                setForm({ ...form, addressLine2: e.target.value })
              }
              placeholder="Address Line 2"
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <select
                className={input}
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value, city: "" })
                }
              >
                <option value="">State</option>
                {Object.keys(statesMap).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <select
                className={input}
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              >
                <option value="">City</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                className={input}
                value={form.pincode}
                onChange={(e) =>
                  setForm({ ...form, pincode: e.target.value })
                }
                placeholder="Pincode"
              />
            </div>
          </div>
        </section>

        {/* KYC */}
        <section>
          <h3 className="text-lg font-bold text-indigo-700 mb-3 border-b pb-2 flex items-center gap-2">
            Identity Verification
            {form.kycVerified && (
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle size={16} />
                Verified
              </span>
            )}
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <select
              className={input}
              value={form.idType}
              onChange={(e) =>
                setForm({ ...form, idType: e.target.value })
              }
            >
              <option value="">ID Type</option>
              <option value="AADHAR">Aadhaar</option>
              <option value="PAN">PAN</option>
              <option value="PASSPORT">Passport</option>
            </select>

            <input
              className={input}
              value={form.idNumber}
              onChange={(e) =>
                setForm({ ...form, idNumber: e.target.value })
              }
              placeholder="ID Number"
            />
          </div>
        </section>

        {/* SAVE */}
        <button disabled={saving} className={button}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
