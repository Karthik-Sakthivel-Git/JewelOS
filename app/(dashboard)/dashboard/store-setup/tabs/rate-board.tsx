"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

interface MetalRateEntry {
  metalType: string;
  label: string;
  rate: string;
}

const defaultRates: MetalRateEntry[] = [
  { metalType: "GOLD_24K", label: "Gold 24K", rate: "" },
  { metalType: "GOLD_22K", label: "Gold 22K", rate: "" },
  { metalType: "GOLD_18K", label: "Gold 18K", rate: "" },
  { metalType: "SILVER", label: "Silver", rate: "" },
  { metalType: "PLATINUM", label: "Platinum", rate: "" },
];

export function RateBoardTab() {
  const [rates, setRates] = useState<MetalRateEntry[]>(defaultRates);

  function updateRate(index: number, value: string) {
    setRates((prev) =>
      prev.map((r, i) => (i === index ? { ...r, rate: value } : r))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: API call to save metal rates
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-gold-400" />
        <h3 className="text-lg font-semibold text-gray-900">
          Live Rate Board
        </h3>
      </div>
      <p className="text-sm text-gray-500">
        Enter today&apos;s rates per gram. These rates are used for all WEIGHT_BASED
        pricing calculations.
      </p>

      <div className="space-y-3">
        {rates.map((entry, idx) => (
          <div key={entry.metalType} className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">
              {entry.label}
            </label>
            <div className="flex flex-1 items-center">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                ₹/g
              </span>
              <input
                type="number"
                value={entry.rate}
                onChange={(e) => updateRate(idx, e.target.value)}
                className="input-field rounded-l-none"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary">
          Update Rates
        </button>
        <span className="text-xs text-gray-400">
          Source: Manual entry (Phase 1)
        </span>
      </div>
    </form>
  );
}
