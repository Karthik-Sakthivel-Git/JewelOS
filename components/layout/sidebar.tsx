"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  MoreHorizontal,
  Settings,
  FileText,
  TrendingUp,
  Shield,
  Building2,
  Gem,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/sales", label: "Sales POS", icon: ShoppingCart },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/purchases", label: "Purchases", icon: TrendingUp },
  { href: "/dashboard/schemes", label: "Schemes", icon: Gem },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/store-setup", label: "Store Setup", icon: Building2 },
  { href: "/dashboard/staff", label: "Staff & RBAC", icon: Shield },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 z-40">
      <div className="flex h-full flex-col bg-maroon-800">
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              Jewel<span className="text-gold-400">OS</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-maroon-700 text-gold-400"
                    : "text-maroon-100 hover:bg-maroon-700 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/sales", label: "Sales", icon: ShoppingCart },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/settings", label: "More", icon: MoreHorizontal },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white lg:hidden">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
                isActive
                  ? "text-maroon-800"
                  : "text-gray-500 hover:text-maroon-800"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-gold-400")}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
