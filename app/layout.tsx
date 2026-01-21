"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SideBar } from "@/components/ui/Sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster className="w-full m-auto" />
        <main className="flex justify-start h-screen w-full border-3">
          <SideBar />
          <div className={`w-full border-2 overflow-auto`}>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
