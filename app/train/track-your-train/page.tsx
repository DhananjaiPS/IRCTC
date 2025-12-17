"use client";

import { useState } from 'react';
import { FaArrowLeftLong, FaLocationDot, FaCircleCheck, FaClock, FaRoute } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TrainCard from "@/components/ui/TrainCard";
import Image from 'next/image';

export default function SearchTrainPage() {
  const router = useRouter();
  const [trainNo, setTrainNo] = useState("12424");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [liveInfo, setLiveInfo] = useState<{ status: string; update: string } | null>(null);

  const handleSearch = async () => {
    if (trainNo.length !== 5) return toast.error("Enter 5-digit train number");
    
    setLoading(true);
    setResults([]);
    setLiveInfo(null);

    try {
      const formattedDate = date.split('-').reverse().join('-');
      const res = await fetch('/api/train/track-your-train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainNo, date: formattedDate }),
      });
      const data = await res.json();
      console.log(data)
      if (data.success) {
        const t = data.data;
        
        // Setting Live status metadata
        setLiveInfo({
          status: t.statusNote,
          update: t.lastUpdate || "Just now"
        });

        const mappedTrain = {
          trainName: t.trainName,
          trainNo: t.trainNo,
          // Extracting source/dest from the stations array
          from: t.stations[0]?.stationName,
          fromCode: t.stations[0]?.stationCode,
          fromTime: t.stations[0]?.departure?.scheduled.split(' ')[0] || "N/A",
          to: t.stations[t.stations.length - 1]?.stationName,
          toCode: t.stations[t.stations.length - 1]?.stationCode,
          toTime: t.stations[t.stations.length - 1]?.arrival?.scheduled.split(' ')[0] || "N/A",
          duration: t.statusNote.includes("Yet to start") ? "Not Started" : "On Schedule",
          runningDays: "1111111", 
          
          // Detail Mapping for the Route Timeline
          route: t.stations.map((s: any) => ({
            stnName: s.stationName,
            stnCode: s.stationCode,
            // Clean the time strings (removing the date part if present)
            arrival: s.arrival?.actual?.split(' ')[0] || s.arrival?.scheduled?.split(' ')[0],
            departure: s.departure?.actual?.split(' ')[0] || s.departure?.scheduled?.split(' ')[0],
            delay: s.arrival?.delay || s.departure?.delay || "On Time",
            distance: s.distanceKm || "0",
            platform: s.platform || "N/A",
            day: s.arrival?.scheduled?.includes("-") ? "1" : "1", // Logic can be improved based on date
            isCurrent: false // You could logic this based on statusNote
          }))
        };
        
        setResults([mappedTrain]);
        toast.success("Live Status Fetched");
      } else {
        toast.error(data.error || "Data not available for this date");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 pb-24 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="mb-4 hover:bg-white/10 p-2 rounded-full transition">
            <FaArrowLeftLong size={20} />
            
          </button>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
             <Image
                    src="/irctc_logo_2.png"
                    alt="IRCTC"
                    width={32}
                    height={32}
                    className="rounded-[100%] md:w-10 md:h-10"
                  /> <span className='text-xl sm:text-2xl'>Live Train Status
                    </span>
          </h1>
          <p className="text-blue-200 mt-1 text-sm font-medium">Track Indian Railways trains in real-time</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        {/* Input Card */}
        <div className="bg-white p-6 rounded-3xl shadow-2xl space-y-5 border border-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                {/* <FaRoute className="text-blue-500" />  */}
                Train Number
              </label>
              <input 
                type="text" 
                placeholder="12424"
                className="w-full bg-gray-50 border-2 border-gray-100 p-2 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-mono text-xm text-gray-700"
                value={trainNo}
                onChange={(e) => setTrainNo(e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                {/* <FaClock className="text-blue-500" />  */}
                Journey Date
              </label>
              <input 
                type="date" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-2 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-700"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-2xl font-black text-xm shadow-lg shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-3"
          >
            {loading ? "Locating Train..." : "Check Live Status"}
          </button>
        </div>

        {/* Live Status Highlight */}
        {liveInfo && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-emerald-500 p-3 rounded-full text-white">
              <FaCircleCheck size={20} />
            </div>
            <div>
              <p className="text-emerald-900 font-bold leading-tight">{liveInfo.status}</p>
              <p className="text-emerald-600 text-xs mt-1 uppercase font-bold tracking-tighter">Updated: {liveInfo.update}</p>
            </div>
          </div>
        )}

        {/* Results Timeline */}
        <div className="mt-8">
          {results.map((train, idx) => (
            <TrainCard key={idx} train={train} />
          ))}
        </div>
      </div>
    </div>
  );
}