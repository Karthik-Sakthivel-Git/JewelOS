"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, TrendingUp } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const PURCHASE_TYPES = [
  { value: "OUTRIGHT", label: "Outright Purchase", desc: "Direct purchase — ownership transfers immediately" },
  { value: "CONSIGNMENT_INWARD", label: "Consignment Inward", desc: "Stock on consignment — pay after sale" },
  { value: "ADVANCE_BOOKING", label: "Advance Booking", desc: "Pre-order with advance payment" },
];

const UNIT_OPTIONS = [
  { value: "GRAMS", label: "Grams" },
  { value: "PIECES", label: "Pieces" },
  { value: "CARATS", label: "Carats" },
];

const METAL_OPTIONS = [
  { value: "", label: "None" },
  { value: "GOLD_24K", label: "Gold 24K" },
  { value: "GOLD_22K", label: "Gold 22K" },
  { value: "GOLD_18K", label: "Gold 18K" },
  { value: "SILVER", label: "Silver" },
  { value: "PLATINUM", label: "Platinum" },
];

interface LineItem {
  description: string;
  quantity: number;
  unitOfMeasure: string;
  metalType: string;
  purity: number | null;
  ratePerUnit: number | null;
  wastagePercent: number | null;
  totalAmount: number | null;
}

const emptyLine: LineItem = {
  description: "",
  quantity: 1,
  unitOfMeasure: "GRAMS",
  metalType: "",
  purity: null,
  ratePerUnit: null,
  wastagePercent: null,
  totalAmount: null,
};

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [purchaseType, setPurchaseType] = useState("OUTRIGHT");
  const [supplierId, setSupplierId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyLine }]);

  useEffect(() => {
    Promise.all([
      fetch("/api/suppliers").then((r) => r.json()),
      fetch("/api/branches").then((r) => r.json()),
    ]).then(([supplierData, branchData]) => {
      setSuppliers(supplierData.suppliers ?? []);
      setBranches(branchData.branches ?? []);
    });
  }, []);

  function updateLine(idx: number, updates: Partial<LineItem>) {
    setLineItems((prev) =>
      prev.map((li, i) => {
        if (i !== idx) return li;
        const next = { ...li, ...updates };
        if (next.ratePerUnit != null && next.quantity) {
          const base = next.ratePerUnit * next.quantity;
          const wastage = next.wastagePercent ? base * (next.wastagePercent / 100) : 0;
          next.totalAmount = Math.round((base + wastage) * 100) / 100;
        }
        return next;
      })
    );
  }

  function addLine() {
    setLineItems((prev) => [...prev, { ...emptyLine }]);
  }

  function removeLine(idx: number) {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const grandTotal = lineItems.reduce((sum, li) => sum + (li.totalAmount ?? 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierId || !branchId) {
      setError("Please select supplier and branch.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          supplierId,
          purchaseType,
          expectedDate: expectedDate || undefined,
          notes: notes || undefined,
          lineItems: lineItems.map((li) => ({
            ...li,
            metalType: li.metalType || undefined,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create PO");
      }

      const { order } = await res.json();
      router.push(`/dashboard/purchases/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/purchases"
          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Purchase Order</h1>
          <p className="text-sm text-gray-500">
            Create a purchase order for supplier procurement
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Purchase type selector */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Purchase Type</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {PURCHASE_TYPES.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setPurchaseType(pt.value)}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  purchaseType === pt.value
                    ? "border-gold-400 bg-gold-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <p className="text-sm font-semibold text-gray-900">{pt.label}</p>
                <p className="mt-1 text-xs text-gray-500">{pt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Supplier & Branch */}
        <div className="card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Supplier *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select supplier</option>
                {suppliers.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}{s.city ? ` (${s.city})` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Branch *</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select branch</option>
                {branches.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}{b.isMain ? " (Main)" : ""}{b.city ? ` — ${b.city}` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Expected Date</label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                placeholder="Internal notes..."
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Line Items</h2>
            <button
              type="button"
              onClick={addLine}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-3.5 w-3.5" /> Add Line
            </button>
          </div>

          <div className="space-y-4">
            {lineItems.map((li, idx) => (
              <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500">Item {idx + 1}</span>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="sm:col-span-3 lg:col-span-2">
                    <label className="mb-1 block text-xs text-gray-500">Description *</label>
                    <input
                      value={li.description}
                      onChange={(e) => updateLine(idx, { description: e.target.value })}
                      className="input-field text-sm"
                      placeholder="e.g. Gold Chain 22K"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={li.quantity}
                      onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Unit</label>
                    <select
                      value={li.unitOfMeasure}
                      onChange={(e) => updateLine(idx, { unitOfMeasure: e.target.value })}
                      className="input-field text-sm"
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Metal</label>
                    <select
                      value={li.metalType}
                      onChange={(e) => updateLine(idx, { metalType: e.target.value })}
                      className="input-field text-sm"
                    >
                      {METAL_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Purity %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={li.purity ?? ""}
                      onChange={(e) => updateLine(idx, { purity: e.target.value ? Number(e.target.value) : null })}
                      className="input-field text-sm"
                      placeholder="91.6"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Rate/Unit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={li.ratePerUnit ?? ""}
                      onChange={(e) => updateLine(idx, { ratePerUnit: e.target.value ? Number(e.target.value) : null })}
                      className="input-field text-sm"
                      placeholder="₹/g"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Wastage %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={li.wastagePercent ?? ""}
                      onChange={(e) => updateLine(idx, { wastagePercent: e.target.value ? Number(e.target.value) : null })}
                      className="input-field text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Line Total</label>
                    <div className="input-field bg-gray-100 text-sm font-medium text-gray-800">
                      {li.totalAmount != null ? formatCurrency(li.totalAmount) : "—"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grand total */}
          <div className="mt-4 flex justify-end">
            <div className="rounded-lg bg-maroon-50 px-6 py-3 text-right">
              <p className="text-xs text-gray-500">Grand Total</p>
              <p className="text-xl font-bold text-maroon-800">{formatCurrency(grandTotal)}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/dashboard/purchases" className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? "Creating..." : "Create Purchase Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
