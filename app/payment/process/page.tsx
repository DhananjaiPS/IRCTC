"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCard, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
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

  useEffect(() => {
    async function fetchPaymentDetails() {
      try {
        const res = await fetch(`/api/payment/details?bookingId=${bookingId}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) setDetails(data);

        else toast.error("Booking not found");
      } catch (err) {
        toast.error("Error loading payment info");
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) fetchPaymentDetails();
  }, [bookingId]);

  // const handlePay = async () => {
  //   setProcessing(true);
  //   try {
  //     const res = await fetch("/api/payment/verify", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ bookingId, status: "SUCCESS" }),
  //     });

  //     const data = await res.json();
  //     console.log(data);
  //     if (data.success) {
  //       toast.success("Payment Successful!");
  //       router.push(`/booking/ticket/${bookingId}`);
  //     } else {
  //       throw new Error(data.error);
  //     }
  //   } catch (err: any) {
  //     toast.error(err.message || "Payment Failed");
  //   } finally {
  //     setProcessing(false);
  //   }
  // };
  // handlePay function ko replace karo isse:
const handlePay = async () => {
  setProcessing(true);
  try {
    // 1. Stripe Session create karne ki request
    const res = await fetch("/api/payment/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        bookingId, 
        amount: details?.amount, 
        pnr: details?.pnr 
      }),
    });

    const data = await res.json();
    
    if (data.url) {
      // 2. Stripe ke secure page par redirect kar do
      window.location.href = data.url;
    } else {
      throw new Error(data.error || "Payment session failed");
    }
  } catch (err: any) {
    toast.error(err.message || "Payment Failed");
    setProcessing(false); // Sirf error case mein loading stop karo
  }
};

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <CreditCard className="mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
          <p className="opacity-80">PNR: {details?.pnr}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-slate-500">Total Payable</span>
            <span className="text-2xl font-black text-blue-900">₹{details?.amount}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <ShieldCheck className="text-green-500" size={18} />
              SSL Encrypted Transaction
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <CheckCircle2 className="text-green-500" size={18} />
              Verified by RailAuth
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {processing ? <Loader2 className="animate-spin" /> : "Pay Securely Now"}
          </button>
        </div>
      </div>
    </div>
  );
}