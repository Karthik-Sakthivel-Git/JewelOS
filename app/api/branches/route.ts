import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireTenantId, TenantError } from "@/lib/auth/get-tenant";

export async function GET(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const active = req.nextUrl.searchParams.get("active");

    const where: Record<string, unknown> = { tenantId };
    if (active !== null) where.active = active !== "false";

    const branches = await db.branch.findMany({
      where,
      orderBy: [{ isMain: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        city: true,
        isMain: true,
        active: true,
      },
    });

    return NextResponse.json({ branches });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("GET /api/branches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}
