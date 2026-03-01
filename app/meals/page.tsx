"use client";
import React, { useState } from 'react';
import {
  Search, TrainFront, Users, ShoppingBag, UtensilsCrossed,
  Zap, ChevronDown, Clock, Scale, Menu, X, ArrowRight,
  ChevronLeft
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const MealPage = () => {
  // Menu button removed from UI, but keeping state to avoid breaking potential logic
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen font-sans text-slate-900 antialiased bg-white">

      {/* 1. FIXED VIDEO BACKGROUND - Optimized */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4] scale-105"
        >
          <source src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095810.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-slate-900" />
      </div>

      {/* 2. MODERN NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-[100] transition-all duration-300 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* BACK BUTTON */}
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 text-white/80 hover:text-white transition-all group"
          >
            <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
              <ChevronLeft size={20} />
            </div>
            <span className="text-sm font-bold tracking-widest hidden sm:block">BACK</span>
          </button>
          <div className="flex items-center gap-3 mx-auto md:mx-0"> {/* Centered on mobile */}
            <div className="bg-white p-1 rounded-full shadow-lg">
              <Image src="/irctc_logo.png" alt="IRCTC" width={45} height={45} className="w-8 h-8 sm:w-11 sm:h-11 object-contain" />
            </div>
            <span className="text-white font-black tracking-tighter text-xl sm:block">E-CATERING</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-white/90 text-sm font-bold uppercase tracking-widest">
            <div className="h-4 w-[1px] bg-white/20" />
          </div>

          {/* Mobile Menu Button - REMOVED AS REQUESTED */}
        </div>
      </nav>

      {/* 3. HERO SECTION - PNR SEARCH (Main Action) */}
      <section className="relative z-10 pt-32 pb-20 px-6"> {/* Added px-6 for mobile breathability */}
        <div className="container mx-auto max-w-5xl text-center flex flex-col items-center"> {/* Force center on mobile */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black mb-6 animate-bounce">
            <Zap size={14} /> NEW: GROUP BOOKING DISCOUNTS
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.2] drop-shadow-2xl text-center">
            Swaad Jo Safar Ko <br /> <span className="text-orange-500">Yaadgar Banaye</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 mb-10 max-w-2xl mx-auto font-medium text-center">
            India's most trusted food delivery in train. Order from 500+ brands and get it delivered right to your seat.
          </p>

          {/* Glassmorphic Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl md:rounded-full border border-white/20 shadow-2xl w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center gap-4 px-6 w-full">
              <TrainFront className="text-orange-500 hidden sm:block" />
              <input
                type="text"
                placeholder="Enter 10-digit PNR to start..."
                className="bg-transparent text-white w-full py-4 text-center md:text-left text-lg md:text-xl font-bold outline-none placeholder:text-white/40"
              />
            </div>
            <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl md:rounded-full font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-95" onClick={() => { toast.success("Food E-CATERING coming soon! Stay tuned 🚀") }}>
              FIND FOOD <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS - Minimal & Clean */}
      <section className="relative z-10 bg-white rounded-t-[3rem] -mt-10 pt-20 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-4 text-center md:text-left">
            <div>
              <p className="text-orange-500 font-black text-sm uppercase tracking-[0.2em] mb-2">Process</p>
              <h2 className="text-3xl md:text-3xl font-black text-slate-900">How it works</h2>
            </div>
            <p className="text-slate-500 font-medium max-w-md">3 simple steps to get your favorite meal delivered at your train seat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Outlet",
                desc: "Enter PNR and select from wide range of restaurants.",
                img: "https://neon.ipsator.com/c/image/upload/c_scale,h_300,q_75/v1633022435/irctc/images/how-it-works-1.webp"
              },
              {
                step: "02",
                title: "Complete Order",
                desc: "Pick your food and pay online or via Cash on Delivery.",
                img: "https://neon.ipsator.com/c/image/upload/c_scale,h_300,q_75/v1633022435/irctc/images/how-it-works-2.webp"
              },
              {
                step: "03",
                title: "Enjoy Food",
                desc: "Fresh food delivered to your coach as the train arrives.",
                img: "https://neon.ipsator.com/c/image/upload/c_scale,h_300,q_75/v1633022435/irctc/images/how-it-works-3.webp"
              }
            ].map((item, i) => (
              <div key={i} className="group relative bg-slate-50 rounded-[2.5rem] p-4 overflow-hidden border border-slate-100 transition-all hover:bg-white hover:shadow-2xl text-center md:text-left">
                <div className="relative h-48 sm:h-64 w-full rounded-[2rem] overflow-hidden mb-6">
                  <Image src={item.img} alt={item.title} fill className="object-contain transition-transform group-hover:scale-110 duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-slate-900">
                    {item.step}
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-xl sm:text-2xl font-black mb-2">{item.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AUTHORISED PARTNERS GRID - Responsive */}
      <section className="relative z-10 bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-12 md:mb-16 text-slate-900">
            Trusted by Top <span className="text-orange-500">Food Partners</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { name: "Zomato", url: "https://b.zmtcdn.com/data/o2_assets/d1eee2be61cf47e2332cb7c49475c0981739777714.png" },
              { name: "Blinkit", url: "https://b.zmtcdn.com/data/o2_assets/071cb96db84f20eea3a39804e113bdee1739777655.png" },
              { name: "Swiggy", url: "https://neon.ipsator.com/c/image/upload/q_75,w_240/v1728996860/irctc/vendor/homeLogos/swiggy.webp" },
              { name: "Dominos", url: "https://neon.ipsator.com/c/image/upload/q_75/v1656686131/irctc/vendor/homeLogos/dominos.webp" },
              { name: "Lunchbox", url: "https://neon.ipsator.com/c/image/upload/q_75,w_240/v1688637297/irctc/vendor/homeLogos/rebel-lunchbox.webp" },
              { name: "Ovenstory", url: "https://neon.ipsator.com/c/image/upload/q_75,w_240/v1688637297/irctc/vendor/homeLogos/rebel-ovenstory.webp" },
              { name: "Faasos", url: "https://neon.ipsator.com/c/image/upload/q_75,w_240/v1688637297/irctc/vendor/homeLogos/rebel-faasos.webp" },
              { name: "Behrouz", url: "https://neon.ipsator.com/c/image/upload/q_75,w_240/v1688637297/irctc/vendor/homeLogos/rebel-behrouz.webp" },
            ].map((partner, i) => (
              <div
                key={i}
                className="group bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center justify-center cursor-pointer hover:-translate-y-2"
              >
                <div className="relative w-full h-12 md:h-20">
                  <Image
                    src={partner.url}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MEALS & RATES TABLE - Mobile Scrollable */}
      <section className="relative z-10 bg-white py-24 px-4 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-orange-600 font-black text-xs uppercase tracking-[0.3em] px-3 py-1 bg-orange-50 rounded-full">Official Rates</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Standard <span className="text-orange-500">Menu</span>
              </h2>
            </div>
            <p className="text-slate-500 font-medium max-w-xs text-sm md:text-right">
              Affordable, hygienic, and approved by IRCTC. Freshness delivered to your berth.
            </p>
          </div>

          {/* Modern Grid instead of a boring Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Standard Veg Thali",
                qty: "500g",
                price: "120",
                img: "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?w=900&auto=format&fit=crop&q=60"
              },
              {
                name: "Egg Thali Casserole",
                qty: "520g",
                price: "140",
                img: "https://media.istockphoto.com/id/510801964/photo/indian-vegetarian-dish-thali-with-lentil-on-metal-plate.webp?a=1&b=1&s=612x612&w=0&k=20&c=xVVLnk7b-fnjHuWQpnCyb2BUiWDvvxIMpSHCCEvUtfw="
              },
              {
                name: "Chicken Thali",
                qty: "550g",
                price: "170",
                img: "https://media.istockphoto.com/id/510801272/photo/indian-dish-thali-with-curry-and-tandoori-chicken.webp?a=1&b=1&s=612x612&w=0&k=20&c=z-4kxa00awYC86KeqUnAh_0YHpqH8dIGAqb2R9Yi4HE="
              },
              {
                name: "Veg Dum Biryani",
                qty: "350g",
                price: "110",
                img: "https://media.istockphoto.com/id/1292442851/photo/traditional-hyderabadi-vegetable-veg-dum-biryani-with-mixed-veggies-served-with-mixed-raita.webp?a=1&b=1&s=612x612&w=0&k=20&c=YTQkdUfr2PCncJmxsaijhxi2xQ7gtfQFB5_EGmC1NF4="
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full rounded-[2rem] overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Price Tag Floating */}
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                    <span className="text-orange-600 font-black text-lg">₹{item.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> Veg
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Scale size={14} />
                      <span className="text-xs font-bold uppercase tracking-widest">{item.qty}</span>
                    </div>
                    <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-orange-500 transition-all active:scale-90">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer Info */}
          <div className="mt-16 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
            <p className="text-slate-400 text-xs font-medium italic">
              * Prices mentioned are inclusive of GST. Images are for illustration purposes. Actual menu may vary according to the service zone.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="relative z-10 bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Image src="/irctc_logo.png" alt="Logo" width={40} height={40} />
            <span className="font-black text-xl">IRCTC E-Catering</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-slate-500 mb-12">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
            <a href="#">Contact Us</a>
          </div>
          <p className="text-slate-400 text-xs">© 2026 IRCTC - Indian Railway Catering and Tourism Corporation Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MealPage;