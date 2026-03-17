"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function SupplierLedgerPage() {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/suppliers/${id}/ledger?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        setSupplier(d.supplier);
        setEntries(d.entries ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="mx-auto max-w-5xl animate-pulse card h-96 bg-gray-100" />;

  if (!supplier) {
    return (
      <div className="flex flex-col items-center py-20">
        <BookOpen className="h-12 w-12 text-gray-300" />
        <p className="mt-2 text-gray-500">Supplier not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/purchases" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
          <p className="text-sm text-gray-500">Supplier Ledger — Dual Balance View</p>
        </div>
      </div>

      {/* Balance summary — Rs and Grams side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6 border-l-4 border-l-maroon-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-maroon-50 p-3">
              <TrendingDown className="h-6 w-6 text-maroon-800" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monetary Balance (Rs.)
              </p>
              <p className={cn(
                "text-2xl font-bold",
                supplier.balanceRs > 0 ? "text-red-700" : supplier.balanceRs < 0 ? "text-emerald-700" : "text-gray-500"
              )}>
                {formatCurrency(Math.abs(supplier.balanceRs))}
              </p>
              <p className="text-xs text-gray-400">
                {supplier.balanceRs > 0 ? "We owe supplier" : supplier.balanceRs < 0 ? "Supplier owes us" : "Settled"}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-gold-400">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gold-50 p-3">
              <TrendingUp className="h-6 w-6 text-gold-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metal Balance (Grams)
              </p>
              <p className={cn(
                "text-2xl font-bold",
                supplier.balanceGrams > 0 ? "text-red-700" : supplier.balanceGrams < 0 ? "text-emerald-700" : "text-gray-500"
              )}>
                {Math.abs(supplier.balanceGrams).toFixed(3)} g
              </p>
              <p className="text-xs text-gray-400">
                {supplier.balanceGrams > 0 ? "Metal payable" : supplier.balanceGrams < 0 ? "Metal receivable" : "Settled"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger table */}
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Transaction History</h2>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <BookOpen className="h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No ledger entries yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Narration</th>
                  <th className="px-6 py-3 font-medium text-right">
                    <span className="text-maroon-700">Debit Rs.</span>
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    <span className="text-emerald-700">Credit Rs.</span>
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    <span className="text-maroon-700">Debit (g)</span>
                  </th>
                  <th className="px-6 py-3 font-medium text-right">
                    <span className="text-emerald-700">Credit (g)</span>
                  </th>
                  <th className="px-6 py-3 font-medium text-right">Bal Rs.</th>
                  <th className="px-6 py-3 font-medium text-right">Bal (g)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry: any) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-cream-50/30">
                    <td className="px-6 py-3 text-xs text-gray-500">
                      {new Date(entry.entryDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {entry.entryType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-600 max-w-[200px] truncate">
                      {entry.narration ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-red-700">
                      {entry.debitRs > 0 ? formatCurrency(entry.debitRs) : ""}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-emerald-700">
                      {entry.creditRs > 0 ? formatCurrency(entry.creditRs) : ""}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-red-700">
                      {entry.debitGrams > 0 ? `${entry.debitGrams.toFixed(3)}` : ""}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-emerald-700">
                      {entry.creditGrams > 0 ? `${entry.creditGrams.toFixed(3)}` : ""}
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-semibold text-gray-800">
                      {formatCurrency(entry.runningBalRs)}
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-semibold text-gray-800">
                      {entry.runningBalGrams.toFixed(3)} g
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
