/**
 * Validation script for Products API.
 * Run with: node scripts/validate-products-api.mjs
 *
 * Prerequisites:
 *   1. Dev server running: npm run dev (or pnpm dev)
 *   2. .env.local has DATABASE_URL and DEFAULT_TENANT_ID=tenant-demo-001
 *   3. Database reachable (run: npx prisma db seed)
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BASE = process.env.NEXTAUTH_URL || "http://localhost:3001";

async function run() {
  console.log("JewelOS — Products API validation\n");
  console.log("Base URL:", BASE);
  console.log("DEFAULT_TENANT_ID:", process.env.DEFAULT_TENANT_ID || "(not set)\n");

  // 1. GET /api/products
  console.log("1. GET /api/products");
  try {
    const res = await fetch(`${BASE}/api/products?limit=5`);
    const data = await res.json();

    if (!res.ok) {
      console.log("   FAIL:", res.status, data?.error ?? "Unknown error");
      if (data?.debug) console.log("   Debug:", data.debug);
      if (data?.error?.includes("tenant")) {
        console.log("   → Set DEFAULT_TENANT_ID=tenant-demo-001 in .env.local");
      }
      if (data?.debug?.includes("reach") || data?.debug?.includes("P1001")) {
        console.log("   → Database unreachable. Check DATABASE_URL, Supabase project status, and network.");
      }
      return;
    }

    const products = data?.products ?? [];
    const total = data?.pagination?.total ?? 0;
    console.log("   OK:", total, "products total,", products.length, "returned");
    if (products.length > 0) {
      console.log("   Sample:", products[0].name, "| SKU:", products[0].sku);
    }
  } catch (err) {
    console.log("   FAIL:", err.message);
    console.log("   → Is the dev server running? Try: npm run dev");
    return;
  }

  // 2. POST /api/products (minimal valid product)
  console.log("\n2. POST /api/products (minimal product)");
  const payload = {
    name: "Validation Test Ring",
    category: "GOLD_JEWELLERY",
    pricingType: "WEIGHT_BASED",
    hsnCode: "7113",
    gstRate: 3,
    unitOfMeasure: "GRAMS",
    makingChargeType: "PER_GRAM",
    makingChargeValue: 100,
    targetGroup: "UNISEX",
    bisHallmarked: false,
  };

  try {
    const res = await fetch(`${BASE}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      console.log("   FAIL:", res.status, data?.error ?? "Unknown error");
      if (data?.details?.issues) {
        data.details.issues.forEach((i) => console.log("   -", (i.path || []).join("."), ":", i.message));
      }
      return;
    }

    console.log("   OK: Product created, id:", data?.product?.id);
  } catch (err) {
    console.log("   FAIL:", err.message);
  }

  console.log("\nValidation complete.");
}

run();
