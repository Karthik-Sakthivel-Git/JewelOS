import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const grn = await db.goodsReceivedNote.findUnique({
      where: { id },
      include: {
        purchaseOrder: {
          include: { supplier: true, lineItems: true },
        },
        lineItems: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, category: true, pricingType: true },
            },
          },
        },
        stockItems: true,
        returns: true,
      },
    });

    if (!grn) {
      return NextResponse.json({ error: "GRN not found" }, { status: 404 });
    }

    return NextResponse.json({ grn });
  } catch (error) {
    console.error("GET /api/grn/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch GRN" }, { status: 500 });
  }
}
