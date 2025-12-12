"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Functions to handle hover delay
    const handleMouseEnter = (menu: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSubmenuOpen(menu);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setSubmenuOpen(null), 300); // 300ms delay
    };

    return (
        <div>
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center py-3">
                        {/* Left Logo */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                                <img
                                    src="/irctc_logo_2.png"
                                    alt="Indian Railways Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                            </div>

                            {/* Home btn */}
                            <button className="p-2 hover:bg-gray-100 rounded hidden sm:block">
                                <Link href="/">
                                    <svg
                                        className="w-6 h-6 text-gray-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </Link>
                            </button>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-4">

                            {/* IRCTC EXCLUSIVE Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setOpen(true)}
                                onMouseLeave={() => setOpen(false)}
                            >
                                <button className=" px-3 py-2 w-[18vh] bg-blue-900 text-xs text-white font-semibold rounded hover:bg-blue-800 shrink-0">
                                    IRCTC EXCLUSIVE
                                </button>

                                {open && (
                                    <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fadeIn">
                                        <ul className="py-2 text-sm text-gray-700">
                                            {/* IRCTC-iPay */}
                                            <Link href={"https://contents.irctc.co.in/en/irctc_ipay_english.pdf"}>
                                                <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                    <Image
                                                        src="/IRCTC_logo.png"
                                                        width={22}
                                                        height={22}
                                                        alt="IRCTC-iPay"
                                                        className="object-contain"
                                                    />
                                                    <span>IRCTC-iPay</span>
                                                </li>
                                            </Link>

                                            {/* Gift Card */}
                                            <Link href={'https://irctcgiftcards.razorpay.com/?utm_source=irctc&utm_medium=web&utm_campaign=irctc_rewards'}>
                                                <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="8" width="18" height="4" rx="1" />
                                                        <path d="M12 8v13" />
                                                        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                                                        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                                                    </svg>
                                                    <span>Gift Card</span>
                                                </li>
                                            </Link>


                                            {/* eWallet with submenu */}
                                            <li
                                                className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onMouseEnter={() => handleMouseEnter("ewallet")}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                IRCTC eWallet
                                                {submenuOpen === "ewallet" && (
                                                    <ul className="absolute left-full top-0 mt-0 ml-1 w-60 bg-white border border-gray-200 rounded shadow-lg z-50">
                                                        <Link href={"https://www.irctc.co.in/ewallet-user-guide"}>
                                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                                IRCTC eWallet User Guide
                                                            </li>
                                                        </Link>
                                                    </ul>
                                                )}
                                            </li>

                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Other navbar buttons */}
                            <div
                                className="relative px-2 py-2 text-xs text-orange-600 font-semibold border-b-2 border-orange-600 shrink-0 cursor-pointer"
                                onMouseEnter={() => handleMouseEnter("trains")}
                                onMouseLeave={handleMouseLeave}
                            >
                                TRAINS
                                {submenuOpen === "trains" && (
                                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 text-gray-600 rounded shadow-lg z-50">
                                        <Link href={"https://www.irctc.co.in/nget/train-search"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Book Ticket</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/foreign-tourist-booking"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Foreign Tourist Booking</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/connecting-journey-booking"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Connecting Journey Booking</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/trains"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">IRCTC TRAINS</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/cancel-ticket"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cancel Ticket</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/pnr-enquiry"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">PNR Enquiry</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/train-schedule"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Train Schedule</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/track-your-train"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Track Your Train</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/ftr-coach-train-booking"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">FTR Coach/Train Booking</li>
                                        </Link>
                                        <Link href={"https://www.irctc.co.in/dogs-cats-booking"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dogs/Cats Booking</li>
                                        </Link>
                                    </ul>
                                )}
                            </div>

                            <div
                                className="relative px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0 cursor-pointer"
                                onMouseEnter={() => handleMouseEnter("loyalty")}
                                onMouseLeave={handleMouseLeave}
                            >
                                LOYALTY
                                {submenuOpen === "loyalty" && (
                                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 text-gray-600 rounded shadow-lg z-50">
                                        <Link href={"https://contents.irctc.co.in/en/AboutLoyalty.html"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">About IRCTC Loyalty program</li>
                                        </Link>
                                        <Link href={"https://contents.irctc.co.in/en/AboutSBICobrandCard.html"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">IRCTC SBI Credit Card</li>
                                        </Link>
                                        <Link href={"https://contents.irctc.co.in/en/AboutBOBCobrandCard.html"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">IRCTC BOB Credit Card</li>
                                        </Link>
                                        <Link href={"https://contents.irctc.co.in/en/About_IRCTC_HDFC_CobrandCard.html"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">IRCTC HDFC Credit Card</li>
                                        </Link>
                                        <Link href={"https://contents.irctc.co.in/en/aboutrbl.html"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">IRCTC RBL Credit Card</li>
                                        </Link>
                                        <Link href={"/"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Add Loyalty Account</li>
                                        </Link>
                                    </ul>
                                )}
                            </div>

                            <div
                                className="relative w-auto bg-yellow-100 px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0 cursor-pointer"
                                onMouseEnter={() => handleMouseEnter("ewallet")}
                                onMouseLeave={handleMouseLeave}
                            >
                                eWallet
                                {submenuOpen === "ewallet" && (
                                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 rounded shadow-lg z-50">
                                        <Link href={"https://contents.irctc.co.in/en/AboutEwallet.pdf"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                About IRCTC eWallet
                                            </li>
                                        </Link>
                                        <Link href={"https://contents.irctc.co.in/en/EwalletUserGuide.pdf"}>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                IRCTC eWallet User Guide
                                            </li>
                                        </Link>
                                    </ul>
                                )}
                            </div>

                            <button className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0">
                                BUSES
                            </button>
                            <button className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0">
                                FLIGHTS
                            </button>
                            <button className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0">
                                HOTELS
                            </button>
                            <button className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0">
                                HOLIDAYS
                            </button>
                            <button className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0">
                                MEALS
                            </button>
                            <button className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0">
                                PROMOTIONS
                            </button>
                            <button
                                className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0 relative"
                                onMouseEnter={() => handleMouseEnter("more")}
                                onMouseLeave={handleMouseLeave}
                            >
                                MORE
                                {submenuOpen === "more" && (
                                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 rounded shadow-lg z-50 text-left">
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/caas" target="_blank" rel="noopener noreferrer">
                                                ChatBot as a Service (CaaS)
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/link-aadhaar" target="_blank" rel="noopener noreferrer">
                                                Link Your Aadhaar
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/counter-ticket-cancellation" target="_blank" rel="noopener noreferrer">
                                                Counter Ticket Cancellation
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/counter-ticket-boarding-change" target="_blank" rel="noopener noreferrer">
                                                Counter Ticket Boarding Point Change
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/forgot-account-details" target="_blank" rel="noopener noreferrer">
                                                FORGOT ACCOUNT DETAILS?
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/at-stations" target="_blank" rel="noopener noreferrer">
                                                AT STATIONS
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/wi-fi-railway-stations" target="_blank" rel="noopener noreferrer">
                                                WI-Fi Railway Stations
                                            </a>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <a href="/battery-operated-cars" target="_blank" rel="noopener noreferrer">
                                                Battery Operated Cars
                                            </a>
                                        </li>
                                    </ul>
                                )}
                            </button>

                        </div>

                        {/* Right Logo */}
                        <div className="w-32 sm:w-48 lg:w-60 h-12 sm:h-16 flex justify-center items-center shrink-0">
                            <img
                                src="/logo3.png"
                                alt="IRCTC Logo"
                                className="object-contain h-full hidden sm:block"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </div>

                        {/* Mobile Menu Icon */}
                        <button
                            className="lg:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white shadow-lg absolute w-full z-20">
                    <div className="px-4 py-2 space-y-1">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            IRCTC EXCLUSIVE
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-orange-600 text-sm">
                            TRAINS
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            LOYALTY
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            IRCTC eWallet
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            BUSES
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            FLIGHTS
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            HOTELS
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            HOLIDAYS
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            MEALS
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            PROMOTIONS
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm">
                            MORE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
