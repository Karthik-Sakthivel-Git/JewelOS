"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

export default function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/purchase-orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-5xl animate-pulse card h-96 bg-gray-100" />;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center py-20">
        <FileText className="h-12 w-12 text-gray-300" />
        <p className="mt-2 text-gray-500">Purchase order not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/purchases"
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.poNumber}</h1>
            <p className="text-sm text-gray-500">
              {order.purchaseType.replace(/_/g, " ")} · {order.supplier?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          {order.status === "DRAFT" && (
            <Link
              href={`/dashboard/purchases/grn/new?poId=${order.id}`}
              className="btn-gold flex items-center gap-2 text-sm"
            >
              <ClipboardCheck className="h-4 w-4" /> Create GRN
            </Link>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {order.totalAmount ? formatCurrency(order.totalAmount) : "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Expected Delivery</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {order.expectedDate ? new Date(order.expectedDate).toLocaleDateString("en-IN") : "Not set"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">GRNs Received</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {order.grns?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Line items */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Line Items ({order.lineItems?.length ?? 0})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500">
                <th className="pb-3">#</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Metal</th>
                <th className="pb-3">Purity</th>
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3">Unit</th>
                <th className="pb-3 text-right">Rate</th>
                <th className="pb-3 text-right">Wastage</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.lineItems ?? []).map((li: any, idx: number) => (
                <tr key={li.id} className="border-b border-gray-100">
                  <td className="py-2 text-gray-400">{idx + 1}</td>
                  <td className="py-2 font-medium text-gray-900">{li.description}</td>
                  <td className="py-2 text-gray-600">{li.metalType?.replace(/_/g, " ") ?? "—"}</td>
                  <td className="py-2 text-gray-600">{li.purity ? `${li.purity}%` : "—"}</td>
                  <td className="py-2 text-right">{li.quantity}</td>
                  <td className="py-2 text-gray-600">{li.unitOfMeasure}</td>
                  <td className="py-2 text-right">{li.ratePerUnit ? formatCurrency(li.ratePerUnit) : "—"}</td>
                  <td className="py-2 text-right text-gray-600">{li.wastagePercent ? `${li.wastagePercent}%` : "—"}</td>
                  <td className="py-2 text-right font-medium">{li.totalAmount ? formatCurrency(li.totalAmount) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Notes</h2>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}

      {/* Linked GRNs */}
      {order.grns?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Linked GRNs</h2>
          <div className="space-y-2">
            {order.grns.map((grn: any) => (
              <Link
                key={grn.id}
                href={`/dashboard/purchases/grn/${grn.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <div>
                  <span className="text-sm font-medium text-maroon-800">{grn.grnNumber}</span>
                  <span className="ml-3 text-xs text-gray-500">
                    {new Date(grn.receivedDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <StatusBadge status={grn.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
