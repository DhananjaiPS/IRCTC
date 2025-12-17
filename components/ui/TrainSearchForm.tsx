"use client";

import React, { useState } from "react";
import {
  Train,
  Calendar,
  MapPin,
  ArrowDownUp,
  Search,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { stations } from "@/Data/Station";

const CLASSES = [
  "All Classes",
  "Sleeper (SL)",
  "AC 3 Tier (3A)",
  "AC 2 Tier (2A)",
  "AC First Class (1A)",
  "Second Sitting (2S)",
];

const QUOTAS = [
  "GENERAL",
  "LADIES",
  "LOWER BERTH",
  "PERSON WITH DISABILITY",
  "DUTY PASS",
  "TATKAL",
  "PREMIUM TATKAL",
];

export default function TrainSearchForm() {
  const router = useRouter();

  const [fromStation, setFromStation] = useState("Chandigarh (CHD)");
  const [toStation, setToStation] = useState("Lucknow NR (LKO)");
  const [activeField, setActiveField] = useState<"from" | "to" | "">("");

  const [journeyDate, setJourneyDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [quota, setQuota] = useState("GENERAL");

  const today = new Date().toISOString().split("T")[0];
  const maxDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 120);
    return d.toISOString().split("T")[0];
  })();

  /* -------------------- Station Search Logic -------------------- */

  const filterStations = (query: string) => {
    const q = query.toLowerCase();
    return stations.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  };

  const renderDropdown = (
    query: string,
    setQuery: (v: string) => void,
    field: "from" | "to"
  ) => {
    if (!query || activeField !== field) return null;

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

  const extractCode = (value: string) =>
    value.match(/\((.*?)\)/)?.[1] || "";

  const swapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleSearch = () => {
    const fromCode = extractCode(fromStation);
    const toCode = extractCode(toStation);

    if (!fromCode || !toCode) {
      toast.error("Please select valid stations from suggestions");
      return;
    }

    const query = new URLSearchParams({
      from: fromCode,
      to: toCode,
      date: journeyDate,
      class: selectedClass,
      quota,
    }).toString();

    router.push(`/train/book-ticket?${query}`);
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="shadow-2xl p-4 sm:p-6 bg-white rounded-xl w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
        BOOK TICKET
      </h2>

      <div className="space-y-4">
        {/* FROM */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            From
          </label>
          <MapPin className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
          <input
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            onFocus={() => setActiveField("from")}
            className="w-full pl-10 pr-4 py-3 border-2 rounded-lg text-sm focus:border-blue-500"
            placeholder="From Station"
          />
          {renderDropdown(fromStation, setFromStation, "from")}
        </div>

        {/* SWAP */}
        <div className="flex justify-center -my-1">
          <button
            onClick={swapStations}
            className="p-2 rounded-full bg-blue-100 border border-blue-500"
          >
            <ArrowDownUp className="w-4 h-4 text-blue-900" />
          </button>
        </div>

        {/* TO */}
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            To
          </label>
          <MapPin className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
          <input
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            onFocus={() => setActiveField("to")}
            className="w-full pl-10 pr-4 py-3 border-2 rounded-lg text-sm focus:border-blue-500"
            placeholder="To Station"
          />
          {renderDropdown(toStation, setToStation, "to")}
        </div>

        {/* DATE & CLASS */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Journey Date</label>
            <input
              type="date"
              min={today}
              max={maxDate}
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full py-3 px-3 border-2 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full py-3 px-3 border-2 rounded-lg text-sm"
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* QUOTA */}
        <div>
          <label className="text-sm font-medium">Quota</label>
          <select
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            className="w-full py-3 px-3 border-2 rounded-lg text-sm"
          >
            {QUOTAS.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
        </div>

        {/* SEARCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 md:py-4 rounded-lg transition flex items-center justify-center shadow-lg text-base"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Search Trains
                    </button>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 md:py-4 rounded-lg transition shadow-lg text-base"
                        onClick={()=>{
                            toast.success("Feature Under Alpha Phase")
                        }}
                    >
                        Easy Booking on AskDISHA
                    </button>
                </div>
      </div>
    </div>
  );
}
