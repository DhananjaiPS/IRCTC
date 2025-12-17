"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f2f6ff] overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-50"
      >
        <FaArrowLeftLong className="text-white text-lg" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <Image
            src="/irctc_logo_2.png"
            alt="IRCTC Logo"
            width={40}
            height={40}
            className="rounded-full"
          />

          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              Cancel Ticket
            </h1>
            <p className="text-sm opacity-90">
              Cancel full or partial ticket and check refund details
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Ticket Card */}
      <div className="max-w-3xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* PNR Input */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Enter PNR Number
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="10 digit PNR number"
              className="mt-2 w-full border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Passenger Selection */}
          <div>
            <h2 className="text-sm font-semibold mb-3">
              Select Passenger(s) to Cancel
            </h2>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Passenger 1 – CNF
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Passenger 2 – WL/3
              </label>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Reason for Cancellation
            </label>
            <select className="mt-2 w-full border rounded-lg px-4 py-2 text-sm outline-none">
              <option>Select reason</option>
              <option>Change of Plan</option>
              <option>Train Cancelled</option>
              <option>Medical Emergency</option>
              <option>Other</option>
            </select>
          </div>

          {/* Refund Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium mb-1">
                  Refund Information
                </p>
                <ul className="list-disc ml-4 space-y-1 text-gray-700">
                  <li>Refund amount depends on cancellation time</li>
                  <li>Clerkage charges are non-refundable</li>
                  <li>Refund credited to original payment method</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" />
            <span>
              I understand the cancellation rules and refund policy
            </span>
          </div>

          {/* CTA */}
          <button className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-lg font-medium">
            Cancel Selected Ticket(s)
          </button>
        </div>
      </div>
    </div>
  );
}
