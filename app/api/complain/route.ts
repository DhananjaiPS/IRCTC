import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import twilio from "twilio";
import path from "path";
import { emit } from "process";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const fullName = formData.get("fullName")?.toString() || "N/A";
        const email = formData.get("email")?.toString() || "N/A";
        const phone = formData.get("phone")?.toString() || "N/A";
        const pnr = formData.get("pnr")?.toString() || "N/A";
        const complaintType = formData.get("complaintType")?.toString() || "General";
        const message = formData.get("message")?.toString() || "No description.";
        const file = formData.get("file") as File | null;

        let attachments: any[] = [
            {
                filename: 'irctc_logo.png',
                path: path.join(process.cwd(), 'public', 'irctc_logo_2.png'),
                cid: 'irctclogo' // Internal reference ID
            }
        ];

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({ filename: file.name, content: buffer });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        // ... baki imports same رہیںge

// 3. Email HTML with Rounded Logo
const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #003399; padding: 20px; text-align: center; color: white;">
        <img src="cid:irctclogo" alt="Logo" style="width: 70px; height: 70px; border-radius: 50%; background: white; padding: 5px; margin-bottom: 10px; object-fit: contain;">
        
        <h2 style="margin: 0;">IRCTC Grievance Redressal</h2>
        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">OFFICIAL COMPLAINT LOG</p>
    </div>
    
    <div style="padding: 20px; line-height: 1.6; color: #333;">
        <p>A new grievance has been registered with the following details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Passenger Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${fullName}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">PNR Number:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: monospace;">${pnr}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Contact:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Category:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span style="background: #fff3e0; color: #e65100; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${complaintType}</span>
                </td>
            </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #003399;">
            <strong style="display: block; margin-bottom: 5px;">Description:</strong>
            ${message}
        </div>
        
        ${file && file.size > 0 ? `<p style="font-size: 12px; color: #003399; margin-top: 10px;">📎 Attachment included: ${file.name}</p>` : ""}
    </div>
    
    <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 11px; color: #999;">
        This is an automated system notification. Please take necessary action within 24 hours.
    </div>
</div>
`;

// ... baki transporter aur twilio code same rahega

        await transporter.sendMail({
            from: `"RailMadad Admin" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🚨 New Grievance: ${pnr}`,
            html: emailHtml,
            attachments: attachments,
        });

        const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!);
        const whatsappBody = `
==================================
OFFICIAL GRIEVANCE LOG: RAIL MADAD
==================================

[ JOURNEY DETAILS ]
▪ PNR NUMBER   : ${pnr}
▪ CATEGORY     : ${complaintType.toUpperCase()}

[ PASSENGER INFO ]
▪ NAME         : ${fullName}
▪ PHONE        : ${phone}
▪ EMAIL        : ${email}

[ DESCRIPTION ]
"${message.length > 150 ? message.substring(0, 150) + "..." : message}"

--------------------------------
TIMESTAMP : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
STATUS    : PENDING ACTION
================================
_Note: Full attachments sent to ${process.env.ADMIN_EMAIL}_`;

        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM!,
            to: process.env.ADMIN_WHATSAPP!,
            body: whatsappBody,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}




