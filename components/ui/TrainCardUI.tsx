"use client";

import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Train as TrainIcon, Clock, MapPin as PinIcon, Loader2 } from "lucide-react";

interface RouteStop {
  stnName: string;
  stnCode: string;
  arrivalTime: string;
  departureTime: string;
  day: number;
  distance: number;
  platform: string;
}

interface TrainAvailability {
  date: string;
  availabilityText: string;
  prediction?: string;
}

interface TrainData {
  trainNumber: string;
  trainName: string;
  departure: string;
  arrival: string;
  duration: string;
  runningDays: string;
  coach: string;
  seatsAvailable: string;
  availability: TrainAvailability[];
  startDate: string | null;
  endDate: string | null;
  journeyDate: string;
  destinationDate: string;
  dayCount: number;
  fare: { totalFare: number } | null;
}

interface Props {
  train: TrainData;
  fromCode: string | null;
  toCode: string | null;
  onButton?: () => void; // Different action on booking page
  buttonText?: string;   // "Book Now" or "Check Seats"
  hideRoute?: boolean;   // Optional route section
}

const TrainCardUI: React.FC<Props> = ({
  train,
  fromCode,
  toCode,
  onButton,
  buttonText = "Book Now",
  hideRoute = false
}) => {

  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState<RouteStop[]>([]);
  const [routeLoading, setRouteLoading] = useState(false);

  const isActive =
    train.startDate && train.endDate
      ? new Date(train.journeyDate) >= new Date(train.startDate) &&
        new Date(train.journeyDate) <= new Date(train.endDate)
      : true;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 space-y-4 border border-blue-100 max-w-6xl mx-auto w-full">

      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg md:text-xl font-bold text-blue-700 flex items-center">
          <TrainIcon className="mr-2 text-blue-500 w-6 h-6" />
          {train.trainName}
        </h2>

        <span
          className={`hidden sm:block text-xs font-semibold px-3 py-1 rounded-full ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "RUNNING" : "NOT RUNNING"}
        </span>
      </div>

      {/* ---------- Schedule ---------- */}
      <div className="grid grid-cols-3 gap-2 text-center items-center bg-blue-50 rounded-xl py-3 sm:py-4">

        <div>
          <p className="text-lg font-semibold text-green-600">
            {train.departure}
          </p>
          <p className="text-xs text-gray-600 font-medium sm:text-[15px]">{fromCode}</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <Clock className="hidden sm:block w-5 h-5" />
          <p className="text-sm font-medium">{train.duration}</p>
          <p className="line-clamp-1 text-xs sm:text-xl">{train.runningDays}</p>
        </div>

        <div>
          <p className="text-lg font-semibold text-red-600">
            {train.arrival}
          </p>
          <p className="text-xs text-gray-600 font-medium sm:text-[15px]">{toCode}</p>
        </div>
      </div>

      {/* ---------- Fare + Action ---------- */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={onButton}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow"
        >
          {buttonText}
        </button>
      </div>

    </div>
  );
};

export default TrainCardUI;
