import { z } from "zod";

export const StockCategoryEnum = z.enum([
  "GOLD_JEWELLERY", "SILVER_JEWELLERY", "DIAMOND_JEWELLERY", "PLATINUM_JEWELLERY",
  "GOLD_BULLION", "SILVER_BULLION", "GOLD_COIN", "SILVER_COIN",
  "GEMSTONE", "GIFT_ARTICLE", "WATCH", "ACCESSORY",
]);

export const MetalTypeEnum = z.enum([
  "GOLD_24K", "GOLD_22K", "GOLD_18K", "SILVER", "PLATINUM",
]);

export const PricingTypeEnum = z.enum(["WEIGHT_BASED", "FIXED_MRP"]);

export const UnitOfMeasureEnum = z.enum(["GRAMS", "PIECES", "CARATS", "MILLIGRAMS"]);

export const productCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: StockCategoryEnum,
  subcategory: z.string().optional(),
  designCode: z.string().optional(),
  description: z.string().optional(),

  metalType: MetalTypeEnum.nullable().optional(),
  purity: z.coerce.number().min(0).max(100).nullable().optional(),
  grossWeight: z.coerce.number().min(0).nullable().optional(),
  netWeight: z.coerce.number().min(0).nullable().optional(),
  stoneType: z.string().optional(),
  stoneWeight: z.coerce.number().min(0).nullable().optional(),
  stoneValue: z.coerce.number().min(0).nullable().optional(),

  pricingType: PricingTypeEnum,
  makingChargeType: z.enum(["PER_GRAM", "FLAT", "PERCENTAGE"]).optional(),
  makingChargeValue: z.coerce.number().min(0).nullable().optional(),
  supplierMrp: z.coerce.number().min(0).nullable().optional(),

  hsnCode: z.string().min(4, "HSN code is required"),
  gstRate: z.coerce.number().min(0).max(28).default(3),
  unitOfMeasure: UnitOfMeasureEnum.default("GRAMS"),
  bisHuid: z.string().optional(),
  certificateUrl: z.string().optional(),

  images: z.array(z.string()).max(8).default([]),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = productCreateSchema.partial();
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: StockCategoryEnum.optional(),
  metalType: MetalTypeEnum.optional(),
  pricingType: PricingTypeEnum.optional(),
  active: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
