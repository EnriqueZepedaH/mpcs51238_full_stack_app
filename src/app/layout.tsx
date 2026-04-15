import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { WorkoutProvider } from "@/lib/workout-context";
import Sidebar from "@/components/sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workout Tracker",
  description: "Track your workouts, exercises, and personal records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`}>
        <body className="h-full font-sans antialiased">
          <WorkoutProvider>
            <div className="flex h-full flex-col bg-gray-50 md:flex-row">
              <Sidebar />
              <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 md:py-8">
                {children}
              </main>
            </div>
          </WorkoutProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
