"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Scale, AlertTriangle, Package } from "lucide-react";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { CATEGORY_CONFIG } from "@/lib/utils/category-config";
import type { StockCategory } from "@prisma/client";

export default function GrnDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [grn, setGrn] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetch(`/api/grn/${id}`)
      .then((r) => r.json())
      .then((d) => setGrn(d.grn))
      .finally(() => setLoading(false));
  }, [id]);

  async function approveGrn() {
    setApproving(true);
    try {
      const res = await fetch(`/api/grn/${id}/approve`, { method: "POST" });
      if (res.ok) {
        const updated = await fetch(`/api/grn/${id}`).then((r) => r.json());
        setGrn(updated.grn);
      }
    } finally {
      setApproving(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-5xl animate-pulse card h-96 bg-gray-100" />;

  if (!grn) {
    return (
      <div className="flex flex-col items-center py-20">
        <Package className="h-12 w-12 text-gray-300" />
        <p className="mt-2 text-gray-500">GRN not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/purchases" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{grn.grnNumber}</h1>
            <p className="text-sm text-gray-500">
              {grn.purchaseOrder ? `PO: ${grn.purchaseOrder.poNumber}` : "Standalone GRN"}
              {" · "}Received {new Date(grn.receivedDate).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={grn.status} />
          {grn.status === "PENDING" && (
            <button
              onClick={approveGrn}
              disabled={approving}
              className="btn-gold flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              {approving ? "Approving..." : "Approve GRN"}
            </button>
          )}
          {grn.status === "APPROVED" && (
            <Link
              href={`/dashboard/purchases/returns/new?grnId=${grn.id}&supplierId=${grn.supplierId}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Create Return
            </Link>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="mt-1 text-xl font-bold text-maroon-800">
            {grn.totalAmountRs ? formatCurrency(grn.totalAmountRs) : "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Total Weight</p>
          <p className="mt-1 text-xl font-bold text-gold-700">
            {grn.totalWeightGrams ? formatWeight(grn.totalWeightGrams) : "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Line Items</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{grn.lineItems?.length ?? 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Stock Items Created</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{grn.stockItems?.length ?? 0}</p>
        </div>
      </div>

      {grn.requiresWeightVerification && (
        <div className="flex items-center gap-2 rounded-lg bg-gold-50 border border-gold-200 px-4 py-3 text-sm text-gold-800">
          <Scale className="h-5 w-5 shrink-0" />
          This GRN required weight verification for metal items.
        </div>
      )}

      {/* Line items */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Line Items</h2>
        <div className="space-y-4">
          {(grn.lineItems ?? []).map((li: any, idx: number) => {
            const catConfig = li.product?.category
              ? CATEGORY_CONFIG[li.product.category as StockCategory]
              : null;
            const needsWeight = catConfig?.requiresWeightVerification ?? false;
            const hasMismatch = li.grossWeight && li.scaleWeight &&
              Math.abs(li.grossWeight - li.scaleWeight) > 0.05;

            return (
              <div key={li.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {li.product?.name ?? li.description ?? "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400">{li.product?.sku}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {li.pricingType === "FIXED_MRP" ? (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">FIXED MRP</span>
                    ) : (
                      <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-800">WEIGHT-BASED</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-x-8 gap-y-2 sm:grid-cols-3 lg:grid-cols-6 text-xs">
                  <div><span className="text-gray-500">Qty:</span> <span className="font-medium">{li.quantity}</span></div>
                  {needsWeight && (
                    <>
                      <div><span className="text-gray-500">Gross:</span> <span className="font-medium">{li.grossWeight ? formatWeight(li.grossWeight) : "—"}</span></div>
                      <div>
                        <span className="text-gray-500">Scale:</span>{" "}
                        <span className="font-semibold text-gold-700">{li.scaleWeight ? formatWeight(li.scaleWeight) : "—"}</span>
                      </div>
                      <div><span className="text-gray-500">Net:</span> <span className="font-medium">{li.netWeight ? formatWeight(li.netWeight) : "—"}</span></div>
                      <div><span className="text-gray-500">Purity Test:</span> <span className="font-medium">{li.purityTestResult ?? "—"}</span></div>
                    </>
                  )}
                  <div>
                    <span className="text-gray-500">Total:</span>{" "}
                    <span className="font-bold text-maroon-800">{li.totalPrice ? formatCurrency(li.totalPrice) : "—"}</span>
                  </div>
                </div>

                {hasMismatch && (
                  <div className="mt-2 flex items-center gap-2 rounded bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Weight mismatch: Declared {formatWeight(li.grossWeight)} vs Scale {formatWeight(li.scaleWeight)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      {grn.notes && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Notes</h2>
          <p className="text-sm text-gray-600">{grn.notes}</p>
        </div>
      )}
    </div>
  );
}
