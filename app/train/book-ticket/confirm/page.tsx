"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeftLong, FaTrain, FaUserGroup } from "react-icons/fa6";
import Image from "next/image";
import { Calendar, CreditCard, ShieldCheck, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const ads = [
  { src: "/book3.jpg", text: "Safe & Secure Rail Journeys" },
  { src: "/book2.webp", text: "Experience Luxury in First Class" },
];
export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfirmBookingInner />
    </Suspense>
  );
}

function ConfirmBookingInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Params
  const trainNo = searchParams.get("trainNo");
  const date = searchParams.get("date");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const cls = searchParams.get("class");

  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [passengers, setPassengers] = useState([{ name: "", age: "", gender: "MALE" }]);
  const [agreed, setAgreed] = useState(false);

  // Fetch Preview Data (Your API)
  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await fetch("/api/train/book-ticket/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trainNo, date, from, to, class: cls }),
        });
        const data = await res.json();
        console.log("Preview Data:", data);

        // Setting the nested 'preview' object from your response
        if (data.success) {
          setPreview(data.preview);
        }
      } catch (err) {
        toast.error("Failed to load journey details");
      } finally {
        setLoading(false);
      }
    }
    fetchPreview();
  }, [trainNo, date, from, to, cls]);

  // Logic for calculations based on your API structure
  const ticketFare = preview?.fareDetails?.total || 0;
  const totalPayable = ticketFare * passengers.length;

  // Initiate Booking (Your API)
  const handleBooking = async () => {
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/train/book-ticket/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainNo,
          date,
          from,
          to,
          class: cls,
          passengers,
        }),
      });
      const data = await res.json();
      console.log("initaite payment", data);
      if (data.paymentUrl) {
        toast.success("Redirecting to Payment...");
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || "Booking failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const addPassenger = () => {
    if (passengers.length < 6) {
      setPassengers([...passengers, { name: "", age: "", gender: "MALE" }]);
    } else {
      toast.error("Max 6 passengers allowed");
    }
  };

  const removePassenger = (index: number) => {
    const copy = [...passengers];
    copy.splice(index, 1);
    setPassengers(copy);
  };

  if (loading)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 gap-6">
      <Image
        src="/loader3.gif"
        alt="Loading"
        width={180}
        height={180}
        priority
        className="object-contain w-[30vh] sm:w-[40vw] mix-blend-multiply opacity-90"
      />

      <p className="text-blue-900 font-semibold tracking-wide">
        Initiating booking...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f6ff] overflow-x-hidden pb-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition"
      >
        <FaArrowLeftLong className="text-white text-lg" />
      </button>

      {/* Header - EXACT SAME UI */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <Image
            src="/irctc_logo_2.png"
            alt="IRCTC Logo"
            width={40}
            height={40}
            className="rounded-full bg-white p-0.5"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Review Your Booking
            </h1>
            <p className="text-sm opacity-90 uppercase tracking-wider">
              {preview?.train?.name} — {preview?.train?.no}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 space-y-6">
        {/* Carousel - UNCOMMENTED AND RESTORED */}
        {/* <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            className="w-full h-50 sm:h-60"
          >
            {ads.map((ad, index) => (
              <SwiperSlide key={index} className="relative">
                <Image src={ad.src} alt="Ad" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <p className="text-white text-xl sm:text-5xl font-bold text-center px-6 ">
                    {ad.text}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div> */}

        {/* Booking Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">

          {/* Journey Summary Section */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-900">
              <FaTrain size={18} /> Journey Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Route</p>
                <p className="font-bold">{preview?.journey?.from} → {preview?.journey?.to}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Date & Class</p>
                <p className="font-bold">{preview?.journey?.date} | {preview?.journey?.coach}</p>
              </div>
            </div>
          </div>

          {/* Passenger Details Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-blue-900">
                <FaUserGroup size={18} /> Passenger Details
              </h2>
              <button
                onClick={addPassenger}
                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
              >
                + Add New
              </button>
            </div>

            <div className="space-y-4">
              {passengers.map((p, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 border rounded-xl relative group">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Name</label>
                    <input
                      type="text"
                      placeholder="Passenger Name"
                      className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 bg-slate-50"
                      value={p.name}
                      onChange={(e) => {
                        const copy = [...passengers];
                        copy[i].name = e.target.value.toUpperCase();
                        setPassengers(copy);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Age</label>
                    <input
                      type="number"
                      placeholder="Age"
                      className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 bg-slate-50"
                      value={p.age}
                      onChange={(e) => {
                        const copy = [...passengers];
                        copy[i].age = e.target.value;
                        setPassengers(copy);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Gender</label>
                    <select
                      className="w-full border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 bg-slate-50 appearance-none"
                      value={p.gender}
                      onChange={(e) => {
                        const copy = [...passengers];
                        copy[i].gender = e.target.value;
                        setPassengers(copy);
                      }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  {i > 0 && (
                    <button
                      onClick={() => removePassenger(i)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fare Summary Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 font-medium">Ticket Fare ({passengers.length} × ₹{ticketFare})</span>
              <span className="font-bold">₹{totalPayable}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-blue-900">
              <span>Total Payable</span>
              <span>₹{totalPayable}</span>
            </div>
          </div>

          {/* Declaration Section - EXACT SAME UI */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-medium mb-1 text-yellow-800 flex items-center gap-2">
              <ShieldCheck size={16} /> Important Declaration
            </p>
            <ul className="list-disc ml-4 space-y-1 text-gray-700 text-[11px] leading-relaxed">
              <li>Carry original Identity Proof during the journey.</li>
              <li>Booking is subject to availability at the time of transaction.</li>
              <li>Tickets are non-transferable as per Railway rules.</li>
            </ul>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="agree"
                className="cursor-pointer w-4 h-4"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="agree" className="text-xs cursor-pointer font-medium text-slate-600">
                I agree to the terms and conditions.
              </label>
            </div>
          </div>

          {/* CTA - EXACT SAME UI */}
          <button
            disabled={submitting}
            className={`w-full ${submitting ? 'bg-slate-400' : 'bg-orange-500 hover:bg-orange-600'} transition text-white py-4 rounded-xl font-bold shadow-md active:scale-[0.98] flex items-center justify-center gap-2`}
            onClick={handleBooking}
          >
            <CreditCard size={18} />
            {submitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}