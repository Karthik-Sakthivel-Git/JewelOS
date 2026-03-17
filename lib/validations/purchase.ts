import { z } from "zod";

export const PurchaseTypeEnum = z.enum([
  "OUTRIGHT", "CONSIGNMENT_INWARD", "ADVANCE_BOOKING",
]);

export const UnitOfMeasureEnum = z.enum(["GRAMS", "PIECES", "CARATS", "MILLIGRAMS"]);
export const MetalTypeEnum = z.enum(["GOLD_24K", "GOLD_22K", "GOLD_18K", "SILVER", "PLATINUM"]);

const poLineItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().int().min(1).default(1),
  unitOfMeasure: UnitOfMeasureEnum.default("GRAMS"),
  metalType: MetalTypeEnum.nullable().optional(),
  purity: z.coerce.number().min(0).max(100).nullable().optional(),
  ratePerUnit: z.coerce.number().min(0).nullable().optional(),
  wastagePercent: z.coerce.number().min(0).max(100).nullable().optional(),
  totalAmount: z.coerce.number().min(0).nullable().optional(),
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
  grossWeight: z.coerce.number().min(0).nullable().optional(),
  netWeight: z.coerce.number().min(0).nullable().optional(),
  scaleWeight: z.coerce.number().min(0).nullable().optional(),
  stoneWeight: z.coerce.number().min(0).nullable().optional(),
  stoneValue: z.coerce.number().min(0).nullable().optional(),
  wastagePercent: z.coerce.number().min(0).max(100).nullable().optional(),
  purity: z.coerce.number().min(0).max(100).nullable().optional(),
  purityTestResult: z.string().optional(),
  unitOfMeasure: UnitOfMeasureEnum.default("GRAMS"),
  pricingType: z.enum(["WEIGHT_BASED", "FIXED_MRP"]).default("WEIGHT_BASED"),
  unitPrice: z.coerce.number().min(0).nullable().optional(),
  supplierMrp: z.coerce.number().min(0).nullable().optional(),
  totalPrice: z.coerce.number().min(0).nullable().optional(),
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
  grossWeight: z.coerce.number().min(0).nullable().optional(),
  netWeight: z.coerce.number().min(0).nullable().optional(),
  unitPrice: z.coerce.number().min(0).nullable().optional(),
  totalPrice: z.coerce.number().min(0).nullable().optional(),
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
