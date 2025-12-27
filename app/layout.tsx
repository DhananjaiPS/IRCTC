"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// import { UserProvider } from "@/components/context/UserContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { createContext } from "react";
import { getUserFromCookie } from "@/lib/getUserFromCookie";
import UserProvider from "@/components/context/UserContext";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// export const metadata: Metadata = {
//   title: "IRCTC – Train Booking, PNR Status, Live Running Status",
//   description:
//     "IRCTC powered railway services: book tickets, check PNR status, search trains, view train schedules, live status, seat availability, and fare details.",
// };

// const user = await getUserFromCookie();
// console.log("Layout User print Login User Details :"+user)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (



    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster position="top-right" />
          <UserProvider >  {children}
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}
