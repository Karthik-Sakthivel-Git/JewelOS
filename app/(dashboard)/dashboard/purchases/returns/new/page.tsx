"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { RETURN_REASON_CODES } from "@/lib/utils/category-config";

interface ReturnLine {
  grnLineItemId: string;
  description: string;
  quantity: number;
  grossWeight: number | null;
  netWeight: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
  reasonCode: string;
}

function emptyReturnLine(): ReturnLine {
  return {
    grnLineItemId: "",
    description: "",
    quantity: 1,
    grossWeight: null,
    netWeight: null,
    unitPrice: null,
    totalPrice: null,
    reasonCode: "QUALITY_DEFECT",
  };
}

export default function NewPurchaseReturnPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>}>
      <NewPurchaseReturnContent />
    </Suspense>
  );
}

function NewPurchaseReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetGrnId = searchParams.get("grnId") ?? "";
  const presetSupplierId = searchParams.get("supplierId") ?? "";

  const [grns, setGrns] = useState<any[]>([]);
  const [selectedGrn, setSelectedGrn] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [grnId, setGrnId] = useState(presetGrnId);
  const [supplierId, setSupplierId] = useState(presetSupplierId);
  const [reasonCode, setReasonCode] = useState("QUALITY_DEFECT");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<ReturnLine[]>([emptyReturnLine()]);

  useEffect(() => {
    fetch("/api/grn?status=APPROVED&limit=100")
      .then((r) => r.json())
      .then((d) => setGrns(d.grns ?? []));
  }, []);

  useEffect(() => {
    if (grnId) {
      fetch(`/api/grn/${grnId}`)
        .then((r) => r.json())
        .then((d) => {
          setSelectedGrn(d.grn);
          if (d.grn?.supplierId) setSupplierId(d.grn.supplierId);
        });
    }
  }, [grnId]);

  function updateLine(idx: number, updates: Partial<ReturnLine>) {
    setLineItems((prev) =>
      prev.map((li, i) => {
        if (i !== idx) return li;
        const next = { ...li, ...updates };
        if (next.unitPrice != null && next.quantity) {
          next.totalPrice = Math.round(next.unitPrice * next.quantity * 100) / 100;
        }
        return next;
      })
    );
  }

  function addLine() {
    setLineItems((prev) => [...prev, emptyReturnLine()]);
  }

  function removeLine(idx: number) {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function prefillFromGrnLine(idx: number, grnLineItemId: string) {
    const grnLine = selectedGrn?.lineItems?.find((li: any) => li.id === grnLineItemId);
    if (!grnLine) return;

    updateLine(idx, {
      grnLineItemId,
      description: grnLine.product?.name ?? grnLine.description ?? "",
      grossWeight: grnLine.grossWeight,
      netWeight: grnLine.netWeight,
      unitPrice: grnLine.unitPrice ?? grnLine.supplierMrp,
      totalPrice: grnLine.totalPrice,
    });
  }

  const grandTotal = lineItems.reduce((s, li) => s + (li.totalPrice ?? 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grnId || !supplierId) {
      setError("Please select a GRN and supplier.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/purchase-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grnId,
          supplierId,
          reasonCode,
          notes: notes || undefined,
          lineItems,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create return");
      }

      router.push("/dashboard/purchases");
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
          <h1 className="text-2xl font-bold text-gray-900">New Purchase Return</h1>
          <p className="text-sm text-gray-500">
            Return items against an approved GRN with debit note generation
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">GRN Reference *</label>
              <select value={grnId} onChange={(e) => setGrnId(e.target.value)} className="input-field" required>
                <option value="">Select approved GRN</option>
                {grns.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.grnNumber} {g.purchaseOrder ? `(PO: ${g.purchaseOrder.poNumber})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Return Reason *</label>
              <select value={reasonCode} onChange={(e) => setReasonCode(e.target.value)} className="input-field" required>
                {RETURN_REASON_CODES.map((rc) => (
                  <option key={rc.value} value={rc.value}>{rc.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="input-field resize-none"
                placeholder="Return details..."
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Return Items</h2>
            <button type="button" onClick={addLine} className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
              <Plus className="h-3.5 w-3.5" /> Add Line
            </button>
          </div>

          <div className="space-y-4">
            {lineItems.map((li, idx) => (
              <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500">Return Item {idx + 1}</span>
                  {lineItems.length > 1 && (
                    <button type="button" onClick={() => removeLine(idx)} className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {/* Pre-fill from GRN line */}
                  {selectedGrn && (
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-gray-500">GRN Line Item</label>
                      <select
                        value={li.grnLineItemId}
                        onChange={(e) => prefillFromGrnLine(idx, e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="">Select from GRN items</option>
                        {(selectedGrn.lineItems ?? []).map((grnLi: any) => (
                          <option key={grnLi.id} value={grnLi.id}>
                            {grnLi.product?.name ?? grnLi.description} (Qty: {grnLi.quantity})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={selectedGrn ? "" : "sm:col-span-2"}>
                    <label className="mb-1 block text-xs text-gray-500">Description *</label>
                    <input
                      value={li.description}
                      onChange={(e) => updateLine(idx, { description: e.target.value })}
                      className="input-field text-sm"
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
                    <label className="mb-1 block text-xs text-gray-500">Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={li.unitPrice ?? ""}
                      onChange={(e) => updateLine(idx, { unitPrice: e.target.value ? Number(e.target.value) : null })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Reason</label>
                    <select
                      value={li.reasonCode}
                      onChange={(e) => updateLine(idx, { reasonCode: e.target.value })}
                      className="input-field text-sm"
                    >
                      {RETURN_REASON_CODES.map((rc) => (
                        <option key={rc.value} value={rc.value}>{rc.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Line Total</label>
                    <div className="input-field bg-gray-100 text-sm font-medium text-maroon-800">
                      {li.totalPrice != null ? formatCurrency(li.totalPrice) : "—"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <div className="rounded-lg bg-red-50 px-6 py-3 text-right">
              <p className="text-xs text-gray-500">Debit Note Amount</p>
              <p className="text-xl font-bold text-red-700">{formatCurrency(grandTotal)}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/dashboard/purchases" className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? "Processing..." : "Create Return & Debit Note"}
          </button>
        </div>
      </form>
    </div>
  );
}
