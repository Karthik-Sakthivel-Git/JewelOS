"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Package, Tag, MoreVertical, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency, formatWeight } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { CATEGORY_CONFIG } from "@/lib/utils/category-config";

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory?: string | null;
  metalType?: string | null;
  pricingType: string;
  purity?: number | null;
  supplierMrp?: number | null;
  makingChargeValue?: number | null;
  active: boolean;
  barcode?: string | null;
  imageUrl?: string | null;
  images: string[];
  _count: { stockItems: number };
}

interface Props {
  products: ProductRow[];
  isLoading: boolean;
}

export function ProductVirtualList({ products, isLoading }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 10,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card animate-pulse p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-gray-200" />
                <div className="h-3 w-32 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-12 w-12 text-gray-300" />
        <h3 className="mt-3 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add your first product to get started.
        </p>
        <Link href="/dashboard/inventory/new" className="btn-primary mt-4 inline-flex items-center gap-2">
          <Tag className="h-4 w-4" /> Add Product
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-300px)] min-h-[400px] overflow-auto rounded-xl border border-gray-200"
    >
      {/* Table header */}
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_120px_120px_100px_100px_80px_48px] gap-4 border-b border-gray-200 bg-gray-50/95 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 backdrop-blur-sm">
        <span>Product</span>
        <span>Category</span>
        <span>Metal</span>
        <span>Pricing</span>
        <span className="text-right">Stock</span>
        <span>Status</span>
        <span />
      </div>

      {/* Virtual rows */}
      <div
        style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const product = products[virtualRow.index];
          const catConfig = CATEGORY_CONFIG[product.category as keyof typeof CATEGORY_CONFIG];
          const thumb = product.images?.[0] || product.imageUrl;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-[1fr_120px_120px_100px_100px_80px_48px] items-center gap-4 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-cream-50/50"
            >
              {/* Product */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  thumb ? "" : "bg-maroon-50"
                )}>
                  {thumb ? (
                    <img src={thumb} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <Package className="h-5 w-5 text-maroon-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/inventory/${product.id}`}
                    className="truncate text-sm font-medium text-gray-900 hover:text-maroon-800"
                  >
                    {product.name}
                  </Link>
                  <p className="truncate text-xs text-gray-400">
                    {product.sku}
                    {product.barcode && ` · ${product.barcode}`}
                  </p>
                </div>
              </div>

              {/* Category */}
              <span className="text-xs text-gray-600">
                {catConfig?.label ?? product.category}
                {product.subcategory && (
                  <span className="block text-gray-400">{product.subcategory}</span>
                )}
              </span>

              {/* Metal */}
              <span className="text-xs text-gray-600">
                {product.metalType?.replace(/_/g, " ") ?? "—"}
                {product.purity != null && (
                  <span className="block text-gray-400">{product.purity}% pure</span>
                )}
              </span>

              {/* Pricing */}
              <span className="text-xs">
                {product.pricingType === "FIXED_MRP" ? (
                  <span className="text-blue-700">
                    {product.supplierMrp ? formatCurrency(product.supplierMrp) : "MRP"}
                  </span>
                ) : (
                  <span className="text-gold-700">Weight-Based</span>
                )}
              </span>

              {/* Stock */}
              <span className="text-right text-sm font-medium text-gray-900">
                {product._count.stockItems}
              </span>

              {/* Status */}
              <StatusBadge status={product.active ? "ACTIVE" : "INACTIVE"} />

              {/* Actions */}
              <div className="relative group">
                <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full z-20 hidden w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg group-hover:block">
                  <Link
                    href={`/dashboard/inventory/${product.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                  <Link
                    href={`/dashboard/inventory/${product.id}/edit`}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <button className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" /> Deactivate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
