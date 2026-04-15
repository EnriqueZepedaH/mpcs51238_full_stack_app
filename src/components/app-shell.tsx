"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

/**
 * AppShell renders the standard sidebar+main layout for app pages, but
 * yields full-screen control to auth pages (sign-in / sign-up) which
 * provide their own header and centered content.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
