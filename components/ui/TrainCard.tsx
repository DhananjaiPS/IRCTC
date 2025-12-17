"use client";
import { useState } from "react";
import Loading from "./Loading";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Assuming stations import is needed, though not used directly in this snippet
import { stations } from "@/Data/Station";

type Props = {
    train: any;
};

// Simple Train Icon Component (Wagon/Engine style) - Kept as is
const TrainIcon = ({ className = "w-6 h-6 text-white" }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19V6l2-2 2 2v13M9 19c-3.866 0-7-3.134-7-7s3.134-7 7-7m0 14c3.866 0 7-3.134 7-7s-3.134-7-7-7m7 0h3c1.657 0 3 1.343 3 3v8c0 1.657-1.343 3-3 3h-3m-7-5h5v5H9v-5z"
        />
    </svg>
);

// Destination Pin Icon - Kept as is
const PinIcon = ({ className = "w-6 h-6 text-white" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default function TrainCard({ train }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [route, setRoute] = useState<any[]>([]);

    const canLoadRoute = train.route !== null;

    const fetchRoute = async () => {
        if (!canLoadRoute) return;

        if (route.length > 0) {
            setOpen(!open);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/train/train-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trainNo: train.trainNo }),
            });

            const data = await res.json();
            if (data.success) {
                // Assuming your API returns route data
                setRoute(data.data.trains[0].route || []);
                setOpen(true);
            }
        } finally {
            setLoading(false);
        }
    };
    // console.log(train) // Removed console.log for cleaner production code

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">

            {/* NEW HEADER - Gradeint and better spacing */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 sm:p-5 relative">

                {/* Top Row: Train Info and Route Button */}
                <div className="flex justify-between items-start mb-4">

                    {/* Train Info */}
                    <div className="space-y-1 z-10 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                            {/* Icon (Replaced with a simple, modern Lucide-style SVG) */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tram-front-icon w-6 h-6 text-amber-300"><rect width="16" height="16" x="4" y="3" rx="2" /><path d="M4 11h16" /><path d="M12 3v8" /><path d="m8 19-2 3" /><path d="m18 22-2-3" /><path d="M8 15h.01" /><path d="M16 15h.01" /></svg>
                            <h2 className="font-extrabold text-xl sm:text-2xl line-clamp-1">
                                {train.trainName}
                            </h2>
                        </div>
                        <p className="text-blue-200 text-sm font-medium">Train No: {train.trainNo}</p>
                    </div>

                    {/* Route Button - Better styling */}
                    <button
                        disabled={!canLoadRoute}
                        onClick={fetchRoute}
                        className={`
                            px-4 py-1.5 text-xs font-bold rounded-full transition z-10 whitespace-nowrap
                            ${canLoadRoute
                                ? "bg-white text-blue-600 hover:bg-blue-100 shadow-md"
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {loading
                            ? <Loading />
                            : open
                                ? "Hide Route"
                                : canLoadRoute
                                    ? "View Route"
                                    : "Route N/A"}
                    </button>
                </div>

                {/* Travel Details - Clearer separation of codes and names */}
                <div className="mt-4 bg-white/15 p-3 rounded-xl flex justify-between text-sm font-medium backdrop-blur-sm shadow-inner border border-white/20">

                    <div className="text-left">
                        <p className="font-extrabold text-lg sm:text-xl text-white">{train.fromCode}</p>
                        <p className="text-xs text-blue-100 mt-0.5 line-clamp-1">{train.from}</p>
                        <p className="text-xs font-bold mt-1 text-amber-300">Dep: {train.fromTime}</p>
                    </div>

                    <div className="text-center flex-1 mx-4 flex flex-col justify-center items-center pt-2">
                        <p className="text-xs text-gray-300 font-medium">{train.duration}</p>
                        <svg className="w-full h-3 mt-1 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <line x1="5" y1="5" x2="95" y2="5" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
                            {/* <circle cx="5" cy="5" r="3" fill="currentColor" />
                            <circle cx="95" cy="5" r="3" fill="currentColor" /> */}
                        </svg>
                        <p className="text-xs text-gray-300 mt-1">Journey</p>
                    </div>

                    <div className="text-right">
                        <p className="font-extrabold text-lg sm:text-xl text-white">{train.toCode}</p>
                        <p className="text-xs text-blue-100 mt-0.5 line-clamp-1">{train.to}</p>
                        <p className="text-xs font-bold mt-1 text-amber-300">Arr: {train.toTime}</p>
                    </div>
                </div>

            </div>

            {/* RUNNING DAYS - Better layout for mobile */}
            {train.runningDays && (
                <div className="flex gap-2 p-3 sm:p-4 border-b overflow-x-auto whitespace-nowrap scrollbar-hide ">
                    <p className="text-sm font-bold text-gray-700 flex-shrink-0 pt-0.5">
                        Runs On:
                    </p>

                    {DAYS.map((d, i) => (
                        <span
                            key={d}
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex justify-center items-center min-w-[28px]
          ${train.runningDays[i] === "1"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            {/* Mobile: Single letter */}
                            <span className="sm:hidden">
                                {d.charAt(0)}
                            </span>

                            {/* Tablet & Desktop: Full day */}
                            <span className="hidden sm:inline">
                                {d}
                            </span>
                        </span>
                    ))}
                </div>
            )}


            {/* ROUTE - NEW TIMELINE DESIGN */}
            {open && route.length > 0 && (
                <div className="bg-gray-50 p-4 sm:p-6 border-t">
                    <h3 className="text-base font-bold text-blue-700 mb-4 border-b border-blue-100 pb-2">
                        Detailed Route Stops ({route.length} stations)
                    </h3>

                    {/* Visual separation for the timeline scroll area */}
                    <div className="relative pl-6 space-y-5 max-h-[400px] overflow-y-auto pr-2">

                        {/* Vertical Timeline Line - Thicker and Dotted */}
                        <div className="absolute left-2 top-0 bottom-0 w-1 bg-blue-200 rounded-full" />

                        {route.map((r: any, i: number) => {
                            const isSource = i === 0;
                            const isDestination = i === route.length - 1;

                            // Dynamic Icon and Color Scheme
                            let timelineDotClass = "bg-blue-600";
                            let stationCardClass = "bg-white border-blue-100 shadow-sm hover:shadow-md";
                            let iconComponent;

                            if (isSource) {
                                timelineDotClass = "bg-green-600 ring-4 ring-green-200";
                                stationCardClass = "bg-green-50 border-green-300 shadow-md";
                                iconComponent = <TrainIcon className="w-4 h-4 text-green-700" />;
                            } else if (isDestination) {
                                timelineDotClass = "bg-red-600 ring-4 ring-red-200";
                                stationCardClass = "bg-red-50 border-red-300 shadow-md";
                                iconComponent = <PinIcon className="w-4 h-4 text-red-700" />;
                            } else {
                                timelineDotClass = "bg-blue-500 ring-2 ring-blue-100";
                                stationCardClass = "bg-white border-gray-200 hover:shadow";
                                iconComponent = null;
                            }

                            return (
                                <div key={i} className="relative flex gap-3 sm:gap-4 items-start z-10">
                                    {/* Timeline Marker (Dot/Icon) */}
                                    <div className="flex-shrink-0 pt-1.5 relative">
                                        {iconComponent ? (
                                            <div className={`p-1.5 rounded-full bg-white relative z-10 shadow-lg border-2 border-white`}>
                                                {iconComponent}
                                            </div>
                                        ) : (
                                            <div
                                                className={`w-3 h-3 mt-2 rounded-full relative z-10 transition ${timelineDotClass}`}
                                            />
                                        )}
                                    </div>

                                    {/* Station Card - Increased readability on smaller screens */}
                                    <div className={`border rounded-xl p-3 w-full transition-all ${stationCardClass}`}>
                                        <div className="flex  justify-between items-start text-sm ">
                                            {/* Left side: Station Name and Details */}
                                            <div className="max-w-[65%] ">
                                                <p className={`font-extrabold text-base line-clamp-1 ${isSource ? 'text-green-800' : isDestination ? 'text-red-800' : 'text-gray-800'}`}>
                                                    {r.stnName} <span className="text-xs font-normal text-gray-500">({r.stnCode})</span>
                                                </p>

                                            </div>


                                            {/* Right side: Time Details (Specific Time blocks) */}
                                            <div className="text-right text-xs pt-0.5 space-y-1">
                                                {/* Source: Only Departure */}
                                                {isSource && r.departure && (
                                                    <div className="text-green-700 font-bold bg-green-100 py-0.5 px-2 rounded-md whitespace-nowrap">
                                                        Dep: {r.departure}
                                                    </div>
                                                )}

                                                {/* Intermediate: Arr & Dep */}
                                                {!isSource && !isDestination && (
                                                    <>
                                                        <p className="text-gray-700 font-medium">Arr: {r.arrival || "--"}</p>
                                                        <p className="text-gray-700 font-medium">Dep: {r.departure || "--"}</p>
                                                    </>
                                                )}

                                                {/* Destination: Only Arrival */}
                                                {isDestination && r.arrival && (
                                                    <div className="text-red-700 font-bold bg-red-100 py-0.5 px-2 rounded-md whitespace-nowrap">
                                                        Arr: {r.arrival}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className=" flex flex-wrap text-xs text-gray-600 space-x-2 sm:space-x-3 mt-1 w-full">
                                            <span className="font-medium">Day {r.day}</span>
                                            <span>| {r.distance} km</span>
                                            <span className="font-medium bg-gray-100 px-1.5 rounded-md text-gray-700">PF {r.platform || "01"}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}