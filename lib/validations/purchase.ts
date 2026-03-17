import { z } from "zod";

export const PurchaseTypeEnum = z.enum([
  "OUTRIGHT", "CONSIGNMENT_INWARD", "ADVANCE_BOOKING",
]);

export const UnitOfMeasureEnum = z.enum(["GRAMS", "PIECES", "CARATS", "MILLIGRAMS"]);
export const MetalTypeEnum = z.enum(["GOLD_24K", "GOLD_22K", "GOLD_18K", "SILVER", "PLATINUM"]);

function toOptionalNum(val: unknown): number | undefined {
  if (val === null || val === undefined || val === "") return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

const optionalFloat = z.preprocess(toOptionalNum, z.number().min(0).optional());
const optionalPct = z.preprocess(toOptionalNum, z.number().min(0).max(100).optional());

const poLineItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().int().min(1).default(1),
  unitOfMeasure: UnitOfMeasureEnum.default("GRAMS"),
  metalType: MetalTypeEnum.nullable().optional(),
  purity: optionalPct,
  ratePerUnit: optionalFloat,
  wastagePercent: optionalPct,
  totalAmount: optionalFloat,
});

export const purchaseOrderCreateSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  purchaseType: PurchaseTypeEnum,
  notes: z.string().optional(),
  expectedDate: z.string().optional(),
  lineItems: z.array(poLineItemSchema).min(1, "At least one line item is required"),
});

export type PurchaseOrderCreateInput = z.infer<typeof purchaseOrderCreateSchema>;

const grnLineItemSchema = z.object({
  productId: z.string().min(1),
  description: z.string().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  grossWeight: optionalFloat,
  netWeight: optionalFloat,
  scaleWeight: optionalFloat,
  stoneWeight: optionalFloat,
  stoneValue: optionalFloat,
  wastagePercent: optionalPct,
  purity: optionalPct,
  purityTestResult: z.string().optional(),
  unitOfMeasure: UnitOfMeasureEnum.default("GRAMS"),
  pricingType: z.enum(["WEIGHT_BASED", "FIXED_MRP"]).default("WEIGHT_BASED"),
  unitPrice: optionalFloat,
  supplierMrp: optionalFloat,
  totalPrice: optionalFloat,
});

export const grnCreateSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  purchaseOrderId: z.string().optional(),
  notes: z.string().optional(),
  lineItems: z.array(grnLineItemSchema).min(1, "At least one line item is required"),
});

export type GrnCreateInput = z.infer<typeof grnCreateSchema>;

const returnLineItemSchema = z.object({
  grnLineItemId: z.string().optional(),
  description: z.string().min(1),
  quantity: z.coerce.number().int().min(1).default(1),
  grossWeight: optionalFloat,
  netWeight: optionalFloat,
  unitPrice: optionalFloat,
  totalPrice: optionalFloat,
  reasonCode: z.string().optional(),
});

export const purchaseReturnCreateSchema = z.object({
  grnId: z.string().min(1, "GRN is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  reasonCode: z.string().min(1, "Reason code is required"),
  notes: z.string().optional(),
  lineItems: z.array(returnLineItemSchema).min(1, "At least one line item is required"),
});

export type PurchaseReturnCreateInput = z.infer<typeof purchaseReturnCreateSchema>;
