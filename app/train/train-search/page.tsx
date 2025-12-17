"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { stations } from "@/Data/Station";
import TrainCard from "@/components/ui/TrainCard";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();

  const [fromQuery, setFromQuery] = useState("Chandigarh (CHD)");
  const [toQuery, setToQuery] = useState("Lucknow NR (LKO)");
  const [activeField, setActiveField] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // New variable to track search status
  const [searchMode, setSearchMode] = useState<"route" | "train">("route");
  const [trainNo, setTrainNo] = useState("");
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const filterStations = (query: string) => {
    const q = query.toLowerCase();
    return stations.filter(
      (s) => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  };

  const renderDropdown = (query: string, setQuery: any, field: string) => {
    const list = filterStations(query);
    if (activeField !== field || !query) return null;

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

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true); // Mark that a search was attempted
    setResults([]);
    setCurrentPage(1);

    try {
      let payload: any = {};

      if (searchMode === "route") {
        const from = fromQuery.match(/\((.*?)\)/)?.[1];
        const to = toQuery.match(/\((.*?)\)/)?.[1];
        if (!from || !to) {
          toast.error("Please select valid stations for route search.");
          setLoading(false);
          setHasSearched(false);
          return;
        }
        payload = { fromStationCode: from, toStationCode: to };
      }

      if (searchMode === "train") {
        if (trainNo.length !== 5) {
          toast.error("Train number must be 5 digits long.");
          setLoading(false);
          setHasSearched(false);
          return;
        }
        payload = { trainNo };
      }

      const res = await fetch("/api/train/train-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.success) {
        setResults(data.data.trains || []);
      } else {
        toast.error(data.message || "Something went wrong");
        setResults([]);
      }
    } catch (error) {
      toast.error("Failed to fetch trains");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#f2f6ff]">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-1 left-3 z-30 text-white p-2 rounded-full bg-black/20 md:top-5 md:left-5"
        aria-label="Go back"
      >
        <FaArrowLeftLong className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 md:py-16">
        <div className="w-full mx-auto px-4 md:max-w-7xl md:px-12 flex gap-4 items-center justify-center md:justify-start">
          <Image
            src="/irctc_logo_2.png"
            alt="IRCTC"
            width={32}
            height={32}
            className="rounded-[100%] md:w-10 md:h-10"
          />
          <h1 className="text-xl md:text-2xl font-semibold">Search Train</h1>
        </div>
      </div>

      {/* Main Search Card */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 md:-mt-10">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full md:w-fit justify-between">
            {["route", "train"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSearchMode(m as any);
                  setHasSearched(false); // Reset search state when switching modes
                }}
                className={`flex-1 text-sm md:text-base px-3 w-[15vh] h-[6vh] py-1 md:px-4 md:py-2 rounded-md transition-all ${
                  searchMode === m ? "bg-white shadow font-semibold text-blue-800" : "text-gray-600"
                }`}
              >
                {m === "route" ? "By Stations" : "By Train No"}
              </button>
            ))}
          </div>

          {searchMode === "route" ? (
            <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
              <div className="md:col-span-4 relative">
                <input
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  onFocus={() => setActiveField("from")}
                  className="w-full h-11 border rounded-lg px-3 text-sm"
                  placeholder="From Station"
                />
                {renderDropdown(fromQuery, setFromQuery, "from")}
              </div>

              <div className="md:col-span-4 relative">
                <input
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  onFocus={() => setActiveField("to")}
                  className="w-full h-11 border rounded-lg px-3 text-sm"
                  placeholder="To Station"
                />
                {renderDropdown(toQuery, setToQuery, "to")}
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="md:col-span-4 lg:col-span-2 h-11 bg-orange-500 text-white rounded-lg cursor-pointer font-semibold transition-all flex items-center justify-center min-w-[120px]"
              >
                {loading ? "Searching..." : "Search Trains"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <input
                value={trainNo}
                onChange={(e) => setTrainNo(e.target.value)}
                className="h-11 border rounded-lg px-3 w-full md:w-auto text-sm"
                placeholder="Enter 5-digit Train No"
                maxLength={5}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="h-11 bg-orange-500 text-white rounded-lg px-6 cursor-pointer font-semibold transition-all flex items-center justify-center min-w-[150px]"
              >
                {loading ? "Searching..." : "Search Train"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6 md:mt-8 pb-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {paginatedResults.map((train) => (
              <TrainCard key={train.trainNo} train={train} />
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-1 md:gap-2 items-center flex-wrap">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          page === currentPage ? "bg-orange-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
                    return <span key={page} className="px-2 text-gray-500">…</span>;
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ) : hasSearched ? (
          /* Empty State: Only shows if search was performed and no results found */
          <div className="bg-white rounded-xl p-12 shadow-md text-center border border-gray-100">
            <div className="text-5xl mb-4">🚂</div>
            <h3 className="text-xl font-bold text-gray-800">No Direct Trains Found</h3>
            <p className="text-gray-500 mt-2">
              We couldn't find any direct trains for this criteria. <br />
              Please check the station names or train number and try again.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}