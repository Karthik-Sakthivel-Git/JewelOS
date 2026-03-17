"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/lib/utils/category-config";
import type { StockCategory, MetalType, PricingType } from "@prisma/client";

export interface ProductFilters {
  search: string;
  category: StockCategory | "";
  metalType: MetalType | "";
  pricingType: PricingType | "";
  active: boolean | null;
}

interface Props {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

const METAL_OPTIONS = [
  { value: "GOLD_24K", label: "Gold 24K" },
  { value: "GOLD_22K", label: "Gold 22K" },
  { value: "GOLD_18K", label: "Gold 18K" },
  { value: "SILVER", label: "Silver" },
  { value: "PLATINUM", label: "Platinum" },
];

export function ProductFilterBar({ filters, onChange }: Props) {
  const activeCount = [
    filters.category,
    filters.metalType,
    filters.pricingType,
    filters.active !== null,
  ].filter(Boolean).length;

  function clearAll() {
    onChange({ search: "", category: "", metalType: "", pricingType: "", active: null });
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by name, SKU, design code, barcode..."
            className="input-field pl-10"
          />
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-maroon-700 hover:text-maroon-900">
            <X className="h-3.5 w-3.5" /> Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-gray-400" />

        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value as StockCategory | "" })}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            filters.category
              ? "border-maroon-200 bg-maroon-50 text-maroon-800"
              : "border-gray-200 bg-white text-gray-600"
          )}
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select
          value={filters.metalType}
          onChange={(e) => onChange({ ...filters, metalType: e.target.value as MetalType | "" })}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            filters.metalType
              ? "border-gold-200 bg-gold-50 text-gold-800"
              : "border-gray-200 bg-white text-gray-600"
          )}
        >
          <option value="">All Metals</option>
          {METAL_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={filters.pricingType}
          onChange={(e) => onChange({ ...filters, pricingType: e.target.value as PricingType | "" })}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            filters.pricingType
              ? "border-blue-200 bg-blue-50 text-blue-800"
              : "border-gray-200 bg-white text-gray-600"
          )}
        >
          <option value="">All Pricing</option>
          <option value="WEIGHT_BASED">Weight-Based</option>
          <option value="FIXED_MRP">Fixed MRP</option>
        </select>

        <select
          value={filters.active === null ? "" : filters.active ? "true" : "false"}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ ...filters, active: v === "" ? null : v === "true" });
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>
  );
}
