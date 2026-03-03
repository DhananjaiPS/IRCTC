"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FaTrain, FaPrint, FaCheckCircle, FaStar, FaHome } from "react-icons/fa";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function TicketPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // Review States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const status = searchParams.get("status");

  // 1. Fetch Ticket logic ko ek function mein dala taaki verify ke baad call ho sake
  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/booking/details?bookingId=${id}`);
      const data = await res.json();
      if (res.ok) {
        setTicket(data);
        // Show review modal after a short delay if booking is confirmed
        if (data.status === "BOOKED") {
          setTimeout(() => setShowReviewModal(true), 1500);
        }
      }
    } catch (err) {
      toast.error("Error loading ticket");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 2. Logic Change: Pehle Verify, Phir Fetch
  useEffect(() => {
    const processVerification = async () => {
      if (status === "success") {
        setVerifying(true);
        try {
          const res = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: id,
              status: "SUCCESS"
            }),
          });
          const data = await res.json();
          if (data.success) {
            toast.success("Payment Verified & Seat Allocated!");
            await fetchTicket(); // Seat allot hone ke baad data refresh
          } else {
            throw new Error(data.error);
          }
        } catch (err: any) {
          toast.error(err.message || "Verification Failed");
          fetchTicket();
        } finally {
          setVerifying(false);
        }
      } else {
        fetchTicket(); // Agar direct visit hai
      }
    };

    if (id) processVerification();
  }, [id, status, fetchTicket]);

  const handlePrintNavigation = (pnr: string) => {
    router.push(`/train/print-ticket?pnr=${pnr}`);
  };

  const submitReview = async () => {
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: `Journey on ${ticket.schedule.train.name}`,
          comment,
          trainId: ticket.schedule.train.id,
        }),
      });
      if (res.ok) {
        toast.success("Thank you for your feedback!");
        setShowReviewModal(false);
      }
    } catch (err) {
      toast.error("Failed to save review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || verifying) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      
      {/* Coin Image - Mobile par small, Desktop par bada */}
      <img 
        src="/coin2.gif" 
        alt="Processing Coin" 
        className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] object-contain relative z-10 transition-transform duration-500" 
      />
      
      {/* Text - Perfectly 20px above its natural position */}
      <div className="relative z-20 -mt-8 sm:-mt-10 text-center px-6">
        <p className="text-slate-700 text-lg sm:text-xl font-semibold tracking-tight">
          {verifying ? "Verifying Payment & Allocating Seats..." : "Loading Ticket..."}
        </p>
        
        {/* Sub-text for better UX */}
        <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-[0.3em] animate-pulse">
          Please wait a moment
        </p>
      </div>

    </div>
  );
}

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 relative">
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-slate-700"
      >
        <FaHome className="text-blue-600" /> <span className="hidden sm:inline">Home</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <FaCheckCircle className="text-green-500 text-5xl mb-3" />
          <h1 className="text-2xl font-bold text-slate-800">Booking Confirmed!</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-blue-600">
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-dashed border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm sm:text-[20px] font-black text-slate-400 uppercase">PNR NUMBER</p>
                <p className="text-sm sm:text-[20px]  font-black text-blue-900">{ticket.pnr}</p>
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-[20px]  font-black text-slate-400 uppercase">TRAIN</p>
                <p className="font-bold text-sm sm:text-[20px] ">{ticket.schedule.train.trainNo} - {ticket.schedule.train.name}</p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold">{ticket.fromStation.id}</p>
              <p className="text-xs text-slate-500">{ticket.fromStation.name}</p>
            </div>
            <div className="flex flex-col items-center">
              <FaTrain className="text-slate-300" size={24} />
              <div className="w-full border-t border-dotted border-slate-300 my-2"></div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-2xl font-bold">{ticket.toStation.id}</p>
              <p className="text-xs text-slate-500">{ticket.toStation.name}</p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="bg-slate-50 rounded-2xl p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black">
                    <th className="text-left">Passenger</th>
                    <th className="text-center">Seat</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.passengers.map((p: any, i: number) => {
                    const mapping = ticket.seatAvailabilities?.find(
                      (m: any) => m.passengerId?.toString() === p.id?.toString()
                    );
                    const allottedSeat = mapping?.seat;
                    const isConfirmed = !!allottedSeat;

                    return (
                      <tr key={i} className="border-t border-slate-200">
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3 text-center text-slate-700 font-bold">
                          {isConfirmed ? (
                            `${allottedSeat.coach.coachNumber}/${allottedSeat.seatNo} (${allottedSeat.berthType[0]})`
                          ) : (
                            "WL"
                          )}
                        </td>
                        <td className={`py-3 text-right font-bold ${isConfirmed ? 'text-green-600' : 'text-orange-500'}`}>
                          {isConfirmed ? "CONFIRMED" : (p.status || "WAITLIST")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 p-6 flex justify-between items-center">
            <div className="text-white">
              <p className="text-[10px] opacity-50 font-bold uppercase">Paid Amount</p>
              <p className="text-xl font-bold">₹{ticket.totalFare}</p>
            </div>
            <button onClick={() => handlePrintNavigation(ticket.pnr)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
              <FaPrint /> Print
            </button>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Rate Your Experience</h2>
              <p className="text-slate-500 text-sm mt-1">How was your booking journey?</p>
            </div>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <FaStar size={32} className={star <= rating ? "text-yellow-400" : "text-slate-200"} />
                </button>
              ))}
            </div>
            <textarea
              className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-blue-500 min-h-[100px] bg-slate-50"
              placeholder="Write a short review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={submitReview}
              disabled={submittingReview}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:bg-slate-300"
            >
              {submittingReview ? "Saving..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}