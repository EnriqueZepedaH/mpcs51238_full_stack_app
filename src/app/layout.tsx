import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full font-sans antialiased">
        <WorkoutProvider>
          <div className="flex h-full bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto px-8 py-8">
              {children}
            </main>
          </div>
        </WorkoutProvider>
      </body>
    </html>
  );
}
