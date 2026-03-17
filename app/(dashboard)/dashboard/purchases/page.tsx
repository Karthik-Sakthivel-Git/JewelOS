"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, FileText, ClipboardCheck, BookOpen, CornerDownLeft,
  TrendingUp, Package,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

type TabId = "orders" | "grn" | "ledger" | "returns";

const tabs = [
  { id: "orders" as const, label: "Purchase Orders", icon: FileText },
  { id: "grn" as const, label: "Goods Receipt (GRN)", icon: ClipboardCheck },
  { id: "ledger" as const, label: "Supplier Ledger", icon: BookOpen },
  { id: "returns" as const, label: "Purchase Returns", icon: CornerDownLeft },
];

export default function PurchasesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("orders");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchases & Procurement</h1>
          <p className="text-sm text-gray-500">
            Manage purchase orders, goods receipt, supplier ledger, and returns
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/purchases/orders/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New PO
          </Link>
          <Link
            href="/dashboard/purchases/grn/new"
            className="btn-gold flex items-center gap-2"
          >
            <ClipboardCheck className="h-4 w-4" /> New GRN
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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

      <div className="card p-6 mandala-pattern relative overflow-hidden corner-ornament-tl corner-ornament-br">
        <div className="relative z-10">
          {activeTab === "orders" && <PurchaseOrdersTab />}
          {activeTab === "grn" && <GrnTab />}
          {activeTab === "ledger" && <SupplierLedgerTab />}
          {activeTab === "returns" && <ReturnsTab />}
        </div>
      </div>
    </div>
  );
}

/* ────── Purchase Orders Tab ────── */

function PurchaseOrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/purchase-orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingRows />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No purchase orders yet"
        description="Create your first purchase order to start procuring inventory."
        actionLabel="Create PO"
        actionHref="/dashboard/purchases/orders/new"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            <th className="pb-3 font-medium">PO Number</th>
            <th className="pb-3 font-medium">Supplier</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium text-right">Amount</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id} className="border-b border-gray-100 hover:bg-cream-50/30">
              <td className="py-3 font-medium text-maroon-800">{order.poNumber}</td>
              <td className="py-3 text-gray-700">{order.supplier?.name}</td>
              <td className="py-3">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {order.purchaseType.replace(/_/g, " ")}
                </span>
              </td>
              <td className="py-3 text-right font-medium">{order.totalAmount ? formatCurrency(order.totalAmount) : "—"}</td>
              <td className="py-3"><StatusBadge status={order.status} /></td>
              <td className="py-3 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
              <td className="py-3">
                <Link href={`/dashboard/purchases/orders/${order.id}`} className="text-xs font-medium text-maroon-800 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────── GRN Tab ────── */

