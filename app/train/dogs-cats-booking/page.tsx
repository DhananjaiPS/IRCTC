"use client";

import { FaArrowLeftLong } from "react-icons/fa6";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, PawPrint } from "lucide-react";
import toast from "react-hot-toast";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const petImages = [
  { src: "/pet3.webp", text: "Dedicated space for your feline companions" },
  { src: "/pet4.webp", text: "Travel in comfort with your best friend" },
  { src: "/pet6.webp", text: "Secure First Class AC Pet Cabins" },
  // { src: "/pet7.webp", text: "Simplified booking for large dog breeds" },
  // { src: "/pet5.webp", text: "Making every journey a family journey" },
];

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f2f6ff] overflow-x-hidden pb-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm"
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
              Dogs & Cats Booking
            </h1>
            <p className="text-sm opacity-90">
              Book travel for pets as per Indian Railways rules
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 space-y-6">

        {/* Carousel - Matching Form Width */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="w-full h-50 sm:h-64"
          >
            {petImages.map((pet, index) => (
              <SwiperSlide key={index} className="relative">
                <Image
                  src={pet.src}
                  alt={`Pet ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <p className="text-white text-xl sm:text-3xl font-bold text-center px-6">
                    {pet.text}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Passenger Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Passenger Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Passenger Name"
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="PNR Number"
                maxLength={10}
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Pet Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <PawPrint size={18} />
              Pet Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500">
                <option>Pet Type</option>
                <option>Dog</option>
                <option>Cat</option>
              </select>
              <input
                type="text"
                placeholder="Breed"
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Pet Weight (kg)"
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
              />
              <select className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500">
                <option>Health Certificate</option>
                <option>Available</option>
                <option>Not Available</option>
              </select>
            </div>
          </div>

          {/* Journey Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Journey Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Train Number"
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
              />
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500">
                <Calendar size={16} className="text-gray-400 mr-2" />
                <input
                  type="date"
                  className="w-full text-sm outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-medium mb-1 text-yellow-800">
              Important Declaration
            </p>
            <ul className="list-disc ml-4 space-y-1 text-gray-700">
              <li>Pets are allowed only in First AC</li>
              <li>Separate luggage charges apply at the parcel office</li>
              <li>Health certificate is mandatory from a vet</li>
              <li>Owner is fully responsible for pet's behavior</li>
            </ul>
            <div className="mt-3 flex items-center gap-2">
              <input type="checkbox" id="agree" className="cursor-pointer" />
              <label htmlFor="agree" className="text-xs cursor-pointer">
                I agree to the rules and responsibilities
              </label>
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-lg font-medium shadow-md active:scale-[0.98]"
            onClick={() => {
              toast.success("Feature is Under Alpha Phase")
            }}
          >
            Proceed for Pet Booking
          </button>
        </div>
      </div>
    </div>
  );
}