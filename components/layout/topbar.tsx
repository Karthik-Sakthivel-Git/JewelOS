"use client";

import { Menu, Bell, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { MobileSidebarOverlay } from "./mobile-sidebar";

export function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:pl-64">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden -ml-1 rounded-md p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:block rounded-lg bg-gold-50 px-3 py-1.5 text-sm font-medium text-gold-600">
            Gold 22K: ₹6,450/g
          </div>

          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon-800 text-sm font-medium text-white">
              <User className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </header>

      <MobileSidebarOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
