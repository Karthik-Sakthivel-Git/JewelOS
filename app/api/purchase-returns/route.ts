import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { purchaseReturnCreateSchema } from "@/lib/validations/purchase";
import { generateReturnNumber, generateDebitNoteNumber } from "@/lib/utils/number-series";
import { requireTenantId, TenantError } from "@/lib/auth/get-tenant";

export async function GET(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 25);

    const [returns, total] = await Promise.all([
      db.purchaseReturn.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          grn: { select: { id: true, grnNumber: true, supplierId: true } },
          lineItems: true,
        },
      }),
      db.purchaseReturn.count({ where: { tenantId } }),
    ]);

    return NextResponse.json({
      returns,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("GET /api/purchase-returns error:", error);
    return NextResponse.json({ error: "Failed to fetch purchase returns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const body = await req.json();
    const data = purchaseReturnCreateSchema.parse(body);

    const [returnNumber, debitNoteNumber] = await Promise.all([
      generateReturnNumber(tenantId),
      generateDebitNoteNumber(tenantId),
    ]);

    let totalAmountRs = 0;
    let totalWeightGrams = 0;

    const lineItemsData = data.lineItems.map((item) => {
      const lineTotal = item.totalPrice ?? 0;
      totalAmountRs += lineTotal;
      totalWeightGrams += item.netWeight ?? item.grossWeight ?? 0;
      return {
        grnLineItemId: item.grnLineItemId,
        description: item.description,
        quantity: item.quantity,
        grossWeight: item.grossWeight ?? null,
        netWeight: item.netWeight ?? null,
        unitPrice: item.unitPrice ?? null,
        totalPrice: lineTotal,
        reasonCode: item.reasonCode,
      };
    });

    const result = await db.$transaction(async (tx) => {
      const purchaseReturn = await tx.purchaseReturn.create({
        data: {
          tenantId,
          grnId: data.grnId,
          supplierId: data.supplierId,
          returnNumber,
          reasonCode: data.reasonCode,
          debitNoteNumber,
          totalAmountRs,
          totalWeightGrams,
          notes: data.notes,
          status: "CONFIRMED",
          lineItems: { create: lineItemsData },
        },
        include: { lineItems: true },
      });

      const supplier = await tx.supplier.findUnique({
        where: { id: data.supplierId },
      });
      const prevBalRs = supplier?.balanceRs ?? 0;
      const prevBalGrams = supplier?.balanceGrams ?? 0;

      await tx.supplierLedgerEntry.create({
        data: {
          supplierId: data.supplierId,
          tenantId,
          entryType: "PURCHASE_RETURN",
          referenceType: "PURCHASE_RETURN",
          referenceId: purchaseReturn.id,
          debitRs: totalAmountRs,
          debitGrams: totalWeightGrams,
          runningBalRs: prevBalRs - totalAmountRs,
          runningBalGrams: prevBalGrams - totalWeightGrams,
          narration: `Return ${returnNumber} — Debit Note ${debitNoteNumber}`,
        },
      });

      await tx.supplier.update({
        where: { id: data.supplierId },
        data: {
          balanceRs: { decrement: totalAmountRs },
          balanceGrams: { decrement: totalWeightGrams },
        },
      });

      return purchaseReturn;
    });

    return NextResponse.json({ purchaseReturn: result }, { status: 201 });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("POST /api/purchase-returns error:", error);
    return NextResponse.json({ error: "Failed to create purchase return" }, { status: 500 });
  }
}
