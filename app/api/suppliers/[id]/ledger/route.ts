import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);

    const supplier = await db.supplier.findUnique({
      where: { id },
      select: { id: true, name: true, balanceRs: true, balanceGrams: true },
    });

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    const [entries, total] = await Promise.all([
      db.supplierLedgerEntry.findMany({
        where: { supplierId: id },
        orderBy: { entryDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.supplierLedgerEntry.count({ where: { supplierId: id } }),
    ]);

    return NextResponse.json({
      supplier,
      entries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/suppliers/[id]/ledger error:", error);
    return NextResponse.json({ error: "Failed to fetch supplier ledger" }, { status: 500 });
  }
}
