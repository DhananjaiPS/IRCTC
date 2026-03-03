"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Printer, TrainFront } from "lucide-react";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintTicketPage/>
    </Suspense>
  );
}
function PrintTicketPage() {
    const searchParams = useSearchParams();
    const pnr = searchParams.get("pnr");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pnr) {
            fetch(`/api/train/print-ticket?pnr=${pnr}`)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                    setData(json);
                    setLoading(false);
                });
        }
    }, [pnr]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fb792b]"></div>
        </div>
    );
    if (!data || data.error) return <div className="p-10 text-center">Ticket not found.</div>;
    const router = useRouter();
    // --- LOGIC FOR DATES ---
    const boardingDate = data.journeyDate ? new Date(data.journeyDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A";

    // Arrival Date Calculation (Basic logic: if arrival < departure, it's next day)
    const getArrivalDate = () => {
        if (!data.journeyDate) return "N/A";
        const date = new Date(data.journeyDate);
        const dep = data.schedule.train.departureTime;
        const arr = data.schedule.train.arrivalTime;
        if (arr < dep) date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-10 print:bg-white print:pb-0">
            <header className="bg-blue-900 text-white p-4 shadow-md mb-6 print:hidden">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.replace("/")}><ChevronLeft /></button>
                        <h1 className="font-bold">Electronic Reservation Slip</h1>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="bg-orange-500 px-2 sm:px-4 py-2 rounded-lg font-bold flex gap-2 items-center"
                    >
                        <Printer size={18} /> Print <span className="hidden sm:block">ERS</span>
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto bg-white border border-gray-300 shadow-sm print:border-none print:shadow-none">
                <div className="p-4 border-b-2 border-black flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image src="/irctc_logo_2.png" alt="IRCTC" width={50} height={50} />
                        <div>
                            <h2 className="text-lg font-bold text-blue-900 leading-none">INDIAN RAILWAYS</h2>
                            <p className="text-[10px] font-semibold">Electronic Reservation Slip (ERS)-Normal User</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black tracking-tighter">PNR: {data.pnr}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Transaction ID: {data.payment?.gatewayTransactionId}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 border-b border-gray-300 text-sm">
                    <div className="p-3 border-r border-gray-300">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">Train No / Name</span>
                        <span className="font-bold">{data.schedule.train.trainNo} / {data.schedule.train.name}</span>
                    </div>
                    <div className="p-3 border-r border-gray-300">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">Class</span>
                        <span className="font-bold uppercase">{data.schedule.train.type} ({data.trainInstance?.coachType || 'SL'})</span>
                    </div>
                    <div className="p-3">
                        <span className="text-[9px] font-bold text-gray-400 block uppercase">Booking Date</span>
                        <span className="font-bold">{new Date(data.bookedAt).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex border-b border-gray-300">
                    <div className="flex-1 p-4 border-r border-gray-300">
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Boarding At / Date</p>
                        <p className="text-xl font-black">{data.fromStation.name} ({data.fromStationId})</p>
                        <p className="text-xs font-bold mt-1">Departure: {data.schedule.train.departureTime} | {boardingDate}</p>
                    </div>
                    <div className="flex-1 p-4 bg-blue-50/30">
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Reservation Upto / Date</p>
                        <p className="text-xl font-black">{data.toStation.name} ({data.toStationId})</p>
                        <p className="text-xs font-bold mt-1">Arrival: {data.schedule.train.arrivalTime} | {getArrivalDate()}</p>
                    </div>
                </div>

                <div className="p-4">
                    <table className="w-full text-xs text-left border border-gray-300">
                        <thead className="bg-gray-100 uppercase text-[10px] font-black">
                            <tr>
                                <th className="p-2 border-r border-gray-300"># Name</th>
                                <th className="p-2 border-r border-gray-300">Age</th>
                                <th className="p-2 border-r border-gray-300">Gender</th>
                                <th className="p-2 border-r border-gray-300">Booking Status</th>
                                <th className="p-2">Current Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.passengers.map((p: any, idx: number) => {
                                // EXACT FIX: seatMappings array ke andar jao aur passengerId match karo
                                // .toString() use kar rahe hain taaki BigInt/Number/String mismatch na ho
                                const mapping = data.seatMappings?.find(
                                    (m: any) => m.passengerId?.toString() === p.id?.toString()
                                );

                                // Agar mapping mil gayi toh wahan se seat uthao, warna p.seat fallback use karo
                                const allottedSeat = mapping?.seat || p.seat;
                                const isConfirmed = !!allottedSeat;

                                return (
                                    <tr key={idx} className="border-t border-gray-300 font-medium uppercase">
                                        <td className="p-2 border-r border-gray-300">{idx + 1}. {p.name}</td>
                                        <td className="p-2 border-r border-gray-300">{p.age}</td>
                                        <td className="p-2 border-r border-gray-300">{p.gender}</td>

                                        {/* Booking Status - Agar seat hai toh CONFIRMED, warna current status */}
                                        <td className="p-2 border-r border-gray-300 text-green-700 font-bold">
                                            {isConfirmed ? "CONFIRMED" : (p.status || "WAITLISTED")}
                                        </td>

                                        {/* Current Status - Yahan mapping se data nikal rahe hain */}
                                        <td className="p-2 font-bold text-green-600">
                                            {isConfirmed ? (
                                                `${allottedSeat.coach.coachNumber}/${allottedSeat.seatNo} (${allottedSeat.berthType})`
                                            ) : (
                                                "WL/PENDING"
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-2 border-t-2 border-gray-300">
                    <div className="p-4 border-r border-gray-300 text-[10px]">
                        <h3 className="font-bold mb-2 underline uppercase">GST Details (Supplier)</h3>
                        <p>Invoice No: {data.gstData.invoiceNumber}</p>
                        <p>GSTIN: {data.gstData.supplierGstin}</p>
                        <p>SAC Code: {data.gstData.sacCode}</p>
                        <p className="mt-2 text-blue-800 italic">IR recovers only 57% of cost of travel on an average.</p>
                    </div>
                    <div className="p-4 bg-gray-50">
                        <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2">Fare Details</h3>
                        <div className="text-xs space-y-1">
                            <div className="flex justify-between"><span>Ticket Fare:</span><span>₹{(data.payment?.amount - 11.80).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Convenience Fee:</span><span>₹11.80</span></div>
                            <div className="flex justify-between font-black text-sm border-t border-gray-300 pt-2 text-blue-900">
                                <span>Total Fare:</span><span>₹{data.payment?.amount?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-300 text-[8px] leading-tight text-gray-500">
                    <p className="font-bold text-black mb-1 uppercase">Important Instructions:</p>
                    <p>1. Prescribed original ID proof is required while travelling along with ERS.</p>
                    <p>2. Fully waitlisted e-tickets are not allowed to board the train.</p>
                    <p>3. Never purchase e-tickets from unauthorized agents.</p>
                </div>
                <div >
                    <Image src="/adv1.jpeg"
                        alt="Advertisement"
                        width={420}
                        height={120}
                        className="mx-auto w-full cursor-pointer"
                        onClick={() => router.push("/")}
                    />
                </div>
                <div className="text-[11px] leading-relaxed text-gray-700 space-y-6 border-t mt-6 pt-6 px-4">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 font-semibold text-red-800">
                        This ticket is booked on a personal User ID, its sale/purchase is an offence u/s 143 of the Railways Act,1989...
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        <div className="bg-blue-900 text-white px-3 py-2 font-bold text-xs uppercase">Menu Rates on Mail/Express Trains</div>
                        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-1">
                            <span>Breakfast (Veg): ₹ 40.00</span>
                            <span>Breakfast (Non-Veg): ₹ 50.00</span>
                            <span>Standard Meal (Veg): ₹ 80.00</span>
                            <span>Standard Meal (Non-Veg): ₹ 90.00</span>
                        </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        <div className="bg-gray-100 px-3 py-2 font-bold text-xs uppercase">Indian Railways GST Details</div>
                        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                            <span>Invoice Number: {data.gstData.invoiceNumber}</span>
                            <span>GSTIN: {data.gstData.supplierGstin}</span>
                            <span>SAC Code: {data.gstData.sacCode}</span>
                            <span>Place of Supply: Delhi/D</span>
                        </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                        <div className="bg-blue-50 px-3 py-2 font-bold text-xs uppercase text-blue-900">Customer Care</div>
                        <div className="p-4 text-xs space-y-1">
                            <p>Call 14646 (24X7) | Email: etickets@irctc.co.in</p>
                            <p>Rail Madad: 139</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}