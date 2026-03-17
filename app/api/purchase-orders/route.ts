import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { purchaseOrderCreateSchema } from "@/lib/validations/purchase";
import { generatePoNumber } from "@/lib/utils/number-series";
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

    const [orders, total] = await Promise.all([
      db.purchaseOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          supplier: { select: { id: true, name: true, city: true } },
          branch: { select: { id: true, name: true } },
          lineItems: true,
          _count: { select: { grns: true } },
        },
      }),
      db.purchaseOrder.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("GET /api/purchase-orders error:", error);
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const body = await req.json();
    const data = purchaseOrderCreateSchema.parse(body);

    const poNumber = await generatePoNumber(tenantId);

    let totalAmount = 0;
    let totalGrams = 0;

    const lineItemsData = data.lineItems.map((item) => {
      const lineTotal = item.totalAmount ?? (item.ratePerUnit ?? 0) * item.quantity;
      totalAmount += lineTotal;
      if (item.unitOfMeasure === "GRAMS") totalGrams += item.quantity;
      return {
        description: item.description,
        productId: item.productId || undefined,
        quantity: item.quantity,
        unitOfMeasure: item.unitOfMeasure,
        metalType: item.metalType ?? null,
        purity: item.purity ?? null,
        ratePerUnit: item.ratePerUnit ?? null,
        wastagePercent: item.wastagePercent ?? null,
        totalAmount: lineTotal,
      };
    });

    const order = await db.purchaseOrder.create({
      data: {
        tenantId,
        branchId: data.branchId,
        supplierId: data.supplierId,
        poNumber,
        purchaseType: data.purchaseType,
        totalAmount,
        totalGrams,
        notes: data.notes,
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
        lineItems: { create: lineItemsData },
      },
      include: {
        supplier: { select: { id: true, name: true } },
        lineItems: true,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("POST /api/purchase-orders error:", error);
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 });
  }
}
