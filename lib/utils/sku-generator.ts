import type { StockCategory, MetalType } from "@prisma/client";

const CATEGORY_PREFIX: Record<StockCategory, string> = {
  GOLD_JEWELLERY: "GJ",
  SILVER_JEWELLERY: "SJ",
  DIAMOND_JEWELLERY: "DJ",
  PLATINUM_JEWELLERY: "PJ",
  GOLD_BULLION: "GB",
  SILVER_BULLION: "SB",
  GOLD_COIN: "GC",
  SILVER_COIN: "SC",
  GEMSTONE: "GS",
  GIFT_ARTICLE: "GA",
  WATCH: "WA",
  ACCESSORY: "AC",
};

const METAL_PREFIX: Record<MetalType, string> = {
  GOLD_24K: "24",
  GOLD_22K: "22",
  GOLD_18K: "18",
  SILVER: "AG",
  PLATINUM: "PT",
};

/**
 * Generate SKU: {CategoryPrefix}-{MetalPrefix}-{RandomHex}
 * E.g. GJ-22-A3F1B2
 */
export function generateSku(
  category: StockCategory,
  metalType?: MetalType | null
): string {
  const catPrefix = CATEGORY_PREFIX[category] ?? "XX";
  const metalPart = metalType ? METAL_PREFIX[metalType] : "00";
  const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `${catPrefix}-${metalPart}-${hex}`;
}

/**
 * Generate barcode: JOS-{timestamp hex}-{random}
 * CODE128 compatible (alphanumeric)
 */
export function generateBarcode(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `JOS${ts}${rand}`;
}

/**
 * Generate RFID tag ID: RF-{category short}-{timestamp}-{random}
 */
export function generateRfidTag(category: StockCategory): string {
  const catPrefix = CATEGORY_PREFIX[category] ?? "XX";
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `RF-${catPrefix}-${ts}-${rand}`;
}
