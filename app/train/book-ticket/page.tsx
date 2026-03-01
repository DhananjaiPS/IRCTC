"use client";
import { Suspense } from "react";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
    Clock,
    Loader2,
    Train as TrainIcon,
    MapPin as PinIcon,
    RefreshCcw
} from "lucide-react";
import { stations } from "../../../Data/station";
// import { useRouter } from "next/navigation";
/* ---------- Types ---------- */

interface TrainAvailability {
    date: string;
    availabilityText: string;
    prediction?: string;
}

// Updated RouteStop interface to mFunFatch your Route rendering logic (r.stnName, r.arrival, etc.)
interface RouteStop {
    stnName: string;
    stnCode: string;
    arrivalTime: string;
    departureTime: string;
    day: number;
    distance: number; // Added distance
    platform: string; // Added platform
}

interface TrainData {
    trainNumber: string
    trainName: string

    departure: string
    arrival: string
    duration: string

    runningDays: string
    coach: string

    availability: {
        status: string
        count: number
        coachType: string
    }

    startDate: string | null
    endDate: string | null

    journeyDate: string
    destinationDate: string
    dayCount: number

    fare: number
}

// Placeholder Loading Component
const Loading = () => <Loader2 className="w-4 h-4 animate-spin" />;


// ==========================================================
// TrainCard Component (Handles individual train logic, including Route)
// ==========================================================
interface TrainCardProps {
    train: TrainData;
    fromCode: string | null;
    toCode: string | null;
    journeyDate: string;
    // Passed down to check running status accurately
}

