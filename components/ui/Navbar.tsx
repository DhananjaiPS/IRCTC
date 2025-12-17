"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

// --- Link Data (Completed from desktop menus) ---
const TRAINS_LINKS = [
    { label: "Book Ticket", href: "/" },
    { label: "Foreign Tourist Booking", href: "train/foreign-tourist-booking" },
    { label: "Connecting Journey Booking", href: "/train/connecting-journey-booking" },
    { label: "Search TRAINS", href: "train/train-search" },
    { label: "Cancel Ticket", href: "/train/cancel-ticket" },
    { label: "PNR Enquiry", href: "/train/pnr-enquiry" },
    { label: "Train Schedule", href: "/train/train-schedule" },
    { label: "Track Your Train", href: "/train/track-your-train" },
    { label: "FTR Coach/Train Booking", href: "/train/ftr-coach-train-booking" },
    { label: "Dogs/Cats Booking", href: "/train/dogs-cats-booking" },
];

const LOYALTY_LINKS = [
    { label: "About Loyalty Program", href: "https://contents.irctc.co.in/en/AboutLoyalty.html" },
    { label: "IRCTC SBI Credit Card", href: "https://contents.irctc.co.in/en/AboutSBICobrandCard.html" },
    { label: "IRCTC BOB Credit Card", href: "https://contents.irctc.co.in/en/AboutBOBCobrandCard.html" },
    { label: "IRCTC HDFC Credit Card", href: "https://contents.irctc.co.in/en/About_IRCTC_HDFC_CobrandCard.html" },
    { label: "IRCTC RBL Credit Card", href: "https://contents.irctc.co.in/en/aboutrbl.html" },
    { label: "Add Loyalty Account", href: "/" },
];

const MORE_LINKS = [
    { label: "ChatBot as a Service (CaaS)", href: "/caas" },
    { label: "Link Your Aadhaar", href: "/link-aadhaar" },
    { label: "Counter Ticket Cancellation", href: "/counter-ticket-cancellation" },
    { label: "Counter Ticket Boarding Point Change", href: "/counter-ticket-boarding-change" },
    { label: "FORGOT ACCOUNT DETAILS?", href: "/forgot-account-details" },
    { label: "AT STATIONS", href: "/at-stations" },
    { label: "WI-Fi Railway Stations", href: "/wi-fi-railway-stations" },
    { label: "Battery Operated Cars", href: "/battery-operated-cars" },
];

// --- Component Props Definitions ---
type MobileMenuItemProps = {
    label: string;
    href: string;
    onClick: () => void;
    accent?: boolean;
};

type AccordionItemProps = {
    menuKey: string;
    label: string;
    links: { label: string; href: string }[];
    accent?: boolean;
    // State props passed from parent
    submenuOpen: string | null;
    setSubmenuOpen: React.Dispatch<React.SetStateAction<string | null>>;
    closeMobileMenu: () => void;
};


