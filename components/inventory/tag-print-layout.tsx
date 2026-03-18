"use client";

import Barcode from "react-barcode";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { formatCurrency, formatWeight } from "@/lib/utils";

interface TagData {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  barcode: string;
  metalType?: string | null;
  purity?: number | null;
  grossWeight?: number | null;
  netWeight?: number | null;
  makingChargeValue?: number | null;
  price?: number | null;
  bisHuid?: string | null;
  rfid?: string | null;
}

interface Props {
  tags: TagData[];
  template: "small" | "medium" | "large";
  format: "barcode" | "qr" | "both";
}

/**
 * A4 sheet print layout for product tags.
 * 3 columns x 8 rows = 24 tags per page.
 * Uses @media print CSS for clean output.
 */
export function TagPrintLayout({ tags, template, format }: Props) {
  const pages: TagData[][] = [];
  const TAGS_PER_PAGE = 24;
  for (let i = 0; i < tags.length; i += TAGS_PER_PAGE) {
    pages.push(tags.slice(i, i + TAGS_PER_PAGE));
  }

  // QR is mandatory on all tags (barcode optional).
  const showBarcode = format === "barcode" || format === "both";
  const showQr = true;

  const BRAND = "JewelOS";

  function renderSmallTag(tag: TagData) {
    // Small (30×20mm): QR-only (QR is mandatory)
    const qrPayload = JSON.stringify({
      id: tag.id,
      rfid: tag.rfid,
      tenant: tag.tenantId,
    });

    return (
      <div className="inline-block h-[20mm] w-[30mm] overflow-hidden rounded border border-gray-300 bg-white px-1 py-1 text-[7px] leading-tight">
        <p className="text-[7px] font-bold uppercase tracking-wide text-maroon-800">
          {BRAND}
        </p>
        <p className="truncate font-semibold text-gray-900">{tag.name}</p>
        <div className="mt-0.5 flex justify-between text-[7px] text-gray-700">
          <span className="truncate">
            {tag.netWeight != null
              ? formatWeight(tag.netWeight)
              : tag.grossWeight != null
                ? formatWeight(tag.grossWeight)
                : "0g"}
          </span>
          <span>{tag.purity != null ? `${tag.purity}%` : "—"}</span>
        </div>
        <div className="mt-0.5 flex justify-center">
          <QRCode value={qrPayload} size={36} level="M" />
        </div>
        {tag.rfid && (
          <p className="mt-0.5 truncate text-[6px] text-gray-700">{tag.rfid}</p>
        )}
      </div>
    );
  }

  function renderMediumTag(tag: TagData) {
    const qrPayload = JSON.stringify({
      id: tag.id,
      rfid: tag.rfid,
      tenant: tag.tenantId,
    });

    return (
      <div className="inline-block h-[40mm] w-[60mm] overflow-hidden rounded-lg border border-gray-300 bg-white p-2 text-[8px] leading-tight">
        <p className="text-[8px] font-bold uppercase tracking-wide text-maroon-800">
          {BRAND}
        </p>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9px] font-semibold text-gray-900">{tag.name}</p>
            <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[8px] text-gray-700">
              {tag.metalType && <span>{tag.metalType.replace(/_/g, " ")}</span>}
              <span>{tag.purity != null ? `${tag.purity}%` : "—"}</span>
              <span>
                {tag.netWeight != null
                  ? formatWeight(tag.netWeight)
                  : tag.grossWeight != null
                    ? formatWeight(tag.grossWeight)
                    : "0g"}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <QRCode value={qrPayload} size={42} level="M" />
          </div>
        </div>

        {showBarcode && (
          <div className="mt-1 flex justify-center">
            <Barcode
              value={tag.barcode}
              width={0.95}
              height={22}
              fontSize={7}
              margin={0}
              displayValue={false}
            />
          </div>
        )}

        {tag.rfid && (
          <p className="mt-1 truncate text-[8px] text-gray-700">{tag.rfid}</p>
        )}
      </div>
    );
  }

  function renderLargeTag(tag: TagData) {
    const qrPayload = JSON.stringify({
      id: tag.id,
      rfid: tag.rfid,
      tenant: tag.tenantId,
    });

    return (
      <div className="inline-block h-[50mm] w-[90mm] overflow-hidden rounded-xl border border-gray-300 bg-white p-3 text-[9px] leading-tight">
        <p className="text-[9px] font-bold uppercase tracking-wide text-maroon-800">
          {BRAND}
        </p>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-gray-900">{tag.name}</p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] text-gray-800">
              <span>{tag.metalType ? tag.metalType.replace(/_/g, " ") : "—"}</span>
              <span>{tag.purity != null ? `${tag.purity}%` : "—"}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] text-gray-800">
              <span>
                {tag.netWeight != null
                  ? `Wt: ${formatWeight(tag.netWeight)}`
                  : tag.grossWeight != null
                    ? `Wt: ${formatWeight(tag.grossWeight)}`
                    : "Wt: 0g"}
              </span>
              {tag.makingChargeValue != null && (
                <span>Making: {formatCurrency(tag.makingChargeValue)}</span>
              )}
              <span>{tag.price != null ? `Price: ${formatCurrency(tag.price)}` : "Price: —"}</span>
            </div>
          </div>

          <div className="shrink-0">
            <QRCode value={qrPayload} size={64} level="M" />
          </div>
        </div>

        {showBarcode && (
          <div className="mt-2 flex justify-center">
            <Barcode
              value={tag.barcode}
              width={1.25}
              height={30}
              fontSize={8}
              margin={0}
              displayValue={false}
            />
          </div>
        )}

        {tag.rfid && (
          <p className="mt-1 truncate text-[9px] text-gray-800">RFID: {tag.rfid}</p>
        )}
      </div>
    );
  }

  function renderTag(tag: TagData) {
    switch (template) {
      case "small":
        return renderSmallTag(tag);
      case "large":
        return renderLargeTag(tag);
      case "medium":
      default:
        return renderMediumTag(tag);
    }
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 210mm; }
          .no-print { display: none !important; }
          .print-page { page-break-after: always; }
        }
      `}</style>

      <div className="print-area">
        {pages.map((pageTags, pageIdx) => (
          <div
            key={pageIdx}
            className="print-page mx-auto grid grid-cols-3 gap-2 p-4"
            style={{ width: "210mm", minHeight: "297mm" }}
          >
            {pageTags.map((tag, tagIdx) => (
              <div key={`${pageIdx}-${tagIdx}`} className="flex items-center justify-center">
                {renderTag(tag)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