function GrnTab() {
  const [grns, setGrns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/grn")
      .then((r) => r.json())
      .then((d) => setGrns(d.grns ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingRows />;

  if (grns.length === 0) {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="No GRNs yet"
        description="Create a goods receipt note when inventory arrives."
        actionLabel="Create GRN"
        actionHref="/dashboard/purchases/grn/new"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            <th className="pb-3 font-medium">GRN Number</th>
            <th className="pb-3 font-medium">PO Ref</th>
            <th className="pb-3 font-medium">Items</th>
            <th className="pb-3 font-medium text-right">Amount</th>
            <th className="pb-3 font-medium text-right">Weight</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {grns.map((grn: any) => (
            <tr key={grn.id} className="border-b border-gray-100 hover:bg-cream-50/30">
              <td className="py-3 font-medium text-maroon-800">{grn.grnNumber}</td>
              <td className="py-3 text-xs text-gray-500">{grn.purchaseOrder?.poNumber ?? "Standalone"}</td>
              <td className="py-3">{grn.lineItems?.length ?? 0}</td>
              <td className="py-3 text-right font-medium">{grn.totalAmountRs ? formatCurrency(grn.totalAmountRs) : "—"}</td>
              <td className="py-3 text-right text-gray-600">{grn.totalWeightGrams ? `${grn.totalWeightGrams.toFixed(3)} g` : "—"}</td>
              <td className="py-3"><StatusBadge status={grn.status} /></td>
              <td className="py-3 text-xs text-gray-500">{new Date(grn.receivedDate).toLocaleDateString("en-IN")}</td>
              <td className="py-3">
                <Link href={`/dashboard/purchases/grn/${grn.id}`} className="text-xs font-medium text-maroon-800 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────── Supplier Ledger Tab ────── */

function SupplierLedgerTab() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/suppliers")
      .then((r) => r.json())
      .then((d) => setSuppliers(d.suppliers ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingRows />;

  if (suppliers.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No suppliers yet"
        description="Add suppliers in Store Setup to track ledger balances."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            <th className="pb-3 font-medium">Supplier</th>
            <th className="pb-3 font-medium">City</th>
            <th className="pb-3 font-medium">GSTIN</th>
            <th className="pb-3 font-medium text-right">
              <span className="text-maroon-700">Balance (Rs.)</span>
            </th>
            <th className="pb-3 font-medium text-right">
              <span className="text-gold-700">Balance (Grams)</span>
            </th>
            <th className="pb-3 font-medium text-right">Orders</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s: any) => (
            <tr key={s.id} className="border-b border-gray-100 hover:bg-cream-50/30">
              <td className="py-3 font-medium text-gray-900">{s.name}</td>
              <td className="py-3 text-gray-600">{s.city ?? "—"}</td>
              <td className="py-3 text-xs font-mono text-gray-500">{s.gstin ?? "—"}</td>
              <td className="py-3 text-right">
                <span className={cn(
                  "font-semibold",
                  s.balanceRs > 0 ? "text-red-700" : s.balanceRs < 0 ? "text-emerald-700" : "text-gray-500"
                )}>
                  {formatCurrency(Math.abs(s.balanceRs))}
                  {s.balanceRs > 0 ? " Dr" : s.balanceRs < 0 ? " Cr" : ""}
                </span>
              </td>
              <td className="py-3 text-right">
                <span className={cn(
                  "font-semibold",
                  s.balanceGrams > 0 ? "text-red-700" : s.balanceGrams < 0 ? "text-emerald-700" : "text-gray-500"
                )}>
                  {Math.abs(s.balanceGrams).toFixed(3)} g
                  {s.balanceGrams > 0 ? " Dr" : s.balanceGrams < 0 ? " Cr" : ""}
                </span>
              </td>
              <td className="py-3 text-right text-gray-600">{s._count?.purchaseOrders ?? 0}</td>
              <td className="py-3">
                <Link href={`/dashboard/purchases/supplier-ledger/${s.id}`} className="text-xs font-medium text-maroon-800 hover:underline">
                  Ledger
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────── Returns Tab ────── */

function ReturnsTab() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/purchase-returns")
      .then((r) => r.json())
      .then((d) => setReturns(d.returns ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingRows />;

  if (returns.length === 0) {
    return (
      <EmptyState
        icon={CornerDownLeft}
        title="No purchase returns yet"
        description="Create a return against an approved GRN."
        actionLabel="New Return"
        actionHref="/dashboard/purchases/returns/new"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-gray-500">
            <th className="pb-3 font-medium">Return #</th>
            <th className="pb-3 font-medium">GRN Ref</th>
            <th className="pb-3 font-medium">Reason</th>
            <th className="pb-3 font-medium text-right">Amount</th>
            <th className="pb-3 font-medium">Debit Note</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((ret: any) => (
            <tr key={ret.id} className="border-b border-gray-100 hover:bg-cream-50/30">
              <td className="py-3 font-medium text-maroon-800">{ret.returnNumber}</td>
              <td className="py-3 text-xs text-gray-500">{ret.grn?.grnNumber}</td>
              <td className="py-3 text-xs">{ret.reasonCode.replace(/_/g, " ")}</td>
              <td className="py-3 text-right font-medium">{ret.totalAmountRs ? formatCurrency(ret.totalAmountRs) : "—"}</td>
              <td className="py-3 text-xs font-mono text-gray-500">{ret.debitNoteNumber ?? "—"}</td>
              <td className="py-3"><StatusBadge status={ret.status} /></td>
              <td className="py-3 text-xs text-gray-500">{new Date(ret.returnDate).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────── Shared sub-components ────── */

function LoadingRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon, title, description, actionLabel, actionHref,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Icon className="h-10 w-10 text-gray-300" />
      <h3 className="mt-3 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> {actionLabel}
        </Link>
      )}
    </div>
  );
}
