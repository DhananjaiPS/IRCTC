"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [pnr, setPnr] = useState("2144719334");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckPNR = async () => {
    if (pnr.length !== 10) {
      toast.error("PNR must be exactly 10 digits");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/train/pnr-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr }),
      });

      const response = await res.json();
      console.log("API RESPONSE:", response);

      // ✅ Single source of truth
      if (!response.success) {
        toast.error(response.message || "PNR service unavailable");
        return;
      }

      // ✅ Directly set data
      setResult(response.data);

    } catch (error) {
      toast.error("Network error. Please try again."+error);
    } finally {
      setLoading(false);
    }
  };

  {
    !loading && !result && (
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-4 text-sm">
        <p className="font-semibold">PNR Status Unavailable</p>
        <p>
          The entered PNR is either invalid, cancelled, or the service is temporarily blocked.
          Please recheck the PNR number and try again later.
        </p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#f2f6ff] overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-50"
      >
        <FaArrowLeftLong className="text-white text-lg" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <Image
            src="/irctc_logo_2.png"
            alt="IRCTC Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              PNR Status Enquiry
            </h1>
            <p className="text-sm opacity-90">
              Check your current booking status
            </p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="text-sm font-medium text-gray-600">
            Enter 10 Digit PNR Number
          </label>

          <input
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            maxLength={10}
            className="mt-2 w-full border rounded-lg px-4 py-3 text-sm"
            placeholder="e.g. 2144719334"
          />

          <button
            onClick={handleCheckPNR}
            disabled={loading}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
          >
            <Search size={18} />
            {loading ? "Checking..." : "Check PNR Status"}
          </button>
        </div>

        {/* ================= RESULT ================= */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="font-bold text-lg text-blue-900">
              PNR: {result.pnr}
            </h2>

            <p className="font-semibold text-red-600">
              {result.status}
            </p>

            {/* Train */}
            {result?.train && (
              <div className="border-t pt-4">
                <p>
                  <b>Train:</b> {result.train.number} – {result.train.name}
                </p>
                <p>
                  <b>Class:</b> {result.train.class}
                </p>
              </div>
            )}


            {/* Journey */}
            {result.journey && (
              <div className="border-t pt-4">
                <p>
                  <b>From:</b> {result.journey.from?.name} ({result.journey.from?.code})
                </p>
                <p>
                  <b>To:</b> {result.journey.to?.name} ({result.journey.to?.code})
                </p>
                <p>
                  <b>Departure:</b>{" "}
                  {new Date(result.journey.departure).toLocaleString()}
                </p>
                <p>
                  <b>Arrival:</b>{" "}
                  {new Date(result.journey.arrival).toLocaleString()}
                </p>
                <p>
                  <b>Duration:</b> {result.journey.duration}
                </p>
              </div>
            )}

            {/* Chart */}
            {result.chart && (
              <div className="border-t pt-4">
                <p><b>Chart Status:</b> {result.chart.status}</p>
                <p className="text-sm text-gray-600">
                  {result.chart.message}
                </p>
              </div>
            )}

            {/* Passengers */}
            {Array.isArray(result.passengers) && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Passengers</h3>
                {result.passengers.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm border-b py-2"
                  >
                    <span>{p.name}</span>
                    <span className="font-semibold text-red-600">
                      {p.status} ({p.seat})
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 text-right">
              {result.lastUpdated}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
