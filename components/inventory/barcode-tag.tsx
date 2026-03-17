"use client";

import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { formatCurrency, formatWeight } from "@/lib/utils";

interface TagData {
  sku: string;
  name: string;
  barcode: string;
  metalType?: string | null;
  purity?: number | null;
  grossWeight?: number | null;
  netWeight?: number | null;
  price?: number | null;
  bisHuid?: string | null;
}

export function BarcodeTag({ data }: { data: TagData }) {
  return (
    <div className="inline-block w-[240px] rounded-lg border border-gray-300 bg-white p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-maroon-800">
        JewelOS
      </p>

      <div className="gold-divider my-1" />

      <p className="truncate text-xs font-semibold text-gray-900">{data.name}</p>
      <p className="text-[10px] text-gray-500">{data.sku}</p>

      {data.metalType && (
        <div className="mt-1 flex justify-center gap-3 text-[10px] text-gray-600">
          <span>{data.metalType.replace(/_/g, " ")}</span>
          {data.purity != null && <span>{data.purity}%</span>}
        </div>
      )}

      {(data.grossWeight || data.netWeight) && (
        <div className="mt-0.5 flex justify-center gap-3 text-[10px] text-gray-600">
          {data.grossWeight != null && <span>Gross: {formatWeight(data.grossWeight)}</span>}
          {data.netWeight != null && <span>Net: {formatWeight(data.netWeight)}</span>}
        </div>
      )}

      {data.bisHuid && (
        <p className="mt-0.5 text-[9px] text-gold-600">HUID: {data.bisHuid}</p>
      )}

      <div className="mt-2 flex items-center justify-center">
        <Barcode
          value={data.barcode}
          width={1.2}
          height={30}
          fontSize={8}
          margin={0}
          displayValue={true}
        />
      </div>

      {data.price != null && (
        <p className="mt-1 text-sm font-bold text-maroon-800">
          {formatCurrency(data.price)}
        </p>
      )}
    </div>
  );
}

export function QrTag({ data }: { data: TagData }) {
  const qrPayload = JSON.stringify({
    sku: data.sku,
    barcode: data.barcode,
    huid: data.bisHuid,
  });

  return (
    <div className="inline-block w-[180px] rounded-lg border border-gray-300 bg-white p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-maroon-800">
        JewelOS
      </p>
      <div className="gold-divider my-1" />
      <p className="truncate text-xs font-semibold text-gray-900">{data.name}</p>
      <p className="mb-2 text-[10px] text-gray-500">{data.sku}</p>

      <div className="flex justify-center">
        <QRCodeSVG value={qrPayload} size={80} level="M" />
      </div>

      {data.price != null && (
        <p className="mt-2 text-sm font-bold text-maroon-800">
          {formatCurrency(data.price)}
        </p>
      )}
    </div>
  );
}
