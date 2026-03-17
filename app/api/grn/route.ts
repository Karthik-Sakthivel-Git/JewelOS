import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { grnCreateSchema } from "@/lib/validations/purchase";
import { generateGrnNumber } from "@/lib/utils/number-series";
import { getCategoryConfig } from "@/lib/utils/category-config";
import { requireTenantId, TenantError } from "@/lib/auth/get-tenant";

export async function GET(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const status = req.nextUrl.searchParams.get("status");
    const supplierId = req.nextUrl.searchParams.get("supplierId");
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 25);

    const where: Record<string, unknown> = { tenantId };
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;

    const [grns, total] = await Promise.all([
      db.goodsReceivedNote.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          purchaseOrder: { select: { id: true, poNumber: true, purchaseType: true } },
          lineItems: { include: { product: { select: { id: true, name: true, category: true } } } },
        },
      }),
      db.goodsReceivedNote.count({ where }),
    ]);

    return NextResponse.json({
      grns,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("GET /api/grn error:", error);
    return NextResponse.json({ error: "Failed to fetch GRNs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const body = await req.json();
    const data = grnCreateSchema.parse(body);

    const grnNumber = await generateGrnNumber(tenantId);

    const productIds = data.lineItems.map((li) => li.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, category: true, pricingType: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const anyRequiresWeight = data.lineItems.some((li) => {
      const prod = productMap.get(li.productId);
      if (!prod) return true;
      return getCategoryConfig(prod.category).requiresWeightVerification;
    });

    let totalAmountRs = 0;
    let totalWeightGrams = 0;

    const lineItemsData = data.lineItems.map((item) => {
      const total = item.totalPrice ?? 0;
      totalAmountRs += total;
      totalWeightGrams += item.netWeight ?? item.grossWeight ?? 0;
      return {
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        grossWeight: item.grossWeight ?? null,
        netWeight: item.netWeight ?? null,
        scaleWeight: item.scaleWeight ?? null,
        stoneWeight: item.stoneWeight ?? null,
        stoneValue: item.stoneValue ?? null,
        wastagePercent: item.wastagePercent ?? null,
        purity: item.purity ?? null,
        purityTestResult: item.purityTestResult,
        unitOfMeasure: item.unitOfMeasure,
        pricingType: item.pricingType,
        unitPrice: item.unitPrice ?? null,
        supplierMrp: item.supplierMrp ?? null,
        totalPrice: total,
      };
    });

    const grn = await db.goodsReceivedNote.create({
      data: {
        tenantId,
        branchId: data.branchId,
        supplierId: data.supplierId,
        purchaseOrderId: data.purchaseOrderId || null,
        grnNumber,
        requiresWeightVerification: anyRequiresWeight,
        totalAmountRs,
        totalWeightGrams,
        notes: data.notes,
        lineItems: { create: lineItemsData },
      },
      include: {
        lineItems: { include: { product: { select: { id: true, name: true, sku: true } } } },
      },
    });

    return NextResponse.json({ grn }, { status: 201 });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("POST /api/grn error:", error);
    return NextResponse.json({ error: "Failed to create GRN" }, { status: 500 });
  }
}
