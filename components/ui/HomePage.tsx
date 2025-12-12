"use client"
import { BadgeCheck, CheckCheck } from "lucide-react";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import React, { useState } from 'react';
import { Train, Calendar, MapPin, ArrowDownUp, Search, Menu, X, User, Bell, ChevronDown } from 'lucide-react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import { CustomUserButtonFallback } from '../clerk/CustomUserButton'; // Assuming correct path

import { useUser } from "@clerk/nextjs";
import Link from 'next/link';
import Navbar from "./Navbar";

const IRCTCHomepage = () => {


  const [fromStation, setFromStation] = useState('LUCKNOW NR - LKO (LUCKNOW)');
  const [toStation, setToStation] = useState('MORADABAD - MB');
  const [journeyDate, setJourneyDate] = useState('2025-11-09');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [quota, setQuota] = useState('GENERAL');
  const [disabilityConcession, setDisabilityConcession] = useState(false);
  const [flexibleDate, setFlexibleDate] = useState(false);
  const [availableBerth, setAvailableBerth] = useState(false);
  const [railwayPass, setRailwayPass] = useState(false);



  const { user, isLoaded } = useUser();
  // console.log(user?.fullName) 



  const today = new Date().toISOString().split("T")[0];
  const maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 120);
    return date.toISOString().split("T")[0];
  })();
  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearch = () => {
    toast.success('Searching trains from ' + fromStation + ' to ' + toStation);
  };
  const handleSearchViaDisksha = () => {
    toast.success('Feature is Under Alpha Phase');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">

      {/* 🚅 Top Header Bar (RESPONSIVE: Hides some elements on mobile) */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* --- AUTHENTICATION BUTTONS --- */}
            <SignedOut>
              {/* Login Button - Adjusted padding for better mobile fit */}
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 text-xs sm:px-4 sm:py-1.5 bg-blue-900 sm:text-sm text-white font-semibold rounded hover:bg-orange-500 transition">
                  Login
                </button>
              </SignInButton>
              {/* Sign Up Button - Adjusted padding for better mobile fit */}
              <SignUpButton mode="modal">
                <button className="px-3 py-1.5 text-xs sm:px-4 sm:py-1.5 bg-blue-900 sm:text-sm text-white font-semibold rounded hover:bg-orange-500 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              {/* Custom User Button with Name/Avatar */}
              <CustomUserButtonFallback /> <div className="flex items-center gap-1">
                <span className="hidden md:block text-gray-700 hover:text-blue-900 text-xs sm:text-sm font-bold">
                  {user?.fullName}
                </span>

                {/* VERIFIED BADGE */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="#1da1f2"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-sm"
                  style={{ borderRadius: "9999px" }}
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

            </SignedIn>

            {/* Hiding less critical links on mobile */}
            <button className="hidden md:block px-3 py-1.5 text-gray-700 hover:text-blue-900 text-xs sm:text-sm cursor-pointer">AGENT LOGIN</button>
            <button className="hidden sm:block px-3 py-1.5 text-gray-700 hover:text-blue-900 text-xs sm:text-sm cursor-pointer">CONTACT US</button>
            <button className="hidden sm:block px-3 py-1.5 text-gray-700 hover:text-blue-900 text-xs sm:text-sm cursor-pointer">HELP & SUPPORT</button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-red-600 font-semibold hidden md:inline text-xs sm:text-sm cursor-pointer">DAILY DEALS</span> {/* Visible on tablet+ */}
            <button className="px-3 py-1.5 text-gray-700 hover:text-blue-900 flex items-center text-xs sm:text-sm">
              <Bell className="w-4 h-4 mr-1" />
              <span className='hidden sm:inline cursor-pointer'>ALERTS</span>
            </button>
            <span className="text-gray-600 text-xs hidden lg:inline">
              {new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            {/* Visible on large screen */}
            <button className="px-3 py-1.5 text-gray-700 text-xs sm:text-sm">हिंदी</button>
          </div>
        </div>
      </div>

      {/* 🧭 Main Navigation */}
      <Navbar />




      {/* 🌟 Hero Section with Booking Form (RESPONSIVE & FIXED WIDTH) */}
      <div className="relative min-h-[500px] md:min-h-[700px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/bg4.jpg"
            alt="Train Background"
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-8 w-full">

          {/* Layout Grid: Stacks on mobile/tablet (grid-cols-1), splits on laptop (lg:grid-cols-2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left Side - Booking Form (Width Fix Applied Here) */}
            <div className="z-10 mx-auto w-full max-w-lg md:max-w-xl lg:max-w-full">
              {/* FIX: mx-auto centers the form on non-grid screens. 
                       max-w-lg/md:max-w-xl limits the width on tablets for a better appearance.
                       lg:max-w-full ensures it uses all available width in the left grid column. */}

              {/* Action Buttons: Stack on mobile, side-by-side on tablet/desktop */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                <button className="flex-1 bg-blue-900 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold hover:bg-blue-800 transition flex items-center justify-center rounded">
                  <span className="mr-2">📋</span> PNR STATUS
                </button>
                <button className="flex-1 bg-blue-900 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold hover:bg-blue-800 transition flex items-center justify-center rounded">
                  <span className="mr-2">📊</span> CHARTS / VACANCY
                </button>
              </div>

              {/* Booking Card */}
              <div className="shadow-2xl pt-4 p-4 sm:p-6 bg-white rounded-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4 text-center">BOOK TICKET</h2>
                <div className="space-y-4">

                  {/* From Station */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={fromStation}
                        onChange={(e) => setFromStation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center -my-2">
                    <button
                      onClick={swapStations}
                      className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition border-2 border-blue-500"
                    >
                      <ArrowDownUp className="w-4 h-4 text-blue-900" />
                    </button>
                  </div>

                  {/* To Station */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={toStation}
                        onChange={(e) => setToStation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Date and Class Selection: Stack on mobile (default), side-by-side on md/tablet+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DD/MM/YYYY <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

                        <input
                          type="date"
                          value={journeyDate}
                          min={today}
                           max={maxDate}
                          onChange={(e) => setJourneyDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <div className="relative">
                        <Train className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white text-sm"
                        >
                          <option>All Classes</option>
                          <option>Sleeper (SL)</option>
                          <option>AC 3 Tier (3A)</option>
                          <option>AC 2 Tier (2A)</option>
                          <option>AC First Class (1A)</option>
                          <option>Second Sitting (2S)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Quota Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quota</label>
                    <div className="relative">
                      <select
                        value={quota}
                        onChange={(e) => setQuota(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white text-sm"
                      >
                        <option>GENERAL</option>
                        <option>LADIES</option>
                        <option>LOWER BERTH</option>
                        <option>PERSON WITH DISABILITY</option>
                        <option>DUTY PASS</option>
                        <option>TATKAL</option>
                        <option>PREMIUM TATKAL</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Checkboxes: Stack on extra-small mobile, side-by-side on sm/mobile+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <label className="flex items-center space-x-2 text-xs sm:text-sm text-blue-900 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disabilityConcession}
                        onChange={(e) => setDisabilityConcession(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Person With Disability Concession</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs sm:text-sm text-blue-900 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flexibleDate}
                        onChange={(e) => setFlexibleDate(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Flexible With Date</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs sm:text-sm text-blue-900 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={availableBerth}
                        onChange={(e) => setAvailableBerth(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Train with Available Berth</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs sm:text-sm text-blue-900 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={railwayPass}
                        onChange={(e) => setRailwayPass(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>Railway Pass Concession</span>
                    </label>
                  </div>

                  {/* Search Buttons: Stack on mobile (default), side-by-side on tablet/desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <button
                      onClick={handleSearch}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 md:py-4 rounded-lg transition flex items-center justify-center shadow-lg text-base"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </button>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 md:py-4 rounded-lg transition shadow-lg text-base"
                      onClick={handleSearchViaDisksha}
                    >
                      Easy Booking on AskDISHA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Branding and Chatbot (Hidden on mobile/tablet) */}
            <div className="hidden lg:flex flex-col text-right justify-center items-center z-10 pt-10 ">
              <h1 className="text-5xl xl:text-7xl font-bold text-white mb-4">
                INDIAN RAILWAYS
              </h1>
              <div className="flex justify-center space-x-8 text-xl xl:text-2xl text-white">
                <span>Safety</span>
                <span>|</span>
                <span>Security</span>
                <span>|</span>
                <span>Punctuality</span>
              </div>
              {/* Chatbot Image */}
              <div className='mt-40'>
                <img
                  src="/chatbot.png"
                  alt="AskDISHA Chatbot"
                  className='w-56 h-56 xl:w-64 xl:h-64 object-contain cursor-pointer'
                  onClick={() => {
                    toast.success("Feature is Under Aplha Phase")
                  }}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IRCTCHomepage;