function Navbar() {
    // State management:
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Controls mobile menu container visibility
    const [open, setOpen] = useState(false); // Controls Desktop IRCTC EXCLUSIVE dropdown
    const [submenuOpen, setSubmenuOpen] = useState<string | null>(null); // Controls Desktop HOVER menu or Mobile ACCORDION
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // --- Helper Functions ---

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setSubmenuOpen(null); // Close any open accordion/submenu
    };

    // Desktop Hover Logic
    const handleMouseEnter = (menu: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // This variable is used for both desktop hover AND mobile accordion, as per your structure
        setSubmenuOpen(menu);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            // Only close if we are not in the mobile view
            if (!mobileMenuOpen) {
                setSubmenuOpen(null);
            }
        }, 300);
    };

    // --- Sub-Components (Defined inside Navbar to use state functions) ---

    const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
        label,
        href,
        onClick,
        accent = false,
    }) => (
        <Link href={href} onClick={onClick}>
            <div
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 text-sm ${accent ? "text-orange-600 font-semibold" : "text-gray-700"
                    }`}
            >
                {label}
            </div>
        </Link>
    );

    const AccordionItem: React.FC<AccordionItemProps> = ({
        menuKey,
        label,
        links,
        accent = false,
        submenuOpen,
        setSubmenuOpen,
        closeMobileMenu,
    }) => {
        const isOpen = submenuOpen === menuKey;

        const toggleAccordion = () => {
            setSubmenuOpen(isOpen ? null : menuKey);
        };

        return (
            <div className="border-b border-gray-100">
                <button
                    onClick={toggleAccordion}
                    className={`w-full flex justify-between items-center px-4 py-3 text-sm ${accent ? "text-orange-600 font-semibold" : "text-gray-700 font-semibold"
                        }`}
                >
                    {label}
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isOpen && (
                    <div className="pl-6 pr-2 pb-2 bg-gray-50 space-y-1 transition-all duration-300">
                        {links.map((link) => (
                            <Link key={link.label} href={link.href} onClick={closeMobileMenu}>
                                <div className="w-full text-left px-4 py-2 hover:bg-white rounded text-xs text-gray-600">
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
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
                                        className="w-7 h-7 text-gray-600"
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

                            {/* IRCTC EXCLUSIVE Dropdown (Uses 'open' state) */}
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900">
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
                                                className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-start gap-2 items-center "
                                                onMouseEnter={() => handleMouseEnter("ewallet-desktop-sub")}
                                                onMouseLeave={handleMouseLeave}
                                            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-hand-coins-icon lucide-hand-coins text-blue-900"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                                                IRCTC eWallet
                                                {/* Note: Using a unique key for the nested submenu to avoid conflict */}
                                                {submenuOpen === "ewallet-desktop-sub" && (
                                                    <ul className="absolute left-full top-0 mt-0 ml-1 w-60 bg-white border border-gray-200 rounded shadow-lg z-50">
                                                        <Link href={"/ewallet-user-guide"}>
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

                            {/* TRAINS (Uses 'submenuOpen' state) */}
                            <div
                                className="relative px-2 py-2 text-xs text-orange-600 font-semibold border-b-2 border-orange-600 shrink-0 cursor-pointer"
                                onMouseEnter={() => handleMouseEnter("trains")}
                                onMouseLeave={handleMouseLeave}
                            >
                                TRAINS
                                {submenuOpen === "trains" && (
                                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 text-gray-600 rounded shadow-lg z-50">
                                        {TRAINS_LINKS.map(link => (
                                            <Link key={link.label} href={link.href}>
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{link.label}</li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* LOYALTY (Uses 'submenuOpen' state) */}
                            <div
                                className="relative px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0 cursor-pointer"
                                onMouseEnter={() => handleMouseEnter("loyalty")}
                                onMouseLeave={handleMouseLeave}
                            >
                                LOYALTY
                                {submenuOpen === "loyalty" && (
                                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 text-gray-600 rounded shadow-lg z-50">
                                        {LOYALTY_LINKS.map(link => (
                                            <Link key={link.label} href={link.href}>
                                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{link.label}</li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* eWallet (Uses 'submenuOpen' state) */}
                            <div
                                className="relative w-auto bg-yellow-100 px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0 cursor-pointer"
                                onMouseEnter={() => handleMouseEnter("ewallet-desktop")}
                                onMouseLeave={handleMouseLeave}
                            >
                                eWallet
                                {submenuOpen === "ewallet-desktop" && (
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

                            {/* MORE (Uses 'submenuOpen' state) */}
                            <button
                                className="px-2 py-2 text-xs font-semibold text-gray-700 hover:text-blue-900 shrink-0 relative"
                                onMouseEnter={() => handleMouseEnter("more")}
                                onMouseLeave={handleMouseLeave}
                            >
                                MORE
                                {submenuOpen === "more" && (
                                    <ul className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 rounded shadow-lg z-50 text-left">
                                        {MORE_LINKS.map(link => (
                                            <li key={link.label} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </button>

                        </div>

                        {/* Right Logo */}
                        <div className="w-32 md:w-48 lg:w-60 h-12 sm:h-16 flex justify-center items-center shrink-0">
                            <img
                                src="/logo3.png"
                                alt="IRCTC Logo"
                                className="object-contain h-full hidden lg:block"
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

            {/* ===================== MOBILE MENU (Fixed Accordion Logic) ===================== */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-50 lg:hidden overflow-y-auto">

                    {/* Header and Close Button */}
                    <div className="bg-blue-900 text-white flex justify-between items-center px-4 py-3 shadow-md">
                        <span className="font-semibold">IRCTC Services</span>
                        <button onClick={closeMobileMenu} className="p-1 rounded-full hover:bg-blue-800">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="py-2">

                        {/* 1. TRAINS (Accordion) - Uses 'submenuOpen' for state management */}
                        <AccordionItem
                            menuKey="trains"
                            label="TRAINS"
                            links={TRAINS_LINKS}
                            accent={true}
                            submenuOpen={submenuOpen}
                            setSubmenuOpen={setSubmenuOpen}
                            closeMobileMenu={closeMobileMenu}
                        />

                        {/* 2. LOYALTY (Accordion) */}
                        <AccordionItem
                            menuKey="loyalty"
                            label="LOYALTY"
                            links={LOYALTY_LINKS}
                            submenuOpen={submenuOpen}
                            setSubmenuOpen={setSubmenuOpen}
                            closeMobileMenu={closeMobileMenu}
                        />

                        {/* 3. MORE (Accordion) */}
                        <AccordionItem
                            menuKey="more"
                            label="MORE"
                            links={MORE_LINKS}
                            submenuOpen={submenuOpen}
                            setSubmenuOpen={setSubmenuOpen}
                            closeMobileMenu={closeMobileMenu}
                        />

                        {/* 4. IRCTC EXCLUSIVE (Direct Link) */}
                        <MobileMenuItem
                            label="IRCTC EXCLUSIVE"
                            href={"/exclusive-home-or-redirect"}
                            onClick={closeMobileMenu}
                        />

                        {/* 5. IRCTC eWallet (Direct Link - using the main desktop link) */}
                        <MobileMenuItem
                            label="IRCTC eWallet"
                            href={"https://contents.irctc.co.in/en/AboutEwallet.pdf"}
                            onClick={closeMobileMenu}
                        />

                        {/* --- Direct Links (No Submenu) --- */}
                        <MobileMenuItem
                            label="BUSES"
                            href={"/buses"}
                            onClick={closeMobileMenu}
                        />
                        <MobileMenuItem
                            label="FLIGHTS"
                            href={"/flights"}
                            onClick={closeMobileMenu}
                        />
                        <MobileMenuItem
                            label="HOTELS"
                            href={"/hotels"}
                            onClick={closeMobileMenu}
                        />
                        <MobileMenuItem
                            label="HOLIDAYS"
                            href={"/holidays"}
                            onClick={closeMobileMenu}
                        />
                        <MobileMenuItem
                            label="MEALS"
                            href={"/meals"}
                            onClick={closeMobileMenu}
                        />
                        <MobileMenuItem
                            label="PROMOTIONS"
                            href={"/promotions"}
                            onClick={closeMobileMenu}
                        />

                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;