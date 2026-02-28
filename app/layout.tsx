import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import UserProvider from "@/components/context/UserContext";
import AuthSyncProvider from "@/components/providers/AuthSyncProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IRCTC – Train Booking, PNR Status, Live Running Status",
  description: "Book tickets, check PNR status, and view train schedules.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster position="top-right" />
          {/* Order matters: 
              1. ClerkProvider handles Auth
              2. AuthSyncProvider triggers the /api/auth/sync call
              3. UserProvider handles your internal Global State
          */}
          <AuthSyncProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </AuthSyncProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}