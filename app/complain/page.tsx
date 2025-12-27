"use client";

import React, { useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MessageSquare, User, Hash, Paperclip, AlertCircle, Loader2, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function ComplainPage() {
    const router = useRouter();
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const inputStyle = "w-full border border-gray-200 rounded-lg px-4 h-11 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/complain", { method: "POST", body: formData });
            if (res.ok) {
                toast.success("Complaint submitted successfully!");
                (e.target as HTMLFormElement).reset();
                setFileName("");
            } else {
                toast.error("Submission failed.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2f6ff] pb-10">
            <button onClick={() => router.back()} className="fixed top-5 left-5 z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition-all">
                <FaArrowLeftLong className="text-white text-lg" />
            </button>

            <div className="bg-gradient-to-r from-[#003399] to-[#0052cc] text-white py-16">
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
                    <div className="bg-white p-1 rounded-full shadow-lg">
                        <Image src="/irctc_logo_2.png" alt="IRCTC Logo" width={50} height={50} className="rounded-full" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">IRCTC Complaint Portal</h1>
                        <p className="text-xs sm:text-sm opacity-90 uppercase tracking-widest">Indian Railways Grievance Redressal</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-10">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-[#ef6c00] h-2 w-full"></div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        {/* Section 1: Passenger Info */}
                        <div className="space-y-4">
                            <h2 className="text-gray-800 font-bold flex items-center gap-2 border-b pb-2">
                                <User size={18} className="text-blue-700" />
                                Journey & Passenger Details
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input name="fullName" required type="text" placeholder="As per ticket" className={inputStyle} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Age</label>
                                    <input name="age" required type="number" placeholder="Enter Age" className={inputStyle} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input name="email" required type="email" placeholder="example@mail.com" className={`${inputStyle} pl-10`} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input name="phone" required type="tel" placeholder="10-digit mobile" className={`${inputStyle} pl-10`} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PNR Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input name="pnr" required maxLength={10} type="text" placeholder="10-digit PNR" className={`${inputStyle} pl-10
                                    


                                     `} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Complaint Details */}
                        <div className="space-y-4">
                            <h2 className="text-gray-800 font-bold flex items-center gap-2 border-b pb-2">
                                <AlertCircle size={18} className="text-blue-700" />
                                Complaint Information
                            </h2>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Type of Grievance</label>
                                <select name="complaintType" className={inputStyle}>
                                    <option value="Medical Assistance">Medical Assistance</option>
                                    <option value="Security">Security</option>
                                    <option value="Catering">Catering & Food</option>
                                    <option value="Cleanliness">Cleanliness</option>
                                    <option value="Staff Behavior">Staff Behavior</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                <textarea name="message" required rows={4} placeholder="Describe your issue..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]"></textarea>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Proof (Image/Video)</label>
                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                                    <Paperclip className="w-6 h-6 mb-1 text-gray-400" />
                                    <p className="text-xs text-gray-500">{fileName || "Click to upload media"}</p>
                                    <input name="file" type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#ef6c00] hover:bg-[#e65100] disabled:bg-gray-400 text-white h-12 rounded-lg font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Complaint"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}