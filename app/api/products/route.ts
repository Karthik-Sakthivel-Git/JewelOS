import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { productCreateSchema, productFilterSchema } from "@/lib/validations/product";
import { generateSku, generateBarcode, generateRfidTag } from "@/lib/utils/sku-generator";
import { requireTenantId, TenantError } from "@/lib/auth/get-tenant";

export async function GET(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const filters = productFilterSchema.parse(params);
    const { page, limit, search, category, metalType, pricingType, active } = filters;

    const where: Record<string, unknown> = { tenantId };
    if (category) where.category = category;
    if (metalType) where.metalType = metalType;
    if (pricingType) where.pricingType = pricingType;
    if (active !== undefined) where.active = active;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { designCode: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { stockItems: true } },
        },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/products error:", msg, error);
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      { error: "Failed to fetch products", ...(isDev && { debug: msg }) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await requireTenantId(req);
    const body = await req.json();
    const data = productCreateSchema.parse(body);

    const sku = generateSku(data.category, data.metalType);
    const barcode = generateBarcode();
    const rfidTag = generateRfidTag(data.category);

    const product = await db.product.create({
      data: {
        tenantId,
        sku,
        barcode,
        rfidTag,
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        designCode: data.designCode,
        description: data.description,
        metalType: data.metalType ?? null,
        purity: data.purity ?? null,
        pricingType: data.pricingType,
        hsnCode: data.hsnCode,
        gstRate: data.gstRate,
        unitOfMeasure: data.unitOfMeasure,
        makingChargeType: data.makingChargeType,
        makingChargeValue: data.makingChargeValue ?? null,
        stoneType: data.stoneType,
        stoneWeight: data.stoneWeight ?? null,
        stoneValue: data.stoneValue ?? null,
        supplierMrp: data.supplierMrp ?? null,
        bisHuid: data.bisHuid,
        bisHallmarked: data.bisHallmarked ?? false,
        certificateUrl: data.certificateUrl || null,
        targetGroup: data.targetGroup ?? "UNISEX",
        wastageType: data.wastageType ?? null,
        wastageValue: data.wastageValue ?? null,
        sizeLabel: data.sizeLabel ?? null,
        sizeStandard: data.sizeStandard ?? null,
        sizeLadies: data.sizeLadies ?? null,
        sizeGents: data.sizeGents ?? null,
        images: data.images,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof TenantError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: { issues: error.issues } }, { status: 400 });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/products error:", msg, error);
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      { error: "Failed to create product", ...(isDev && { debug: msg }) },
      { status: 500 }
    );
  }
}
