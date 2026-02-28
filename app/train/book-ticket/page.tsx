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

    // Running status check (using the passed down journeyDate)
    const isActive =
        train.startDate && train.endDate
            ? new Date(journeyDate) >= new Date(train.startDate) &&
            new Date(journeyDate) <= new Date(train.endDate)
            : true;
    const router = useRouter();
    useEffect(() => {

        console.log("Train Data in TrainCard:", train);
    }, []);



    const [classData, setClassData] = useState<
        Record<string, { count: number; status: string; loading: boolean }>
    >({
        [train.availability.coachType]: {
            count: train.availability.count,
            status: train.availability.status,
            loading: false
        }
    });
    useEffect(() => {
        refreshAvailability(selectedClass);
    }, []);

    const refreshAvailability = async (cls: string) => {
        setSelectedClass(cls);

        // UI par loading dikhao
        setClassData(prev => ({
            ...prev,
            [cls]: { ...prev[cls], loading: true }
        }));

        try {
            // ✅ FRESH DATA FETCH KARO (Sirf ek API call jo current count bataye)

            const res = await fetch(`/api/train/availability`, {
                method: "POST", // 👈 GET ki jagah POST karo
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
                        count: data.availableCount, // DB wala fresh count (e.g. 140)
                        status: data.status,
                        loading: false
                    }
                }));
            }
            
        } catch (error) {
            console.error("Refresh failed");
            // Fallback to old data on error
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


    // Fetch Route Logic
    const fetchRoute = useCallback(async () => {
        if (!canLoadRoute) return;

        if (route.length > 0) {
            setOpen(!open); // Toggle if data is already loaded
            return;
        }

        setOpen(true); // Open the route panel immediately
        setRouteLoading(true);

        try {
            // NOTE: Assuming your API endpoint is correct and requires 'trainNo' in the body
            const res = await fetch("/api/train/train-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trainNo: train.trainNumber }),
            });

            const data = await res.json();
            console.log(data);

            // NOTE: Adjusting the logic to handle potential nested structure
            if (data.success && data.data?.trains?.[0]?.route) {
                setRoute(data.data.trains[0].route as RouteStop[]);
            } else {
                toast.error("Failed to load route details.");
                setOpen(false); // Close if fetching failed
            }
        } catch (error) {
            toast.error("Error fetching train route.");
            setOpen(false); // Close if fetching failed
        } finally {
            setRouteLoading(false);
        }
    }, [train.trainNumber, route.length, open, canLoadRoute]);

    console.log(train)

    return (
        <div
            key={train.trainNumber}
            className="bg-white rounded-2xl shadow-md p-4 sm:p- space-y-4 border border-blue-100 max-w-6xl mx-auto w-full"
        >
            {/* ---------- Header (Train Name, Number, Route Button, Status) ---------- */}
            <div className="flex justify-between items-start">
                <h2 className="text-lg md:text-xl font-bold text-blue-700 flex items-center">
                    <TrainIcon className="mr-2 text-blue-500 w-6 h-6 line-clamp-1 sm:text-xl shrink-0" />
                    {train.trainName}
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                        {/* ({train.trainNumber}) */}
                    </span>
                </h2>

                <div className="flex gap-2 items-center">
                    {/* Route Button */}
                    <button
                        onClick={fetchRoute}
                        disabled={!canLoadRoute}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition z-10 
                            ${canLoadRoute
                                ? "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-sm"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {routeLoading
                            ? <Loading />
                            : open
                                ? "Hide"
                                : "Route"}
                    </button>

                    {/* Running Status Tag */}
                    <span
                        className={`hidden sm:block text-xs font-semibold px-3 py-1 rounded-full ${isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {isActive ? "RUNNING" : "NOT RUNNING"}
                    </span>
                </div>
            </div>

            {/* ---------- Schedule ---------- */}
            <div className="grid grid-cols-3 gap-2 text-center items-center bg-blue-50 rounded-xl py-2 sm:py-1">

                <div>
                    <p className="text-lg font-semibold text-green-600">
                        {train.departure}
                    </p>
                    <p className="text-xs text-gray-600 font-medium sm:text-[15px]">{fromCode}</p>
                    <span className="font-bold text-gray-800 text-xs sm:text-[15px]">{displayJourneyDate}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center  text-gray-600 py-2">
                    {/* Icon (desktop only) */}

                    {/* Text */}
                    <div className="flex flex-col justify-center items-center h-[8vh] bg">

                        <div className="flex  justify-center items-center">

                            <p className="text-sm font-medium flex flex-col gap-1 items-center">

                                <div className="flex justify-center gap-2 items-center">
                                    <Clock className="hidden sm:block w-4 h-4 shrink-0" />
                                    <span>{train.duration}</span>

                                </div>


                                {train.dayCount > 0 && (
                                    <span className="text-xs sm:text-sm text-gray-500 font-bold ">
                                        (+{train.dayCount} Day{train.dayCount > 1 ? "s" : ""})
                                    </span>
                                )}
                            </p>
                        </div>

                        <p className="line-clamp-1 text-xs sm:text-sm sm:mt-1">{train.runningDays}</p>
                    </div>
                </div>

                <div>
                    <p className="text-lg font-semibold text-red-600">
                        {train.arrival}
                    </p>
                    <p className="text-xs text-gray-600 font-medium sm:text-[15px]">{toCode}</p>
                    <span className="font-bold text-gray-800 text-xs sm:text-[15px]">{displayDestinationDate}</span>
                </div>

            </div>

            {/* ---------- Route Display Section (Fixed Timeline) ---------- */}
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
                                    <div className="shrink-0 pt-1.5 relative">
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


            {/* ---------- Availability and Booking Button ---------- */}
            <div className="mt-4 border-t pt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                {/* ---------- Class Selector ---------- */}
                <div className="flex gap-3 overflow-x-auto">
                    {Object.keys(classData).map((cls) => {
                        const data = classData[cls];

                        const textColor =
                            typeof data.count === "string"
                                ? "text-gray-600"
                                : data.count > 20
                                    ? "text-green-600"
                                    : data.count > 0
                                        ? "text-yellow-600"
                                        : "text-red-600";

                        return (
                            <button
                                key={cls}
                                onClick={() => refreshAvailability(cls)}
                                className={`border p-2 rounded-lg min-w-[100px] transition ${selectedClass === cls
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white"
                                    }`}
                            >
                                <span className="block font-bold">{cls}</span>

                                <span className={`text-xs flex items-center justify-center gap-1 ${textColor}`}>
                                    {data.loading ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        `${data.status} ${data.count}`
                                    )}

                                    <RefreshCcw
                                        size={12}
                                        className={data.loading ? "animate-spin" : ""}
                                    />
                                </span>
                            </button>
                        );
                    })}
                </div>
                <button
                    disabled={isDeparted()}
                    className={`px-6 py-2 rounded-lg ${isDeparted() ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
                    onClick={handleBooking}
                >
                    {isDeparted() ? "Already Departed" : "Book Now"}
                </button>

                {/* ---------- Availability + CTA ---------- */}
                {/* <div className="flex items-center justify-between sm:justify-end gap-4">
                    <p className="text-sm text-gray-600">
                        Seats:&nbsp;
                        <span
                            className={`font-semibold ${train.seatsAvailable === "Available"
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                        >
                            {train.seatsAvailable}
                        </span>
                    </p>

                    <button
                        disabled={!isActive}
                        onClick={() => {
                            const params = new URLSearchParams({
                                trainNo: train.trainNumber,
                                date: train.journeyDate,
                                from: fromCode ?? "",
                                to: toCode ?? "",
                                class: train.coach,
                            });
                            toast.success("Booking flow initiated");

                            router.push(`/train/book-ticket/confirm?${params.toString()}`);
                        }}

                        // onClick={() =>

                        //     toast.success("Booking flow will be integrated next")
                        // }
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Book Now
                    </button>
                </div> */}
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