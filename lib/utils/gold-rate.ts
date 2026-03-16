/**
 * Gold Rate Price Calculator
 *
 * Two pricing paths based on PricingType enum:
 *   WEIGHT_BASED: price = net_weight × live_rate + making_charge + stone_value
 *   FIXED_MRP:    price = supplier_mrp (no rate formula applied)
 */

export type PricingType = "WEIGHT_BASED" | "FIXED_MRP";

export interface WeightBasedInput {
  pricingType: "WEIGHT_BASED";
  netWeightGrams: number;
  liveRatePerGram: number;
  makingChargePerGram?: number;
  makingChargeFlat?: number;
  makingChargePercent?: number;
  stoneValue?: number;
  wastagePercent?: number;
}

export interface FixedMrpInput {
  pricingType: "FIXED_MRP";
  supplierMrp: number;
}

export type PriceInput = WeightBasedInput | FixedMrpInput;

export interface PriceBreakdown {
  metalValue: number;
  makingCharge: number;
  stoneValue: number;
  wastageValue: number;
  preTaxTotal: number;
}

export function calculatePrice(input: PriceInput): PriceBreakdown {
  if (input.pricingType === "FIXED_MRP") {
    return {
      metalValue: input.supplierMrp,
      makingCharge: 0,
      stoneValue: 0,
      wastageValue: 0,
      preTaxTotal: input.supplierMrp,
    };
  }

  const {
    netWeightGrams,
    liveRatePerGram,
    makingChargePerGram = 0,
    makingChargeFlat = 0,
    makingChargePercent = 0,
    stoneValue = 0,
    wastagePercent = 0,
  } = input;

  const metalValue = netWeightGrams * liveRatePerGram;

  const wastageValue = metalValue * (wastagePercent / 100);

  let makingCharge = makingChargeFlat;
  if (makingChargePerGram > 0) {
    makingCharge += netWeightGrams * makingChargePerGram;
  }
  if (makingChargePercent > 0) {
    makingCharge += metalValue * (makingChargePercent / 100);
  }

  const preTaxTotal = metalValue + wastageValue + makingCharge + stoneValue;

  return {
    metalValue: round2(metalValue),
    makingCharge: round2(makingCharge),
    stoneValue: round2(stoneValue),
    wastageValue: round2(wastageValue),
    preTaxTotal: round2(preTaxTotal),
  };
}

/**
 * Convert rate between purities.
 * E.g., 24K rate → 22K: factor = 22/24 = 0.9167
 */
export function convertPurityRate(
  rate24k: number,
  targetPurity: number
): number {
  return round2(rate24k * (targetPurity / 24));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
