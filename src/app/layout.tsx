import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { WorkoutProvider } from "@/lib/workout-context";
import AppShell from "@/components/app-shell";

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
            <AppShell>{children}</AppShell>
          </WorkoutProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
