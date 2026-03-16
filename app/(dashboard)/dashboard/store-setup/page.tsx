"use client";

import { useState } from "react";
import { Building2, MapPin, Lock, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessProfileTab } from "./tabs/business-profile";
import { BranchesTab } from "./tabs/branches";
import { LockersTab } from "./tabs/lockers";
import { RateBoardTab } from "./tabs/rate-board";
import { StaffRbacTab } from "./tabs/staff-rbac";

const tabs = [
  { id: "profile", label: "Business Profile", icon: Building2 },
  { id: "branches", label: "Branches", icon: MapPin },
  { id: "lockers", label: "Safe Lockers", icon: Lock },
  { id: "rates", label: "Live Rate Board", icon: TrendingUp },
  { id: "staff", label: "Staff & RBAC", icon: Shield },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function StoreSetupPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Setup</h1>
        <p className="text-sm text-gray-500">
          Configure your business profile, branches, and operational settings
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-maroon-800 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {activeTab === "profile" && <BusinessProfileTab />}
        {activeTab === "branches" && <BranchesTab />}
        {activeTab === "lockers" && <LockersTab />}
        {activeTab === "rates" && <RateBoardTab />}
        {activeTab === "staff" && <StaffRbacTab />}
      </div>
    </div>
  );
}
