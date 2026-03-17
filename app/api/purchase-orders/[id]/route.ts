import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        branch: { select: { id: true, name: true } },
        lineItems: { include: { product: { select: { id: true, name: true, sku: true } } } },
        grns: {
          include: {
            lineItems: true,
            _count: { select: { stockItems: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("GET /api/purchase-orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch purchase order" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const order = await db.purchaseOrder.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes,
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : undefined,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("PUT /api/purchase-orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update purchase order" }, { status: 500 });
  }
}
