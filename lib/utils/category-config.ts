import type { StockCategory } from "@prisma/client";

export interface CategoryConfig {
  label: string;
  requiresWeightVerification: boolean;
  defaultUnitOfMeasure: "GRAMS" | "PIECES" | "CARATS";
  defaultHsn: string;
  defaultGstRate: number;
  isMetal: boolean;
}

export const CATEGORY_CONFIG: Record<StockCategory, CategoryConfig> = {
  GOLD_JEWELLERY: {
    label: "Gold Jewellery",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7113",
    defaultGstRate: 3,
    isMetal: true,
  },
  SILVER_JEWELLERY: {
    label: "Silver Jewellery",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7113",
    defaultGstRate: 3,
    isMetal: true,
  },
  DIAMOND_JEWELLERY: {
    label: "Diamond Jewellery",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7113",
    defaultGstRate: 3,
    isMetal: true,
  },
  PLATINUM_JEWELLERY: {
    label: "Platinum Jewellery",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7113",
    defaultGstRate: 3,
    isMetal: true,
  },
  GOLD_BULLION: {
    label: "Gold Bullion",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7108",
    defaultGstRate: 3,
    isMetal: true,
  },
  SILVER_BULLION: {
    label: "Silver Bullion",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7106",
    defaultGstRate: 3,
    isMetal: true,
  },
  GOLD_COIN: {
    label: "Gold Coin",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7108",
    defaultGstRate: 3,
    isMetal: true,
  },
  SILVER_COIN: {
    label: "Silver Coin",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "GRAMS",
    defaultHsn: "7106",
    defaultGstRate: 3,
    isMetal: true,
  },
  GEMSTONE: {
    label: "Gemstone",
    requiresWeightVerification: true,
    defaultUnitOfMeasure: "CARATS",
    defaultHsn: "7103",
    defaultGstRate: 3,
    isMetal: false,
  },
  GIFT_ARTICLE: {
    label: "Gift Article",
    requiresWeightVerification: false,
    defaultUnitOfMeasure: "PIECES",
    defaultHsn: "7117",
    defaultGstRate: 5,
    isMetal: false,
  },
  WATCH: {
    label: "Watch",
    requiresWeightVerification: false,
    defaultUnitOfMeasure: "PIECES",
    defaultHsn: "9102",
    defaultGstRate: 18,
    isMetal: false,
  },
  ACCESSORY: {
    label: "Accessory",
    requiresWeightVerification: false,
    defaultUnitOfMeasure: "PIECES",
    defaultHsn: "7117",
    defaultGstRate: 5,
    isMetal: false,
  },
};

export function getCategoryConfig(category: StockCategory): CategoryConfig {
  return CATEGORY_CONFIG[category];
}

export function requiresWeight(category: StockCategory): boolean {
  return CATEGORY_CONFIG[category].requiresWeightVerification;
}

export const METAL_TYPE_OPTIONS = [
  { value: "GOLD_24K", label: "Gold 24K", purity: 24 },
  { value: "GOLD_22K", label: "Gold 22K", purity: 22 },
  { value: "GOLD_18K", label: "Gold 18K", purity: 18 },
  { value: "SILVER", label: "Silver", purity: 999 },
  { value: "PLATINUM", label: "Platinum", purity: 950 },
] as const;

export const PURITY_MAP: Record<string, number> = {
  GOLD_24K: 99.9,
  GOLD_22K: 91.6,
  GOLD_18K: 75.0,
  SILVER: 99.9,
  PLATINUM: 95.0,
};

export const SUBCATEGORIES: Record<string, string[]> = {
  GOLD_JEWELLERY: ["Ring", "Necklace", "Bangle", "Earring", "Pendant", "Chain", "Bracelet", "Anklet", "Mangalsutra", "Nose Pin", "Waist Belt"],
  SILVER_JEWELLERY: ["Ring", "Necklace", "Bangle", "Earring", "Pendant", "Chain", "Bracelet", "Anklet", "Toe Ring", "Pooja Item"],
  DIAMOND_JEWELLERY: ["Ring", "Necklace", "Earring", "Pendant", "Bracelet", "Bangles"],
  PLATINUM_JEWELLERY: ["Ring", "Chain", "Bracelet", "Pendant"],
  GOLD_BULLION: ["Bar", "Biscuit"],
  SILVER_BULLION: ["Bar", "Biscuit"],
  GOLD_COIN: ["1g", "2g", "5g", "8g", "10g", "20g", "50g", "100g"],
  SILVER_COIN: ["10g", "20g", "50g", "100g", "250g", "500g", "1kg"],
  GEMSTONE: ["Ruby", "Emerald", "Sapphire", "Pearl", "Coral", "Hessonite", "Cat's Eye"],
  GIFT_ARTICLE: ["Silver Frame", "Silver Idol", "Decorative", "Corporate Gift"],
  WATCH: ["Men", "Women", "Unisex"],
  ACCESSORY: ["Brooch", "Cufflinks", "Tie Pin", "Hair Clip"],
};

export const RETURN_REASON_CODES = [
  { value: "QUALITY_DEFECT", label: "Quality Defect" },
  { value: "WRONG_ITEM", label: "Wrong Item Received" },
  { value: "WEIGHT_MISMATCH", label: "Weight Mismatch" },
  { value: "PURITY_MISMATCH", label: "Purity Mismatch" },
  { value: "DAMAGED", label: "Damaged in Transit" },
  { value: "NOT_AS_ORDERED", label: "Not as Per Order" },
  { value: "EXCESS_QUANTITY", label: "Excess Quantity" },
  { value: "OTHER", label: "Other" },
] as const;
