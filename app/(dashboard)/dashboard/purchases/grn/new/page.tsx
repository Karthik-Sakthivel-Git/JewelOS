"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Scale, AlertTriangle, Package } from "lucide-react";
import { cn, formatCurrency, formatWeight } from "@/lib/utils";
import { CATEGORY_CONFIG, type CategoryConfig } from "@/lib/utils/category-config";
import type { StockCategory } from "@prisma/client";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: StockCategory;
  pricingType: string;
  purity?: number;
  metalType?: string;
}

interface GrnLine {
  productId: string;
  product: Product | null;
  categoryConfig: CategoryConfig | null;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  pricingType: string;
  grossWeight: number | null;
  netWeight: number | null;
  scaleWeight: number | null;
  stoneWeight: number | null;
  stoneValue: number | null;
  wastagePercent: number | null;
  purity: number | null;
  purityTestResult: string;
  unitPrice: number | null;
  supplierMrp: number | null;
  totalPrice: number | null;
}

function emptyLine(): GrnLine {
  return {
    productId: "",
    product: null,
    categoryConfig: null,
    description: "",
    quantity: 1,
    unitOfMeasure: "GRAMS",
    pricingType: "WEIGHT_BASED",
    grossWeight: null,
    netWeight: null,
    scaleWeight: null,
    stoneWeight: null,
    stoneValue: null,
    wastagePercent: null,
    purity: null,
    purityTestResult: "",
    unitPrice: null,
    supplierMrp: null,
    totalPrice: null,
  };
}

export default function NewGrnPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>}>
      <NewGrnContent />
    </Suspense>
  );
}

function NewGrnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poId = searchParams.get("poId");

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState(poId ?? "");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<GrnLine[]>([emptyLine()]);

  useEffect(() => {
    Promise.all([
      fetch("/api/suppliers").then((r) => r.json()),
      fetch("/api/branches").then((r) => r.json()),
      fetch("/api/products?limit=200").then((r) => r.json()),
    ]).then(([supplierData, branchData, productData]) => {
      setSuppliers(supplierData.suppliers ?? []);
      setBranches(branchData.branches ?? []);
      setProducts(productData.products ?? []);
    });
  }, []);

  function setProductForLine(idx: number, productId: string) {
    const product = products.find((p) => p.id === productId) ?? null;
    const catConfig = product ? CATEGORY_CONFIG[product.category] : null;

    setLineItems((prev) =>
      prev.map((li, i) => {
        if (i !== idx) return li;
        return {
          ...li,
          productId,
          product,
          categoryConfig: catConfig,
          description: product?.name ?? "",
          pricingType: product?.pricingType ?? "WEIGHT_BASED",
          purity: product?.purity ?? null,
          unitOfMeasure: catConfig?.defaultUnitOfMeasure ?? "GRAMS",
        };
      })
    );
  }

  function updateLine(idx: number, updates: Partial<GrnLine>) {
    setLineItems((prev) =>
      prev.map((li, i) => {
        if (i !== idx) return li;
        const next = { ...li, ...updates };

        // Auto-calc net weight
        if (next.grossWeight != null && next.stoneWeight != null) {
          next.netWeight = Math.max(0, next.grossWeight - next.stoneWeight);
        }

        // WEIGHT_BASED: total = netWeight * unitPrice + stoneValue
        if (next.pricingType === "WEIGHT_BASED" && next.netWeight != null && next.unitPrice != null) {
          const metalVal = next.netWeight * next.unitPrice;
          const wastage = next.wastagePercent ? metalVal * (next.wastagePercent / 100) : 0;
          next.totalPrice = Math.round((metalVal + wastage + (next.stoneValue ?? 0)) * 100) / 100;
        }

        // FIXED_MRP: total = supplierMrp * quantity
        if (next.pricingType === "FIXED_MRP" && next.supplierMrp != null) {
          next.totalPrice = next.supplierMrp * next.quantity;
        }

        return next;
      })
    );
  }

  function addLine() {
    setLineItems((prev) => [...prev, emptyLine()]);
  }

  function removeLine(idx: number) {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const grandTotalRs = lineItems.reduce((s, li) => s + (li.totalPrice ?? 0), 0);
  const grandTotalGrams = lineItems.reduce((s, li) => s + (li.netWeight ?? li.grossWeight ?? 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    for (const li of lineItems) {
      if (li.categoryConfig?.requiresWeightVerification && li.scaleWeight == null) {
        setError(`Scale weight is mandatory for "${li.description}" (${li.categoryConfig.label})`);
        return;
      }
    }

    if (!supplierId || !branchId) {
      setError("Please select supplier and branch.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/grn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          supplierId,
          purchaseOrderId: purchaseOrderId || undefined,
          notes: notes || undefined,
          lineItems: lineItems.map(({ product, categoryConfig, ...li }) => ({
            ...li,
            productId: li.productId,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create GRN");
      }

      const { grn } = await res.json();
      router.push(`/dashboard/purchases/grn/${grn.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/purchases"
          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Goods Receipt Note</h1>
          <p className="text-sm text-gray-500">
            Record received inventory with weight verification
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header info */}
        <div className="card p-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Supplier *</label>
              <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="input-field" required>
                <option value="">Select supplier</option>
                {suppliers.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Branch *</label>
              <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="input-field" required>
                <option value="">Select branch</option>
                {branches.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}{b.isMain ? " (Main)" : ""}{b.city ? ` — ${b.city}` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">PO Reference</label>
              <input value={purchaseOrderId} onChange={(e) => setPurchaseOrderId(e.target.value)} className="input-field" placeholder="Link to PO (optional)" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field" placeholder="Internal notes" />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">GRN Line Items</h2>
            <button type="button" onClick={addLine} className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
              <Plus className="h-3.5 w-3.5" /> Add Line
            </button>
          </div>

          <div className="space-y-6">
            {lineItems.map((li, idx) => {
              const needsWeight = li.categoryConfig?.requiresWeightVerification ?? false;
              const isFixedMrp = li.pricingType === "FIXED_MRP";

              return (
                <div key={idx} className={cn(
                  "rounded-xl border-2 p-5 transition-all",
                  needsWeight ? "border-gold-200 bg-gold-50/20" : "border-gray-200 bg-gray-50/30"
                )}>
                  {/* Line header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Line {idx + 1}</span>
                      {needsWeight && (
                        <span className="flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-800">
                          <Scale className="h-3 w-3" /> WEIGHT VERIFICATION REQUIRED
                        </span>
                      )}
                      {isFixedMrp && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                          FIXED MRP
                        </span>
                      )}
                      {!needsWeight && !isFixedMrp && (
                        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                          <Package className="h-3 w-3" /> PIECE COUNT ONLY
                        </span>
                      )}
                    </div>
                    {lineItems.length > 1 && (
                      <button type="button" onClick={() => removeLine(idx)} className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Product selection */}
                  <div className="grid gap-3 sm:grid-cols-3 mb-4">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-gray-500">Product *</label>
                      <select
                        value={li.productId}
                        onChange={(e) => setProductForLine(idx, e.target.value)}
                        className="input-field text-sm"
                        required
                      >
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={li.quantity}
                        onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  {/* Weight fields — ONLY shown if requiresWeightVerification */}
                  {needsWeight && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-4">
                      <div>
                        <label className="mb-1 block text-xs text-gray-500">Gross Weight (g)</label>
                        <input
                          type="number"
                          step="0.001"
                          value={li.grossWeight ?? ""}
                          onChange={(e) => updateLine(idx, { grossWeight: e.target.value ? Number(e.target.value) : null })}
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gold-700">
                          Scale Weight (g) *
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={li.scaleWeight ?? ""}
                          onChange={(e) => updateLine(idx, { scaleWeight: e.target.value ? Number(e.target.value) : null })}
                          className="input-field text-sm border-gold-300 focus:border-gold-500 focus:ring-gold-500"
                          required
                          placeholder="Mandatory"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-500">Stone Weight (g)</label>
                        <input
                          type="number"
                          step="0.001"
                          value={li.stoneWeight ?? ""}
                          onChange={(e) => updateLine(idx, { stoneWeight: e.target.value ? Number(e.target.value) : null })}
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-500">Net Weight (g)</label>
                        <div className="input-field bg-gray-100 text-sm font-medium">
                          {li.netWeight != null ? formatWeight(li.netWeight) : "—"}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-gray-500">Purity Test</label>
                        <input
                          value={li.purityTestResult}
                          onChange={(e) => updateLine(idx, { purityTestResult: e.target.value })}
                          className="input-field text-sm"
                          placeholder="Result"
                        />
                      </div>

                      {/* Weight mismatch warning */}
                      {li.grossWeight != null && li.scaleWeight != null &&
                        Math.abs(li.grossWeight - li.scaleWeight) > 0.05 && (
                        <div className="sm:col-span-5 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          Weight mismatch: Declared {formatWeight(li.grossWeight)} vs Scale {formatWeight(li.scaleWeight)} (diff: {formatWeight(Math.abs(li.grossWeight - li.scaleWeight))})
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {isFixedMrp ? (
                      /* FIXED_MRP: show only MRP input */
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-blue-700">
                          Supplier MRP (Rs.) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={li.supplierMrp ?? ""}
                          onChange={(e) => updateLine(idx, { supplierMrp: e.target.value ? Number(e.target.value) : null })}
                          className="input-field text-sm border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                          placeholder="Fixed price"
                        />
                      </div>
                    ) : (
                      /* WEIGHT_BASED: show rate fields */
                      <>
                        <div>
                          <label className="mb-1 block text-xs text-gray-500">Rate/Gram (Rs.)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={li.unitPrice ?? ""}
                            onChange={(e) => updateLine(idx, { unitPrice: e.target.value ? Number(e.target.value) : null })}
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
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-gray-500">Stone Value (Rs.)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={li.stoneValue ?? ""}
                            onChange={(e) => updateLine(idx, { stoneValue: e.target.value ? Number(e.target.value) : null })}
                            className="input-field text-sm"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="mb-1 block text-xs text-gray-500">Line Total</label>
                      <div className="input-field bg-gray-100 text-sm font-bold text-maroon-800">
                        {li.totalPrice != null ? formatCurrency(li.totalPrice) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Weight</p>
              <p className="text-lg font-bold text-gold-700">{formatWeight(grandTotalGrams)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-xl font-bold text-maroon-800">{formatCurrency(grandTotalRs)}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/dashboard/purchases" className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? "Creating..." : "Create GRN"}
          </button>
        </div>
      </form>
    </div>
  );
}
