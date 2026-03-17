"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Edit, Package, Scale, Tag, ShieldCheck,
  Barcode as BarcodeIcon, Copy, Check,
} from "lucide-react";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/lib/utils/category-config";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarcodeTag, QrTag } from "@/components/inventory/barcode-tag";
import type { StockCategory } from "@prisma/client";

interface ProductDetail {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: StockCategory;
  subcategory?: string;
  designCode?: string;
  metalType?: string;
  pricingType: string;
  purity?: number;
  hsnCode: string;
  gstRate: number;
  makingChargeType?: string;
  makingChargeValue?: number;
  stoneType?: string;
  stoneWeight?: number;
  stoneValue?: number;
  supplierMrp?: number;
  barcode?: string;
  rfidTag?: string;
  bisHuid?: string;
  certificateUrl?: string;
  images: string[];
  active: boolean;
  _count: { stockItems: number; grnItems: number };
  stockItems: Array<{
    id: string;
    grossWeight?: number;
    netWeight?: number;
    tagPrice?: number;
    available: boolean;
    branch: { id: string; name: string };
  }>;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product))
      .finally(() => setLoading(false));
  }, [id]);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="card h-64 bg-gray-100" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center py-20">
        <Package className="h-12 w-12 text-gray-300" />
        <p className="mt-2 text-gray-500">Product not found</p>
      </div>
    );
  }

  const catConfig = CATEGORY_CONFIG[product.category];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/inventory"
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.sku} · {catConfig?.label}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={product.active ? "ACTIVE" : "INACTIVE"} />
          <Link
            href={`/dashboard/inventory/${product.id}/edit`}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="h-4 w-4" /> Edit
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Images */}
          {product.images.length > 0 && (
            <div className="card p-4">
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    className="aspect-square rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Details grid */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Scale className="h-4 w-4 text-gold-500" /> Metal & Stone Details
            </h2>
            <div className="gold-divider my-3" />
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Metal Type" value={product.metalType?.replace(/_/g, " ")} />
              <DetailItem label="Purity" value={product.purity ? `${product.purity}%` : undefined} />
              <DetailItem label="Stone Type" value={product.stoneType} />
              <DetailItem label="Stone Weight" value={product.stoneWeight ? formatWeight(product.stoneWeight) : undefined} />
              <DetailItem label="Stone Value" value={product.stoneValue ? formatCurrency(product.stoneValue) : undefined} />
            </dl>
          </div>

          {/* Pricing */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Tag className="h-4 w-4 text-gold-500" /> Pricing
            </h2>
            <div className="gold-divider my-3" />
            {product.pricingType === "FIXED_MRP" ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Fixed MRP</span> — Supplier price used directly
                </p>
                {product.supplierMrp != null && (
                  <p className="mt-1 text-lg font-bold text-blue-900">{formatCurrency(product.supplierMrp)}</p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 space-y-2">
                <p className="text-sm text-gold-800">
                  <span className="font-semibold">Weight-Based</span> — net_weight x rate + making + stones
                </p>
                <dl className="grid gap-2 sm:grid-cols-2">
                  <DetailItem label="Making Charge Type" value={product.makingChargeType?.replace(/_/g, " ")} />
                  <DetailItem label="Making Charge Value" value={product.makingChargeValue?.toString()} />
                </dl>
              </div>
            )}
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <DetailItem label="HSN Code" value={product.hsnCode} />
              <DetailItem label="GST Rate" value={`${product.gstRate}%`} />
            </dl>
          </div>

          {/* Compliance */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <ShieldCheck className="h-4 w-4 text-gold-500" /> Compliance
            </h2>
            <div className="gold-divider my-3" />
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="BIS HUID" value={product.bisHuid} />
              <DetailItem label="Design Code" value={product.designCode} />
              {product.certificateUrl && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-gray-500">Certificate</dt>
                  <dd>
                    <a href={product.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-maroon-800 hover:underline">
                      View Certificate
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Stock items */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-900">
              Stock Items ({product._count.stockItems})
            </h2>
            <div className="gold-divider my-3" />
            {product.stockItems.length === 0 ? (
              <p className="text-sm text-gray-400">No stock items yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-gray-500">
                      <th className="pb-2">Branch</th>
                      <th className="pb-2">Gross Wt</th>
                      <th className="pb-2">Net Wt</th>
                      <th className="pb-2 text-right">Tag Price</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.stockItems.map((si) => (
                      <tr key={si.id} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900">{si.branch.name}</td>
                        <td className="py-2 text-gray-600">{si.grossWeight ? formatWeight(si.grossWeight) : "—"}</td>
                        <td className="py-2 text-gray-600">{si.netWeight ? formatWeight(si.netWeight) : "—"}</td>
                        <td className="py-2 text-right font-medium">{si.tagPrice ? formatCurrency(si.tagPrice) : "—"}</td>
                        <td className="py-2"><StatusBadge status={si.available ? "ACTIVE" : "SOLD"} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Barcode / RFID */}
          <div className="card p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <BarcodeIcon className="h-4 w-4 text-gold-500" /> Identifiers
            </h3>
            <div className="mt-3 space-y-3">
              {product.barcode && (
                <CopyField label="Barcode" value={product.barcode} copied={copied} onCopy={copyToClipboard} />
              )}
              {product.rfidTag && (
                <CopyField label="RFID Tag" value={product.rfidTag} copied={copied} onCopy={copyToClipboard} />
              )}
            </div>
          </div>

          {/* Tag preview */}
          {product.barcode && (
            <div className="card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Tag Preview</h3>
              <BarcodeTag data={{
                sku: product.sku,
                name: product.name,
                barcode: product.barcode,
                metalType: product.metalType,
                purity: product.purity,
                bisHuid: product.bisHuid,
              }} />
              <QrTag data={{
                sku: product.sku,
                name: product.name,
                barcode: product.barcode,
                bisHuid: product.bisHuid,
              }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value ?? "—"}</dd>
    </div>
  );
}

function CopyField({
  label, value, copied, onCopy,
}: {
  label: string;
  value: string;
  copied: string | null;
  onCopy: (text: string, label: string) => void;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded bg-gray-50 px-2 py-1 text-xs font-mono text-gray-800">
          {value}
        </code>
        <button
          onClick={() => onCopy(value, label)}
          className="rounded p-1 text-gray-400 hover:text-gray-600"
        >
          {copied === label ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
