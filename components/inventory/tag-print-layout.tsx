"use client";

import { BarcodeTag } from "./barcode-tag";

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

interface Props {
  tags: TagData[];
}

/**
 * A4 sheet print layout for product tags.
 * 3 columns x 8 rows = 24 tags per page.
 * Uses @media print CSS for clean output.
 */
export function TagPrintLayout({ tags }: Props) {
  const pages: TagData[][] = [];
  const TAGS_PER_PAGE = 24;
  for (let i = 0; i < tags.length; i += TAGS_PER_PAGE) {
    pages.push(tags.slice(i, i + TAGS_PER_PAGE));
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
              <BarcodeTag key={`${pageIdx}-${tagIdx}`} data={tag} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
