"use client"; // if using Next.js 13 app router
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-white">

      <div className=" flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">
          Page is Under Development
        </span>
      </div>


      <div className="mb-6 mt-3">
        <Image
          src="/404_gif.gif"
          alt="404"
          width={750}   // adjust width
          height={750}  // adjust height
          className="object-contain"
        />
      </div>

      {/* Go Home Button */}
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
