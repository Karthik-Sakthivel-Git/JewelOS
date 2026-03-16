"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Settings,
  FileText,
  TrendingUp,
  Shield,
  Building2,
  Gem,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

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

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebarOverlay({ open, onClose }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-maroon-800">
        <div className="flex h-16 items-center justify-between px-6">
          <span className="text-2xl font-bold text-white">
            Jewel<span className="text-gold-400">OS</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-maroon-200 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
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
    </div>
  );
}
