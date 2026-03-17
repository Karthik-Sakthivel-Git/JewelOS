import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateBarcode, generateRfidTag } from "@/lib/utils/sku-generator";

/**
 * POST /api/grn/:id/approve
 *
 * Approves a GRN: creates StockItems from GRN line items,
 * posts to supplier ledger (Rs and Grams), and updates GRN status.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const grn = await db.goodsReceivedNote.findUnique({
      where: { id },
      include: {
        lineItems: {
          where: { accepted: true },
          include: { product: true },
        },
      },
    });

    if (!grn) {
      return NextResponse.json({ error: "GRN not found" }, { status: 404 });
    }

    if (grn.status === "APPROVED") {
      return NextResponse.json({ error: "GRN is already approved" }, { status: 400 });
    }

    await db.$transaction(async (tx) => {
      const stockItems = grn.lineItems.map((line) => ({
        productId: line.productId,
        branchId: grn.branchId,
        grossWeight: line.grossWeight,
        netWeight: line.netWeight,
        stoneWeight: line.stoneWeight,
        stoneValue: line.stoneValue,
        supplierMrp: line.supplierMrp,
        costPrice: line.totalPrice,
        tagPrice: line.totalPrice,
        quantity: line.quantity,
        barcode: generateBarcode(),
        rfidTag: generateRfidTag(line.product.category),
        batchNumber: grn.grnNumber,
        grnId: grn.id,
      }));

      await tx.stockItem.createMany({ data: stockItems });

      await tx.goodsReceivedNote.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      if (grn.purchaseOrderId) {
        await tx.purchaseOrder.update({
          where: { id: grn.purchaseOrderId },
          data: { status: "RECEIVED" },
        });
      }

      const totalRs = grn.totalAmountRs ?? 0;
      const totalGrams = grn.totalWeightGrams ?? 0;

      const supplier = await tx.supplier.findUnique({
        where: { id: grn.supplierId },
      });

      const prevBalRs = supplier?.balanceRs ?? 0;
      const prevBalGrams = supplier?.balanceGrams ?? 0;

      await tx.supplierLedgerEntry.create({
        data: {
          supplierId: grn.supplierId,
          tenantId: grn.tenantId,
          entryType: "GRN_INWARD",
          referenceType: "GRN",
          referenceId: grn.id,
          creditRs: totalRs,
          creditGrams: totalGrams,
          runningBalRs: prevBalRs + totalRs,
          runningBalGrams: prevBalGrams + totalGrams,
          narration: `GRN ${grn.grnNumber} approved — ${grn.lineItems.length} items`,
        },
      });

      await tx.supplier.update({
        where: { id: grn.supplierId },
        data: {
          balanceRs: { increment: totalRs },
          balanceGrams: { increment: totalGrams },
        },
      });
    });

    return NextResponse.json({ success: true, message: "GRN approved, stock added, ledger updated" });
  } catch (error) {
    console.error("POST /api/grn/[id]/approve error:", error);
    return NextResponse.json({ error: "Failed to approve GRN" }, { status: 500 });
  }
}
