"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaTrain, FaPrint, FaCheckCircle, FaStar, FaHome } from "react-icons/fa";
import { Loader2, Clock, X } from "lucide-react";
import toast from "react-hot-toast";

export default function TicketPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Review States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const handlePrintNavigation = (pnr: string) => {
    router.push(`/train/print-ticket?pnr=${pnr}`);
  };
  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/booking/details?bookingId=${id}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setTicket(data);
          // Show review modal after a short delay if booking is confirmed
          setTimeout(() => setShowReviewModal(true), 1500);
        }
      } catch (err) {
        toast.error("Error loading ticket");
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id]);

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

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 relative">
      {/* Navigation: Home Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-slate-700"
      >
        <FaHome className="text-blue-600" /> <span className="hidden sm:inline">Home</span>
      </button>

      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <FaCheckCircle className="text-green-500 text-5xl mb-3" />
          <h1 className="text-2xl font-bold text-slate-800">Booking Confirmed!</h1>
        </div>

        {/* Ticket Card */}
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
                    // 🔍 Print Ticket wala logic yahan bhi apply hoga
                    // Hum check kar rahe hain ki seatAvailabilities mein is passengerId ka koi record hai?
                    const mapping = ticket.seatAvailabilities?.find(
                      (m: any) => m.passengerId?.toString() === p.id?.toString()
                    );

                    const allottedSeat = mapping?.seat;
                    const isConfirmed = !!allottedSeat;

                    return (
                      <tr key={i} className="border-t border-slate-200">
                        <td className="py-3 font-medium">{p.name}</td>

                        {/* Seat mapping display */}
                        <td className="py-3 text-center text-slate-700 font-bold">
                          {isConfirmed ? (
                            `${allottedSeat.coach.coachNumber}/${allottedSeat.seatNo} (${allottedSeat.berthType[0]})`
                          ) : (
                            "WL"
                          )}
                        </td>

                        {/* Status display logic */}
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

      {/* Review Modal */}
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