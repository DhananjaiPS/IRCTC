"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [pnr, setPnr] = useState("7402649677");
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
      toast.error("Network error. Please try again." + error);
    } finally {
      setLoading(false);
    }
  };

  {
    !loading && !result && (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="bg-white p-10 rounded-[40px] shadow-xl">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Image src="/no-results.png" width={60} height={60} alt="Error" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Invalid PNR</h3>
          <p className="text-slate-500 text-sm mt-2">
            The PNR <b>{pnr}</b> does not exist in our database or has been flushed from the system.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-8 w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
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

      {/* ================= SYNCED IRCTC STYLE RESULT ================= */}
        {result && (
          <div className="max-w-3xl mx-auto space-y-4 pb-20 animate-in fade-in duration-500 px-0">
            
            {/* Train Header Card - Matches Form Width */}
            <div className="bg-[#003366] rounded-t-xl p-3 flex justify-between items-center text-white shadow-md border-b-2 border-orange-500">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold opacity-80 uppercase leading-none mb-1">Train Details</span>
                <span className="text-sm font-black uppercase tracking-tight">
                  {result.train.no} / {result.train.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold opacity-80 uppercase leading-none mb-1">Class</span>
                <p className="text-xs font-black bg-white text-[#003366] px-2 py-0.5 rounded-sm mt-1 shadow-sm">
                  {result.train.class}
                </p>
              </div>
            </div>

            {/* Journey Info Block - End Date set to Blue */}
            <div className="bg-white border-x border-b border-gray-200 p-5 flex justify-between items-center text-slate-800 shadow-sm rounded-b-xl">
              {/* Departure */}
              <div className="text-center w-28">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-tighter">
                  {new Date(result.journey.departure).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-2xl font-black text-[#003366] leading-none tracking-tighter">{result.journey.from.id}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase truncate mt-1">{result.journey.from.name}</p>
                <p className="mt-2 text-xs font-bold text-gray-700 bg-gray-100 py-1 rounded">
                  {new Date(result.journey.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Center Logic */}
              <div className="flex-1 px-4 flex flex-col items-center">
                <p className="text-[14px] sm:text-[15px] font-bold text-gray-400 italic mb-1 uppercase tracking-tighter">
                  {result.journey.duration}
                </p>
                <div className="w-full h-[1px] bg-gray-300 relative">
                  <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-gray-400"></div>
                  <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[8px] font-black text-green-600 uppercase">
                   {/* <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> */}
                   <span className="text-sm sm:text-[20px]">Confirmed</span>
                </div>
              </div>

              {/* Arrival - Changed Date to Blue */}
              <div className="text-center w-28">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-tighter">
                  {new Date(result.journey.arrival).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-2xl font-black text-[#003366] leading-none tracking-tighter">{result.journey.to.id}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase truncate mt-1">{result.journey.to.name}</p>
                <p className="mt-2 text-xs font-bold text-gray-700 bg-gray-100 py-1 rounded">
                  {new Date(result.journey.arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Passenger Table - Perfect Alignment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Passenger List</span>
                <span className="text-[13px] font-mono font-bold text-blue-800 uppercase tracking-tighter">PNR: {result.pnr}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[9px] font-bold text-gray-400 uppercase border-b">
                    <tr>
                      <th className="p-4">Name / Age / Sex</th>
                      <th className="p-4 text-center">Booking</th>
                      <th className="p-4 text-right">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.passengers.map((p: any, idx: number) => (
                      <tr key={idx} className="text-xs hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800 uppercase tracking-tight">{idx + 1}. {p.name}</p>
                          <p className="text-[9px] text-gray-400 font-medium">{p.age} Yrs | {p.gender}</p>
                        </td>
                        <td className="p-4 text-center text-[10px] font-bold text-gray-400">CNF</td>
                        <td className="p-4 text-right">
                          <p className={`font-black uppercase tracking-tighter ${p.status === 'CONFIRMED' ? 'text-green-600' : 'text-orange-600'}`}>
                            {p.status}
                          </p>
                          <p className="text-[10px] font-mono font-bold text-blue-900 bg-blue-50 border border-blue-100 inline-block px-1 mt-1 rounded leading-none py-1">
                            {p.coach}, {p.seat} ({p.berth})
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Syncing Fare with Form Footer Style */}
            {/* <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 leading-none">Total Fare Amount</p>
                <p className="text-xl font-black text-[#003366]">₹{result.totalFare}.00</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1 leading-none">Transaction Date</p>
                <p className="text-sm font-bold text-gray-700">{new Date(result.bookedAt).toLocaleDateString()}</p>
              </div>
            </div> */}

            {/* Disclaimer */}
            <div className="flex items-center justify-center gap-2 text-gray-400 px-4">
                <div className="h-[1px] flex-1 bg-gray-200"></div>
                <p className="text-[9px] font-bold uppercase tracking-widest italic whitespace-nowrap opacity-60">Chart will be Prepared 4 hours before departure</p>
                <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
