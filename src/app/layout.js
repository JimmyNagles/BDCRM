"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="flex h-screen bg-gray-100">
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                <div className="container mx-auto px-6 py-8">{children}</div>
              </main>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