const TrainCard: React.FC<TrainCardProps> = ({ train, fromCode, toCode, journeyDate }) => {
    // Local State for Route Expansion
    const [open, setOpen] = useState(false);
    const [routeLoading, setRouteLoading] = useState(false);
    const [route, setRoute] = useState<RouteStop[]>([]);
    const [selectedClass, setSelectedClass] = useState(train.availability.coachType);

    // Determine if route data can potentially be loaded
    const canLoadRoute = !!train.trainNumber;

    // Date formatting function
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "NA";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            });
        } catch {
            return "Invalid Date";
        }
    };

    const displayJourneyDate = formatDate(train.journeyDate);
    const displayDestinationDate = formatDate(train.destinationDate);

    // Running status check
    const isActive =
        train.startDate && train.endDate
            ? new Date(journeyDate) >= new Date(train.startDate) &&
            new Date(journeyDate) <= new Date(train.endDate)
            : true;

    const router = useRouter();

    // ✅ LOGIC 1: Initialize all classes so they are visible
    const [classData, setClassData] = useState<
        Record<string, { count: number | string; status: string; loading: boolean }>
    >(() => {
        const classes = ["SL", "AC3", "AC2", "AC1", "S2"];
        const initial: any = {};
        classes.forEach(cls => {
            initial[cls] = {
                count: cls === train.availability.coachType ? train.availability.count : "--",
                status: cls === train.availability.coachType ? train.availability.status : "CHECK",
                loading: false
            };
        });
        return initial;
    });

    useEffect(() => {
        refreshAvailability(selectedClass);
    }, []);

    const refreshAvailability = async (cls: string) => {
        setSelectedClass(cls);
        setClassData(prev => ({
            ...prev,
            [cls]: { ...prev[cls], loading: true }
        }));

        try {
            const res = await fetch(`/api/train/availability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    trainNo: train.trainNumber,
                    date: train.journeyDate,
                    class: cls
                }),
            });
            const data = await res.json();

            if (data.success) {
                setClassData(prev => ({
                    ...prev,
                    [cls]: {
                        count: data.availableCount,
                        status: data.status,
                        loading: false
                    }
                }));
            } else {
                setClassData(prev => ({
                    ...prev,
                    [cls]: { count: 0, status: "N/A", loading: false }
                }));
            }
        } catch (error) {
            console.error("Refresh failed");
            setClassData(prev => ({
                ...prev,
                [cls]: { ...prev[cls], loading: false }
            }));
        }
    };

    // Check if booking is allowed (Not in past)
    const isDeparted = () => {
        const now = new Date();
        const [h, m] = (train.departure || "00:00").split(":").map(Number);
        const dep = new Date(train.journeyDate);
        dep.setHours(h, m, 0, 0);
        return now > dep;
    };

    // ✅ LOGIC 2: Disable button if FULL, N/A or Departed
    const isBookingDisabled = () => {
        const current = classData[selectedClass];
        if (!current || current.loading) return true;
        const status = current.status.toUpperCase();
        // Booking Allowed only if status is positive
        const canBook = status.includes("AVAILABLE") || status.includes("RAC") || status.includes("WL") || status.includes("WAITLIST");
        return !canBook || isDeparted();
    };

    const handleBooking = () => {
        const params = new URLSearchParams({
            trainNo: train.trainNumber,
            date: train.journeyDate,
            from: fromCode ?? "",
            to: toCode ?? "",
            class: selectedClass,
        });
        router.push(`/train/book-ticket/confirm?${params.toString()}`);
    };

    const fetchRoute = useCallback(async () => {
        if (!canLoadRoute) return;
        if (route.length > 0) {
            setOpen(!open);
            return;
        }
        setOpen(true);
        setRouteLoading(true);
        try {
            const res = await fetch("/api/train/train-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trainNo: train.trainNumber }),
            });
            const data = await res.json();
            if (data.success && data.data?.trains?.[0]?.route) {
                setRoute(data.data.trains[0].route as RouteStop[]);
            } else {
                toast.error("Failed to load route details.");
                setOpen(false);
            }
        } catch (error) {
            toast.error("Error fetching train route.");
            setOpen(false);
        } finally {
            setRouteLoading(false);
        }
    }, [train.trainNumber, route.length, open, canLoadRoute]);

    return (
        <div key={train.trainNumber} className="bg-white rounded-2xl shadow-md p-4 space-y-4 border border-blue-100 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex justify-between items-start">
                <h2 className="text-lg md:text-xl font-bold text-blue-700 flex items-center">
                    <TrainIcon className="mr-2 text-blue-500 w-6 h-6 shrink-0" />
                    {train.trainName}
                </h2>
                <div className="flex gap-2 items-center">
                    <button onClick={fetchRoute} disabled={!canLoadRoute} className={`px-3 py-1 text-xs font-bold rounded-full transition z-10 ${canLoadRoute ? "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                        {routeLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : open ? "Hide" : "Route"}
                    </button>
                    <span className={`hidden sm:block text-xs font-semibold px-3 py-1 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {isActive ? "RUNNING" : "NOT RUNNING"}
                    </span>
                </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-3 gap-2 text-center items-center bg-blue-50 rounded-xl py-2 sm:py-1">
                <div>
                    <p className="text-lg font-semibold text-green-600">{train.departure}</p>
                    <p className="text-xs text-gray-600 font-medium sm:text-[15px]">{fromCode}</p>
                    <span className="font-bold text-gray-800 text-xs sm:text-[15px]">{displayJourneyDate}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-gray-600 py-2">
                    <div className="flex flex-col justify-center items-center h-[8vh]">
                        <div className="flex justify-center gap-2 items-center">
                            <Clock className="hidden sm:block w-4 h-4 shrink-0" />
                            <span className="text-sm font-medium">{train.duration}</span>
                        </div>
                        {train.dayCount > 0 && <span className="text-xs sm:text-sm text-gray-500 font-bold">(+{train.dayCount} Day{train.dayCount > 1 ? "s" : ""})</span>}
                        <p className="line-clamp-1 text-xs sm:text-sm sm:mt-1">{train.runningDays}</p>
                    </div>
                </div>
                <div>
                    <p className="text-lg font-semibold text-red-600">{train.arrival}</p>
                    <p className="text-xs text-gray-600 font-medium sm:text-[15px]">{toCode}</p>
                    <span className="font-bold text-gray-800 text-xs sm:text-[15px]">{displayDestinationDate}</span>
                </div>
            </div>

            {/* Route Timeline */}
            {open && route.length > 0 && (
                <div className="bg-gray-50 p-4 sm:p-6 border-t">
                    <h3 className="text-base font-bold text-blue-700 mb-4 border-b border-blue-100 pb-2">Route Stops</h3>
                    <div className="relative pl-6 space-y-5 max-h-[400px] overflow-y-auto pr-2">
                        <div className="absolute left-2 top-0 bottom-0 w-1 bg-blue-200 rounded-full" />
                        {route.map((r: any, i: number) => (
                            <div key={i} className="relative flex gap-3 items-start z-10">
                                <div className="shrink-0 pt-1.5"><div className="w-3 h-3 mt-2 rounded-full bg-blue-500 ring-2 ring-blue-100" /></div>
                                <div className="border rounded-xl p-3 w-full bg-white">
                                    <div className="flex justify-between items-start text-sm">
                                        <div className="max-w-[65%]"><p className="font-extrabold text-base text-gray-800">{r.stnName}</p></div>
                                        <div className="text-right text-xs">
                                            <p className="text-gray-700">Arr: {r.arrival || "--"}</p>
                                            <p className="text-gray-700">Dep: {r.departure || "--"}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-xs text-gray-600 gap-3 mt-1">
                                        <span>Day {r.day}</span><span>| {r.distance} km</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Availability Footer */}
            <div className="mt-4 border-t pt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {Object.keys(classData).map((cls) => {
                        const data = classData[cls];
                        const isActiveCls = selectedClass === cls;
                        const statusColor = data.status === "AVAILABLE" ? "text-green-600" : (data.status === "CHECK" ? "text-gray-400" : "text-red-600");

                        return (
                            <button key={cls} onClick={() => refreshAvailability(cls)} className={`border p-2 rounded-lg min-w-[100px] transition ${isActiveCls ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200"}`}>
                                <span className={`block font-bold ${isActiveCls ? "text-white" : "text-gray-700"}`}>{cls}</span>
                                <span className={`text-[10px] flex items-center justify-center gap-1 font-bold ${isActiveCls ? "text-blue-100" : statusColor}`}>
                                    {data.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : `${data.status} ${data.count !== "--" ? data.count : ""}`}
                                    <RefreshCcw size={10} className={data.loading ? "animate-spin" : ""} />
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    disabled={isBookingDisabled()}
                    className={`px-8 py-2 rounded-lg font-bold transition ${isBookingDisabled() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white active:scale-95'}`}
                    onClick={handleBooking}
                >
                    {isDeparted() ? "Already Departed" : (classData[selectedClass]?.status === "CHECK" ? "Refreshing..." : "Book Now")}
                </button>
            </div>
        </div>
    );
};


// ==========================================================
// BookTicketPage Component (Main)
// ==========================================================
export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookTicketPage />
        </Suspense>
    );
}


function BookTicketPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ---------- URL Params ---------- */
    const fromCode = searchParams.get("from");
    const toCode = searchParams.get("to");
    const date = searchParams.get("date");
    const rawQuota = searchParams.get("quota");
    const quota = rawQuota === "GENERAL" ? "GN" : rawQuota;
    const rawClass = searchParams.get("class");
    const journeyClass =
        rawClass === "All Classes" || !rawClass ? "SL" : rawClass;

    /* ---------- State ---------- */
    const [trains, setTrains] = useState<TrainData[]>([]);
    const [loading, setLoading] = useState(true);

    /* Modify Search State */
    const [fromQuery, setFromQuery] = useState(fromCode || "");
    const [toQuery, setToQuery] = useState(toCode || "");
    const [journeyDate, setJourneyDate] = useState(date || "");
    const [editQuota, setEditQuota] = useState(quota || "GN");
    const [editClass, setEditClass] = useState(journeyClass || "SL");
    const [activeField, setActiveField] = useState<"from" | "to" | "">("");

    // Helper functions (calculateDuration, calculateJourneyMeta, etc.)
    function calculateDuration(departure: string, arrival: string): string {
        const [dh, dm] = departure.split(':').map(Number)
        const [ah, am] = arrival.split(':').map(Number)

        const departureMinutes = dh * 60 + dm
        let arrivalMinutes = ah * 60 + am

        if (arrivalMinutes < departureMinutes) {
            arrivalMinutes += 24 * 60
        }

        const diff = arrivalMinutes - departureMinutes

        const hours = Math.floor(diff / 60)
        const minutes = diff % 60

        return `${hours}h ${minutes.toString().padStart(2, '0')}m`
    }




    function calculateJourneyMeta(
        journeyDate: string,
        departure: string,
        arrival: string
    ) {
        if (!journeyDate) {
            return {
                journeyStartDate: "",
                journeyEndDate: "",
                dayCount: 0,
            }
        }

        const [y, m, d] = journeyDate.split("-").map(Number)

        // ✅ SAFE time parsing
        const parseTime = (t?: string) => {
            if (!t || !t.includes(":")) return [0, 0]
            const [h, mm] = t.split(":").map(n => Number(n) || 0)
            return [h, mm]
        }

        const [dh, dm] = parseTime(departure)
        const [ah, am] = parseTime(arrival)

        const start = new Date(y, m - 1, d, dh, dm)
        const end = new Date(y, m - 1, d, ah, am)

        const startMinutes = dh * 60 + dm
        const endMinutes = ah * 60 + am

        let dayCount = 0

        if (endMinutes < startMinutes) {
            dayCount = 1
            end.setDate(end.getDate() + 1)
        }

        return {
            journeyStartDate: start.toISOString().split("T")[0],
            journeyEndDate: end.toISOString().split("T")[0],
            dayCount,
        }
    }


    /* ---------- Station Recommendation ---------- */
    const filterStations = (query: string) => {
        const q = query.toLowerCase();
        return stations.filter(
            (s) =>
                s.id.toLowerCase().includes(q) ||
                s.name.toLowerCase().includes(q)
        );
    };

    const renderDropdown = (
        query: string,
        setQuery: (v: string) => void,
        field: "from" | "to"
    ) => {
        if (activeField !== field || !query) return null;
        const list = filterStations(query);

        return (
            <ul className="absolute z-20 w-full bg-white border rounded-xl mt-1 shadow-lg max-h-52 overflow-y-auto">
                {list.map((s) => (
                    <li
                        key={s.id}
                        onMouseDown={() => {
                            setQuery(`${s.name} (${s.id})`);
                            setActiveField("");
                        }}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                    >
                        {s.name} ({s.id})
                    </li>
                ))}
            </ul>
        );
    };

    /* ---------- Data Fetching ---------- */
    useEffect(() => {
        if (!fromCode || !toCode || !date || !quota) {
            toast.error("Invalid search criteria");
            setLoading(false);
            return;
        }

        const fetchTrains = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/train/book-ticket?from=${fromCode}&to=${toCode}&date=${date}&quota=${quota}&class=${journeyClass || "SL"}`
                );
                if (!res.ok) throw new Error("Network response failed");

                const data = await res.json();
                console.log(data);

                if (data.success && Array.isArray(data.record)) {
                    const mappedTrains = data.record.map((train: any) => {

                        const duration = calculateDuration(
                            train.departure,
                            train.arrival
                        )

                        const journeyMeta = calculateJourneyMeta(
                            date!,
                            train.departure,
                            train.arrival
                        )

                        return {
                            trainNumber: train.trainNo ?? "",
                            trainName: train.name ?? "Unknown",

                            departure: train.departure ?? "00:00",
                            arrival: train.arrival ?? "00:00",
                            duration,

                            runningDays: "Daily",
                            coach: train?.availability?.coachType ?? "SL",

                            availability: train?.availability ?? {
                                status: "NA",
                                count: 0,
                                coachType: "SL"
                            },

                            startDate: null,
                            endDate: null,

                            journeyDate: journeyMeta.journeyStartDate,
                            destinationDate: journeyMeta.journeyEndDate,
                            dayCount: journeyMeta.dayCount,

                            fare: train.fare ?? 0
                        }
                    })


                    setTrains(mappedTrains);
                } else {
                    setTrains([]);
                }

            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch trains");
            } finally {
                setLoading(false);
            }
        };

        fetchTrains();
    }, [fromCode, toCode, date, quota, journeyClass]);

    /* ---------- Modify Search ---------- */
    const handleModifySearch = () => {
        const from = fromQuery.match(/\((.*?)\)/)?.[1];
        const to = toQuery.match(/\((.*?)\)/)?.[1];

        if (!from || !to || !journeyDate) {
            toast.error("Please select valid stations & date");
            return;
        }

        router.push(
            `/train/book-ticket?from=${from}&to=${to}&date=${journeyDate}&quota=${editQuota}&class=${editClass}`
        );
    };

    /* ---------- Loading UI ---------- */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                {/* <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" /> */}

                <div className="h-34 w-114 sm:h-40 sm:w-170 overflow-hidden relative">
                    {/* Adjust h-24 to be slightly less than the GIF's natural height */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full  h-58 sm:63 border-none object-cover"
                        onLoadedMetadata={(e) => {
                            // START AT 2 SECONDS (Skip the start)
                            e.currentTarget.currentTime = 4;
                        }}
                    >
                        <source src="/loadingGIF.mp4" type="video/mp4" />
                    </video>
                </div>
                <p className="text-lg font-semibold text-blue-600">
                    Searching trains...
                </p>
            </div>
        );
    }

    /* ---------- Main UI ---------- */
    return (
        <div className="min-h-screen bg-[#f2f6ff]">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="fixed top-3 left-3 z-30 p-2 bg-black/30 rounded-full text-white"
            >
                <FaArrowLeftLong />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">

                    <Image
                        src="/irctc_logo_2.png"
                        alt="IRCTC"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />

                    <h1 className="text-2xl font-semibold">Book Ticket</h1>
                </div>
            </div>

            {/* Modify Search */}
            <div className="max-w-6xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-5 grid md:grid-cols-6 gap-4">
                    <div className="relative md:col-span-2">
                        <input
                            value={fromQuery}
                            onChange={(e) => setFromQuery(e.target.value)}
                            onFocus={() => setActiveField("from")}
                            className="h-11 w-full border rounded-lg px-3"
                            placeholder="From Station"
                            autoComplete="off"
                            data-gramm="false"
                            data-gramm_editor="false"
                            data-enable-grammarly="false"
                        />
                        {renderDropdown(fromQuery, setFromQuery, "from")}
                    </div>

                    <div className="relative md:col-span-2">
                        <input
                            value={toQuery}
                            onChange={(e) => setToQuery(e.target.value)}
                            onFocus={() => setActiveField("to")}
                            className="h-11 w-full border rounded-lg px-3"
                            placeholder="To Station"
                            autoComplete="off"
                            data-gramm="false"
                            data-gramm_editor="false"
                            data-enable-grammarly="false"
                        />
                        {renderDropdown(toQuery, setToQuery, "to")}
                    </div>

                    <input
                        type="date"
                        className="h-11 border rounded-lg px-3"
                        value={journeyDate}
                        onChange={(e) => setJourneyDate(e.target.value)}
                    />

                    <button
                        onClick={handleModifySearch}
                        className="h-11 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Train Results */}
            <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6 pb-12">
                {trains.length === 0 ? (
                    <div className=" rounded-2xl shadow-xl p-12 text-center flex flex-col items-center bg-white">
                        <div className="mb-6 bg-white shadow-lg rounded-xl p-2 border border-red-200 flex items-center gap-3">
                            <span className="text-red-600 text-2xl font-black"></span>
                            <p className="text-red-700 font-bold sm:text-lg text-sm">
                                No Trains Found on the Searched route
                            </p>
                        </div>

                        <Image
                            src="/loader2.gif"
                            alt="No trains"
                            width={600}
                            height={600}
                            className="mx-auto mb-4"
                        />

                        <p className="text-gray-600 sm:text-lg text-xs">
                            Sorry, there are no trains matching your search. Please try different dates or stations.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">

                        {trains.map((train) => (
                            <TrainCard
                                key={train.trainNumber}
                                train={train}
                                fromCode={fromCode}
                                toCode={toCode}
                                journeyDate={journeyDate} // Pass date for accurate status check
                            />
                        ))}
                    </div>

                )}
            </div>

        </div>
    );
}