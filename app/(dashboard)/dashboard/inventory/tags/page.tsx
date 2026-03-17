"use client";

import { useState, useEffect } from "react";
import { Printer, ArrowLeft, Check, Square, CheckSquare } from "lucide-react";
import Link from "next/link";
import { TagPrintLayout } from "@/components/inventory/tag-print-layout";

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  barcode: string;
  metalType?: string;
  purity?: number;
  grossWeight?: number;
  netWeight?: number;
  supplierMrp?: number;
  bisHuid?: string;
}

export default function TagPrintPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch("/api/products?limit=200&active=true")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p.id)));
    }
  }

  const selectedProducts = products.filter((p) => selected.has(p.id));

  const tagData = selectedProducts.map((p) => ({
    sku: p.sku,
    name: p.name,
    barcode: p.barcode || p.sku,
    metalType: p.metalType,
    purity: p.purity,
    bisHuid: p.bisHuid,
    price: p.supplierMrp,
  }));

  if (showPreview) {
    return (
      <div>
        <div className="no-print mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to selection
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary flex items-center gap-2"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
        <TagPrintLayout tags={tagData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/inventory"
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Tag Print</h1>
            <p className="text-sm text-gray-500">
              Select products to print barcode tags (A4, 24 per page)
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(true)}
          disabled={selected.size === 0}
          className="btn-gold flex items-center gap-2 disabled:opacity-40"
        >
          <Printer className="h-4 w-4" /> Preview ({selected.size})
        </button>
      </div>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
          <button onClick={toggleAll} className="text-gray-500 hover:text-gray-700">
            {selected.size === products.length && products.length > 0 ? (
              <CheckSquare className="h-5 w-5 text-maroon-800" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
          <span className="text-xs font-medium text-gray-500">
            {selected.size} of {products.length} selected
          </span>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => toggleSelect(product.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-cream-50/50"
              >
                {selected.has(product.id) ? (
                  <CheckSquare className="h-5 w-5 shrink-0 text-maroon-800" />
                ) : (
                  <Square className="h-5 w-5 shrink-0 text-gray-300" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-400">
                    {product.sku} · {product.barcode}
                    {product.metalType && ` · ${product.metalType.replace(/_/g, " ")}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
