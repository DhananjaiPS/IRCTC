import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";

// Create a reusable transporter outside the handler for better performance
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Standard Next.js 15 way
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { status, adminMessage, adminAction } = await req.json();

    // 1. Update Database
    const complaint = await prisma.complaint.update({
      where: { id: BigInt(id) },
      data: { status, adminMessage, adminAction },
    });

    // 2. Send Email (Fire and forget or await, depending on your latency preference)
    try {
      await transporter.sendMail({
        from: `"Support Team" <${process.env.EMAIL_USER}>`,
        to: complaint.email,
        subject: `Update: Complaint #${id} is now ${status}`,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; margin: 0 auto;">
<div style="background-color: #003399; padding: 20px; text-align: center; color: white;">
        <img src="cid:irctclogo" alt="Logo" style="width: 70px; height: 70px; border-radius: 50%; background: white; padding: 5px; margin-bottom: 10px; object-fit: contain;">
        
        <h2 style="margin: 0; font-size: 22px;">IRCTC Support Update</h2>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8; letter-spacing: 1px;">GRIEVANCE STATUS NOTIFICATION</p>
    </div>
    
    <div style="padding: 25px; line-height: 1.6; color: #333;">
        <p>Hello <b>${complaint.fullName}</b>,</p>
        <p>The status of your registered grievance has been updated. Please find the current details below:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666; width: 40%;">Complaint ID:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: monospace;">#${id}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Current Status:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <span style="background: ${status === 'RESOLVED' ? '#e8f5e9' : '#fff3e0'}; 
                                 color: ${status === 'RESOLVED' ? '#2e7d32' : '#e65100'}; 
                                 padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: bold;">
                        ${status}
                    </span>
                </td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">PNR Number:</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: monospace;">${complaint.pnr || "N/A"}</td>
            </tr>
        </table>
        
        <div style="margin-top: 25px; padding: 20px; background: #f9f9f9; border-left: 5px solid #ef6c00; border-radius: 4px;">
            <strong style="display: block; margin-bottom: 8px; color: #003399;">Message from Support Team:</strong>
            <p style="margin: 0; font-style: italic; color: #444;">
                ${adminMessage || "Your complaint is currently being reviewed by our administrative team. We will update you shortly."}
            </p>
        </div>
        
        <p style="margin-top: 25px; font-size: 14px;">Thank you for your patience and for choosing Indian Railways.</p>
    </div>
    
    <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 11px; color: #999;">
        This is an automated response from the IRCTC Grievance Redressal System.<br>
        Please do not reply directly to this email.
    </div>
</div>
`,
      });
    } catch (emailError) {
      console.error("Email failed to send, but DB updated:", emailError);
      // We don't return error here because the DB update was successful
    }

    return NextResponse.json({
      success: true,
      id: complaint.id.toString()
    });

  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}