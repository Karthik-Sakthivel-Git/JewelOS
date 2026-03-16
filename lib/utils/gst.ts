/**
 * Per-line GST Calculator for Indian Jewellery
 *
 * HSN 7113 (Gold/Silver Jewellery):  3% GST (1.5% CGST + 1.5% SGST)
 * HSN 7114 (Gold/Silversmith wares): 3% GST
 * HSN 7117 (Imitation Jewellery):    5% if ≤ ₹1000/pc, else 12%
 * HSN 9988 (Repair/Job work):       18% (5% for job work on gold)
 * HSN 7108 (Gold Bullion):           3% GST
 * HSN 7106 (Silver Bullion):         3% GST
 * Making charges:                     5% GST (when billed separately)
 *
 * For intra-state: split equally into CGST + SGST
 * For inter-state: full amount as IGST
 */

export interface GstLineInput {
  taxableValue: number;
  gstRate: number;
  hsnCode: string;
  isInterState?: boolean;
  discount?: number;
}

export interface GstLineResult {
  hsnCode: string;
  taxableValue: number;
  gstRate: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalGst: number;
  lineTotal: number;
}

export function calculateLineGst(input: GstLineInput): GstLineResult {
  const {
    taxableValue,
    gstRate,
    hsnCode,
    isInterState = false,
    discount = 0,
  } = input;

  const discountedValue = Math.max(0, taxableValue - discount);

  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstRate = gstRate;
    igstAmount = round2(discountedValue * (igstRate / 100));
  } else {
    cgstRate = gstRate / 2;
    sgstRate = gstRate / 2;
    cgstAmount = round2(discountedValue * (cgstRate / 100));
    sgstAmount = round2(discountedValue * (sgstRate / 100));
  }

  const totalGst = cgstAmount + sgstAmount + igstAmount;

  return {
    hsnCode,
    taxableValue: round2(discountedValue),
    gstRate,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    totalGst: round2(totalGst),
    lineTotal: round2(discountedValue + totalGst),
  };
}

export interface InvoiceGstSummary {
  lines: GstLineResult[];
  totalTaxable: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalGst: number;
  grandTotal: number;
}

export function calculateInvoiceGst(
  lines: GstLineInput[]
): InvoiceGstSummary {
  const results = lines.map(calculateLineGst);

  const totalTaxable = results.reduce((sum, l) => sum + l.taxableValue, 0);
  const totalCgst = results.reduce((sum, l) => sum + l.cgstAmount, 0);
  const totalSgst = results.reduce((sum, l) => sum + l.sgstAmount, 0);
  const totalIgst = results.reduce((sum, l) => sum + l.igstAmount, 0);
  const totalGst = totalCgst + totalSgst + totalIgst;

  return {
    lines: results,
    totalTaxable: round2(totalTaxable),
    totalCgst: round2(totalCgst),
    totalSgst: round2(totalSgst),
    totalIgst: round2(totalIgst),
    totalGst: round2(totalGst),
    grandTotal: round2(totalTaxable + totalGst),
  };
}

/** Standard HSN → GST rate mapping for jewellery */
export const HSN_GST_MAP: Record<string, number> = {
  "7113": 3,
  "7114": 3,
  "7108": 3,
  "7106": 3,
  "7107": 3,
  "7110": 3,
  "7117": 5,
  "9988": 18,
  "9989": 18,
  "7101": 3,
  "7102": 0.25,
  "7103": 3,
  "7104": 3,
  "7116": 3,
};

export function getGstRateForHsn(hsnCode: string): number {
  const prefix4 = hsnCode.substring(0, 4);
  return HSN_GST_MAP[prefix4] ?? 3;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
