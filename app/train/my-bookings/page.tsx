"use client";

import { useEffect, useState, useMemo } from "react";
import { Printer, ChevronLeft, TrainFront } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL JOURNEYS");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/train/bookings");
        const data = await res.json();
        setBookings(data || []);
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // --- Helper: Get Feasible Date ---
  // Agar journeyDate nahi hai toh bookedAt use karega (No more N/A)
  const getBookingDateObj = (booking: any) => {
    const rawDate = booking.journeyDate || booking.bookedAt;
    return rawDate ? new Date(rawDate) : new Date();
  };

  // --- Filter Logic ---
  const filteredBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const journeyDate = getBookingDateObj(booking);
      journeyDate.setHours(0, 0, 0, 0);

      if (activeTab === "UPCOMING") {
        return journeyDate >= today && booking.status !== "CANCELLED";
      }
      if (activeTab === "PAST JOURNEYS") {
        // Purani dates ya cancelled tickets past mein dikhayenge
        return journeyDate < today || booking.status === "CANCELLED";
      }
      return true; // ALL JOURNEYS
    });
  }, [bookings, activeTab]);

  const handlePrintNavigation = (pnr: string) => {
    router.push(`/train/print-ticket?pnr=${pnr}`);
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fb792b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans antialiased">
      {/* Sticky Header with Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center px-2 md:px-4">
          <button onClick={() => router.back()} className="mr-2 p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {["ALL JOURNEYS", "UPCOMING", "PAST JOURNEYS"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-[11px] md:text-sm font-bold tracking-tight whitespace-nowrap transition-all border-b-[3px] ${
                  activeTab === tab 
                  ? "border-[#fb792b] text-black" 
                  : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-3 md:p-6 space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <TrainFront className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No journeys found in {activeTab.toLowerCase()}.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const dateObj = getBookingDateObj(booking);
            const dateStr = dateObj.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            });

            return (
              <div key={booking.id} className="bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Header: Train Name & PNR */}
                <div className="bg-[#fcfcfc] px-4 py-2.5 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-bold text-[#4a4a4a] text-sm md:text-base uppercase truncate pr-2">
                    {booking.schedule.train.name} ({booking.schedule.train.trainNo})
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#fb792b] font-bold text-xs md:text-sm">PNR: {booking.pnr}</span>
                    <button onClick={() => handlePrintNavigation(booking.pnr)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <Printer size={18} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Body: Stations & Time */}
                <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="w-full md:w-auto">
                    <p className="text-base md:text-lg font-bold text-gray-800">
                      {booking.schedule.train.departureTime} | {booking.fromStation.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">{dateStr}</p>
                  </div>

                  {/* Route Line */}
                  <div className="hidden md:flex items-center flex-1 max-w-[150px] px-4">
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                    <div className="h-2 w-2 rounded-full border border-gray-300 mx-1"></div>
                    <div className="h-[1px] bg-gray-200 flex-1"></div>
                  </div>

                  <div className="w-full md:w-auto text-left md:text-right">
                    <p className="text-base md:text-lg font-bold text-gray-800">
                      {booking.schedule.train.arrivalTime} | {booking.toStation.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">{dateStr}</p>
                  </div>
                </div>

                {/* Footer: Status & Class */}
                <div className="bg-gray-50/50 px-4 py-2 flex justify-between items-center border-t border-gray-100">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${
                     booking.status === 'CANCELLED' 
                     ? "bg-red-50 text-red-700 border-red-100" 
                     : "bg-[#e7f3ef] text-[#2e7d32] border-[#c8e6c9]"
                   }`}>
                    {booking.status}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">CLASS: {booking.schedule.train.type}</span>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}