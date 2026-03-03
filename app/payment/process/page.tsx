"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard, Loader2, ShieldCheck, Train,
  RefreshCw, CheckCircle2, ChevronRight, Landmark, User, Armchair
} from "lucide-react";
import toast from "react-hot-toast";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <PaymentProcessPage />
    </Suspense>
  );
}

function PaymentProcessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [captcha, setCaptcha] = useState("");
  const [userInputCaptcha, setUserInputCaptcha] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
    async function fetchPaymentDetails() {
      if (!bookingId) return;
      try {
        const res = await fetch(`/api/payment/details?bookingId=${bookingId}`);
        const data = await res.json();
        if (res.ok) setDetails(data);
        else toast.error("Booking not found");
      } catch (err) {
        toast.error("Error loading payment info");
      } finally {
        setLoading(false);
      }
    }
    fetchPaymentDetails();
  }, [bookingId]);

  const handlePay = async () => {
    if (userInputCaptcha.toUpperCase() !== captcha.toUpperCase()) {
      toast.error("Invalid Captcha!");
      generateCaptcha();
      setUserInputCaptcha("");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/payment/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId,
          amount: details.amount,
          pnr: details.pnr,
          origin: details.book.fromStation.name,
          destination: details.book.toStation.name,
          transactionId: details.gatewayTransactionId,
          
        }),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Session failed");
    } catch (err: any) {
      toast.error(err.message || "Payment Failed");
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
      <p className="text-slate-500 text-sm font-medium">Securing session...</p>
    </div>
  );

  return (
    <div className="min-h-screen inset-0 z-0
      bg-[conic-gradient(from_180deg_at_50%_50%,#4facfe,#00f2fe,#43e97b,#f8ffae,#4facfe)]
    flex items-center justify-center p-0 sm:p-3 font-sans antialiased">
      
      {/* Outer Wrapper for Image + Form Split */}
      <div className="flex w-full max-w-5xl bg-white sm:rounded-[1.5rem] shadow-2xl overflow-hidden min-h-screen sm:min-h-0">
        
        {/* LEFT SIDE: Image (Hidden on Mobile, Visible on LG screens) */}
        <div className="hidden lg:block w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?q=80&w=1974&auto=format&fit=crop" 
            alt="Railway" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/20 backdrop-brightness-75" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-3xl font-bold leading-tight">Secure & Swift <br/>Rail Ticketing</h2>
            <p className="mt-2 text-blue-50/80 text-sm font-medium">Trusted by travelers for seamless journeys across the country.</p>
          </div>
        </div>

        {/* RIGHT SIDE: Your original Form UI (Untouched) */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="w-full flex flex-col min-h-screen sm:min-h-0">
            
            {/* Header */}
            <div className="bg-gradient-to-b from-[#0644d4] via-[#1b55d1] to-[#24a5f6] px-6 py-8 sm:p-10 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 uppercase font-black text-6xl select-none">Rail</div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                  <ShieldCheck size={14} className="text-green-400" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Secure Payment</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight">₹{details?.amount}</h1>
                <p className="text-blue-100/70 text-xs font-medium uppercase tracking-widest">Payable Amount</p>
              </div>
            </div>

            <div className="flex-1 p-6 sm:p-10 space-y-8 bg-white">
              {/* Journey Section */}
              <div className="flex items-center justify-between px-2">
                <div className="text-left">
                  <p className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tighter leading-none">{details?.book?.fromStationId}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{details?.book?.fromStation?.name || 'Origin'}</p>
                </div>

                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="flex items-center w-full">
                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                    <div className="flex-1 h-[1px] bg-slate-100 mx-2" />
                    <Train size={16} className="text-slate-300" />
                    <div className="flex-1 h-[1px] bg-slate-100 mx-2" />
                    <div className="h-1 w-1 rounded-full bg-slate-200" />
                  </div>
                  <p className="mt-2 text-[10px] font-semibold text-blue-600/80 tracking-widest uppercase">
                    {new Date(details?.book?.journeyDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tighter leading-none">{details?.book?.toStationId}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{details?.book?.toStation?.name || 'Dest'}</p>
                </div>
              </div>

              {/* Passenger Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={13} className="text-blue-500" /> Passenger Details
                  </label>
                </div>
                <div className="space-y-2">
                  {details?.book?.passengers?.map((p: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-sm font-semibold text-slate-700 block tracking-tight">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {p.age} Yrs | {p.gender}
                        </span>
                      </div>
                      <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.status === 'CONFIRMED' ? ' text-green-600' : ' text-amber-600'}`}>
                        {p.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="text-xs font-medium text-slate-600 font-mono truncate tracking-tight">
                    {details?.data?.gatewayTransactionId || `TXN_${details?.book?.id}`}
                  </p>
                </div>
                <div className="p-4 bg-slate-50/30 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Coach Class</p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Armchair size={14} className="text-blue-500" />
                    <span>{details?.book?.trainInstance?.coachType} Class</span>
                  </div>
                </div>
              </div>

              {/* Captcha */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="relative group flex-1">
                    <input
                      type="text"
                      value={userInputCaptcha}
                      onChange={(e) => setUserInputCaptcha(e.target.value)}
                      placeholder="Security Code"
                      className="w-full bg-slate-50 border border-slate-200 h-12 px-5 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-blue-500 focus:ring-0 transition-all uppercase tracking-widest"
                    />
                  </div>
                  <div className="relative shrink-0 flex items-center">
                    <div className="h-12 bg-slate-900 text-white px-6 flex items-center justify-center rounded-xl font-mono font-bold italic text-lg tracking-[0.2em] select-none shadow-md">
                      {captcha}
                    </div>
                    <button
                      onClick={generateCaptcha}
                      className="absolute -top-2 -right-2 bg-white text-blue-600 p-1.5 rounded-full shadow-md border border-slate-100 hover:text-blue-700 active:rotate-180 transition-all duration-300"
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={handlePay}
                  disabled={processing || userInputCaptcha.length < 4}
                  className={`w-full h-14 rounded-2xl font-semibold text-sm tracking-widest transition-all flex items-center justify-center gap-3
                    ${processing || userInputCaptcha.length < 4
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#ff6d00] text-white hover:bg-[#ef6c00] active:scale-[0.99] shadow-lg shadow-orange-200'}`}
                >
                  {processing ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>PROCEED TO PAYMENT <ChevronRight size={16} /></>
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center opacity-40 grayscale pb-6">
                  <div className="flex items-center gap-1.5">
                    <Landmark size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-widest italic">Stripe Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-widest italic">PCI-DSS Ready</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[9px] font-medium text-slate-300 uppercase tracking-[0.4em] mb-1">Architecture by</p>
                  <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
                    Dhananjai Pratap Singh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}