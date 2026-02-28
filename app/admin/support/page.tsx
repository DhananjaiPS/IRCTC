"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { 
  MessageSquare, User, Hash, Paperclip, 
  Settings, Loader2, Phone, Mail, 
  CheckCircle2, Clock, AlertTriangle, ExternalLink
} from "lucide-react";

type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

interface Attachment {
  id: string;
  filename: string;
}

interface Complaint {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  pnr: string | null;
  complaintType: string;
  message: string;
  status: ComplaintStatus;
  adminMessage?: string | null;
  adminAction?: string | null;
  attachments: Attachment[];
  createdAt: string;
}

export default function AdminSupportPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal/Form State
  const [activeId, setActiveId] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("PENDING");

  useEffect(() => {
    if (!isLoaded || !userId) return;
    fetchComplaints();
  }, [isLoaded, userId]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/admin/support");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (err) {
      toast.error("Could not load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setUpdatingId(id);
    const loadingToast = toast.loading("Updating records & notifying user...");
    
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminMessage, adminAction: adminNote }),
      });

      if (!res.ok) throw new Error("Update failed");

      setComplaints(prev =>
        prev.map(c => (c.id === id ? { ...c, status: newStatus, adminMessage, adminAction: adminNote } : c))
      );
      
      toast.success("Complaint updated successfully", { id: loadingToast });
      setActiveId(null);
      setAdminMessage("");
      setAdminNote("");
    } catch (err) {
      toast.error("Update failed", { id: loadingToast });
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isLoaded || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f6ff]">
        <Loader2 className="animate-spin text-blue-700" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f6ff] pb-10">
      <Toaster />
      
      {/* Back Button */}
      <button onClick={() => router.back()} className="fixed top-5 left-5 z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition-all">
        <FaArrowLeftLong className="text-white text-lg" />
      </button>

      {/* IRCTC Header */}
      <div className="bg-gradient-to-r from-[#003399] to-[#0052cc] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full shadow-lg">
              <Image src="/irctc_logo_2.png" alt="IRCTC Logo" width={50} height={50} className="rounded-full" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Support Admin Dashboard</h1>
              <p className="text-xs sm:text-sm opacity-90 uppercase tracking-widest">Grievance Management System</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <StatCard icon={<Clock size={16}/>} label="Pending" count={complaints.filter(c => c.status === "PENDING").length} color="bg-orange-500" />
            <StatCard icon={<CheckCircle2 size={16}/>} label="Resolved" count={complaints.filter(c => c.status === "RESOLVED").length} color="bg-green-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-[#ef6c00] h-2 w-full"></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Passenger Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No complaints found.</td>
                    </tr>
                ) : complaints.map(c => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm flex items-center gap-1">
                            <User size={12} className="text-blue-600"/> {c.fullName}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Hash size={12}/> PNR: {c.pnr || "N/A"}
                        </span>
                        <div className="flex gap-2 mt-1">
                            <Mail size={12} className="text-gray-400"/>
                            <span className="text-[10px] text-gray-400">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs sm:max-w-md">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-600 uppercase mb-1 inline-block">
                            {c.complaintType}
                        </span>
                        <p className="text-xs text-gray-600 line-clamp-2 italic">"{c.message}"</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                            setActiveId(c.id);
                            setNewStatus(c.status);
                            setAdminMessage(c.adminMessage || "");
                            setAdminNote(c.adminAction || "");
                        }}
                        className="bg-[#003399] hover:bg-[#002570] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ml-auto shadow-md"
                      >
                        <Settings size={14} /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admin Management Modal */}
      {activeId && (
          <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
              <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="bg-[#003399] p-4 text-white flex justify-between items-center">
                      <h2 className="font-bold flex items-center gap-2">
                        <AlertTriangle size={18} className="text-orange-400" />
                        Resolution Panel: #{activeId.slice(-6)}
                      </h2>
                      <button onClick={() => setActiveId(null)} className="text-white/70 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 space-y-5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Update Status</label>
                        <select 
                            className="w-full border border-gray-200 rounded-lg px-4 h-11 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newStatus} 
                            onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Public Message (Sent to User Email)</label>
                        <textarea 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]" 
                            placeholder="Type the response the passenger will see..." 
                            value={adminMessage} 
                            onChange={e => setAdminMessage(e.target.value)} 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Internal Admin Notes (Private)</label>
                        <input 
                            className="w-full border border-gray-200 rounded-lg px-4 h-11 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="Internal action taken (e.g. Refund initiated)" 
                            value={adminNote} 
                            onChange={e => setAdminNote(e.target.value)} 
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                          <button onClick={() => setActiveId(null)} className="flex-1 px-4 py-3 text-gray-500 font-bold text-sm border border-gray-100 rounded-lg hover:bg-gray-50 transition-all">Cancel</button>
                          <button 
                            disabled={updatingId === activeId} 
                            onClick={() => handleUpdate(activeId)} 
                            className="flex-[2] bg-[#ef6c00] hover:bg-[#e65100] text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                              {updatingId === activeId ? <Loader2 className="animate-spin" size={18} /> : "Update & Notify"}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

/** Helper Components **/

function StatCard({ label, count, color, icon }: { label: string, count: number, color: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white/10 backdrop-blur-md p-3 px-5 rounded-xl border border-white/20 flex items-center gap-3">
            <div className={`${color} p-2 rounded-lg text-white`}>{icon}</div>
            <div>
                <p className="text-[10px] text-white/70 font-bold uppercase leading-tight">{label}</p>
                <p className="text-xl font-black text-white leading-tight">{count}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
    const styles = {
        PENDING: "bg-orange-100 text-orange-700 border-orange-200",
        IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
        RESOLVED: "bg-green-100 text-green-700 border-green-200",
    };

    // Short labels for better UX
    const shortLabelMap: Record<ComplaintStatus, string> = {
        PENDING: "Pend",
        IN_PROGRESS: "Prog",
        RESOLVED: "Res",
    };

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${styles[status]}`}
            title={status} // show full status on hover
        >
            {shortLabelMap[status]}
        </span>
    );
}
