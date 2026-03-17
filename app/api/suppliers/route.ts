import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireTenantId, TenantError } from "@/lib/auth/get-tenant";

export async function GET(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const search = req.nextUrl.searchParams.get("search");
    const active = req.nextUrl.searchParams.get("active");

    const where: Record<string, unknown> = { tenantId };
    if (active !== null) where.active = active !== "false";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { gstin: { contains: search, mode: "insensitive" } },
      ];
    }

    const suppliers = await db.supplier.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { purchaseOrders: true } },
      },
    });

    return NextResponse.json({ suppliers });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("GET /api/suppliers error:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }
}
