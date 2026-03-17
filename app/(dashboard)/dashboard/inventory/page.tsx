"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Printer, Package, RefreshCw } from "lucide-react";
import { ProductFilterBar, type ProductFilters } from "@/components/inventory/product-filters";
import { ProductVirtualList } from "@/components/inventory/product-list";

const defaultFilters: ProductFilters = {
  search: "",
  category: "",
  metalType: "",
  pricingType: "",
  active: null,
};

export default function InventoryPage() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [products, setProducts] = useState<never[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.metalType) params.set("metalType", filters.metalType);
      if (filters.pricingType) params.set("pricingType", filters.pricingType);
      if (filters.active !== null) params.set("active", String(filters.active));
      params.set("limit", "200");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setPagination(data.pagination ?? { page: 1, total: 0, pages: 0 });
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalogue</h1>
          <p className="text-sm text-gray-500">
            {pagination.total} products
            {filters.category && " (filtered)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link
            href="/dashboard/inventory/tags"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" /> Print Tags
          </Link>
          <Link
            href="/dashboard/inventory/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <ProductFilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Product list with virtual scrolling */}
      <ProductVirtualList products={products} isLoading={isLoading} />
    </div>
  );
}
