import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding JewelOS database...");

  // Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: "tenant-demo-001" },
    update: {},
    create: {
      id: "tenant-demo-001",
      name: "Sri Lakshmi Jewellers",
      legalName: "Sri Lakshmi Jewellers Pvt. Ltd.",
      gstin: "33AABCS1234A1Z5",
      pan: "AABCS1234A",
      phone: "+919876543210",
      email: "info@srilakshmijewellers.com",
    },
  });

  // Branches
  const mainBranch = await prisma.branch.upsert({
    where: { id: "branch-main-001" },
    update: {},
    create: {
      id: "branch-main-001",
      tenantId: tenant.id,
      name: "Main Showroom",
      address: "123, T. Nagar Main Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
      phone: "+914428150000",
      isMain: true,
    },
  });

  const secondBranch = await prisma.branch.upsert({
    where: { id: "branch-anna-002" },
    update: {},
    create: {
      id: "branch-anna-002",
      tenantId: tenant.id,
      name: "Anna Nagar Branch",
      address: "45, 2nd Avenue, Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
      phone: "+914426180000",
      isMain: false,
    },
  });

  // Users
  const owner = await prisma.user.upsert({
    where: { phone: "+919876543210" },
    update: {},
    create: {
      id: "user-owner-001",
      tenantId: tenant.id,
      branchId: mainBranch.id,
      phone: "+919876543210",
      name: "Rajesh Kumar",
      email: "rajesh@srilakshmijewellers.com",
      role: "OWNER",
    },
  });

  await prisma.user.upsert({
    where: { phone: "+919876543211" },
    update: {},
    create: {
      id: "user-manager-001",
      tenantId: tenant.id,
      branchId: mainBranch.id,
      phone: "+919876543211",
      name: "Priya Sharma",
      role: "MANAGER",
    },
  });

  await prisma.user.upsert({
    where: { phone: "+919876543212" },
    update: {},
    create: {
      id: "user-sales-001",
      tenantId: tenant.id,
      branchId: mainBranch.id,
      phone: "+919876543212",
      name: "Arun Krishnan",
      role: "SALESPERSON",
    },
  });

  // Metal Rates (today's rates)
  const rateData = [
    { metalType: "GOLD_24K" as const, ratePerGram: 7200 },
    { metalType: "GOLD_22K" as const, ratePerGram: 6600 },
    { metalType: "GOLD_18K" as const, ratePerGram: 5400 },
    { metalType: "SILVER" as const, ratePerGram: 95 },
    { metalType: "PLATINUM" as const, ratePerGram: 3100 },
  ];

  for (const rate of rateData) {
    await prisma.metalRate.create({
      data: {
        tenantId: tenant.id,
        metalType: rate.metalType,
        ratePerGram: rate.ratePerGram,
        source: "MANUAL",
      },
    });
  }

  // Products — mix of WEIGHT_BASED and FIXED_MRP
  const goldRing = await prisma.product.upsert({
    where: {
      tenantId_sku: { tenantId: tenant.id, sku: "GR-22K-001" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      sku: "GR-22K-001",
      name: "Gold Ring 22K Plain",
      category: "GOLD_JEWELLERY",
      metalType: "GOLD_22K",
      pricingType: "WEIGHT_BASED",
      purity: 22,
      hsnCode: "7113",
      gstRate: 3.0,
      unitOfMeasure: "GRAMS",
      makingChargeType: "PER_GRAM",
      makingChargeValue: 450,
    },
  });

  const goldNecklace = await prisma.product.upsert({
    where: {
      tenantId_sku: { tenantId: tenant.id, sku: "GN-22K-001" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      sku: "GN-22K-001",
      name: "Gold Necklace 22K Temple",
      category: "GOLD_JEWELLERY",
      metalType: "GOLD_22K",
      pricingType: "WEIGHT_BASED",
      purity: 22,
      hsnCode: "7113",
      gstRate: 3.0,
      unitOfMeasure: "GRAMS",
      makingChargeType: "PERCENTAGE",
      makingChargeValue: 12,
    },
  });

  const silverBangle = await prisma.product.upsert({
    where: {
      tenantId_sku: { tenantId: tenant.id, sku: "SB-925-001" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      sku: "SB-925-001",
      name: "Silver Bangle 925",
      category: "SILVER_JEWELLERY",
      metalType: "SILVER",
      pricingType: "WEIGHT_BASED",
      purity: 92.5,
      hsnCode: "7113",
      gstRate: 3.0,
      unitOfMeasure: "GRAMS",
      makingChargeType: "PER_GRAM",
      makingChargeValue: 15,
    },
  });

  const giftFrame = await prisma.product.upsert({
    where: {
      tenantId_sku: { tenantId: tenant.id, sku: "GF-MRP-001" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      sku: "GF-MRP-001",
      name: "Silver Photo Frame Gift",
      category: "GIFT_ARTICLE",
      pricingType: "FIXED_MRP",
      hsnCode: "7114",
      gstRate: 3.0,
      unitOfMeasure: "PIECES",
    },
  });

  const goldCoin = await prisma.product.upsert({
    where: {
      tenantId_sku: { tenantId: tenant.id, sku: "GC-24K-001" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      sku: "GC-24K-001",
      name: "Gold Coin 24K 1g",
      category: "GOLD_COIN",
      metalType: "GOLD_24K",
      pricingType: "WEIGHT_BASED",
      purity: 24,
      hsnCode: "7108",
      gstRate: 3.0,
      unitOfMeasure: "GRAMS",
      makingChargeType: "FLAT",
      makingChargeValue: 200,
    },
  });

  // Stock Items
  await prisma.stockItem.createMany({
    data: [
      {
        productId: goldRing.id,
        branchId: mainBranch.id,
        grossWeight: 8.5,
        netWeight: 8.2,
        costPrice: 58000,
        tagPrice: 62000,
        barcode: "JOS-GR001-001",
      },
      {
        productId: goldNecklace.id,
        branchId: mainBranch.id,
        grossWeight: 25.0,
        netWeight: 23.5,
        stoneWeight: 1.5,
        stoneValue: 15000,
        costPrice: 185000,
        tagPrice: 198000,
        barcode: "JOS-GN001-001",
      },
      {
        productId: silverBangle.id,
        branchId: mainBranch.id,
        grossWeight: 45.0,
        netWeight: 44.0,
        costPrice: 4800,
        tagPrice: 5500,
        barcode: "JOS-SB001-001",
      },
      {
        productId: giftFrame.id,
        branchId: mainBranch.id,
        supplierMrp: 3500,
        costPrice: 2800,
        tagPrice: 3500,
        barcode: "JOS-GF001-001",
      },
      {
        productId: goldCoin.id,
        branchId: mainBranch.id,
        grossWeight: 1.0,
        netWeight: 1.0,
        costPrice: 7400,
        tagPrice: 7600,
        barcode: "JOS-GC001-001",
      },
      {
        productId: goldRing.id,
        branchId: secondBranch.id,
        grossWeight: 5.2,
        netWeight: 5.0,
        costPrice: 35500,
        tagPrice: 38000,
        barcode: "JOS-GR001-002",
      },
    ],
    skipDuplicates: true,
  });

  // Suppliers
  await prisma.supplier.upsert({
    where: { id: "supplier-001" },
    update: {},
    create: {
      id: "supplier-001",
      tenantId: tenant.id,
      name: "Joyalukkas Wholesale",
      contactPerson: "Suresh Menon",
      phone: "+919845000001",
      gstin: "32AABCJ5678K1Z1",
      city: "Thrissur",
      state: "Kerala",
      balanceRs: 0,
      balanceGrams: 0,
    },
  });

  await prisma.supplier.upsert({
    where: { id: "supplier-002" },
    update: {},
    create: {
      id: "supplier-002",
      tenantId: tenant.id,
      name: "Chennai Gold Refinery",
      contactPerson: "Mohan Das",
      phone: "+919845000002",
      gstin: "33AABCG9876M1Z3",
      city: "Chennai",
      state: "Tamil Nadu",
      balanceRs: -25000,
      balanceGrams: 10.5,
    },
  });

  // Customers
  await prisma.customer.upsert({
    where: {
      tenantId_phone: { tenantId: tenant.id, phone: "+919900000001" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      phone: "+919900000001",
      name: "Lakshmi Devi",
      city: "Chennai",
      state: "Tamil Nadu",
      loyaltyTier: "GOLD",
      lifetimePurchaseValue: 450000,
      kycVerified: true,
    },
  });

  await prisma.customer.upsert({
    where: {
      tenantId_phone: { tenantId: tenant.id, phone: "+919900000002" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      phone: "+919900000002",
      name: "Meena Sundaram",
      city: "Coimbatore",
      state: "Tamil Nadu",
      loyaltyTier: "SILVER",
      lifetimePurchaseValue: 120000,
      kycVerified: false,
    },
  });

  await prisma.customer.upsert({
    where: {
      tenantId_phone: { tenantId: tenant.id, phone: "+919900000003" },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      phone: "+919900000003",
      name: "Arjun Ramachandran",
      city: "Madurai",
      state: "Tamil Nadu",
      loyaltyTier: "BRONZE",
      lifetimePurchaseValue: 25000,
    },
  });

  // Schemes
  await prisma.scheme.upsert({
    where: { id: "scheme-fixed-001" },
    update: {},
    create: {
      id: "scheme-fixed-001",
      tenantId: tenant.id,
      name: "Golden 11+1 Plan",
      schemeType: "FIXED_MONEY",
      durationMonths: 11,
      installmentAmount: 5000,
      bonusMonth: 12,
      description: "Pay 11 months, get 12th month free. Redeem as bill credit.",
    },
  });

  await prisma.scheme.upsert({
    where: { id: "scheme-chit-001" },
    update: {},
    create: {
      id: "scheme-chit-001",
      tenantId: tenant.id,
      name: "Daily Gold Savings",
      schemeType: "DAILY_CHIT",
      durationMonths: 12,
      installmentAmount: 100,
      description: "Save ₹100/day. Field agent collects at your doorstep.",
    },
  });

  await prisma.scheme.upsert({
    where: { id: "scheme-flex-001" },
    update: {},
    create: {
      id: "scheme-flex-001",
      tenantId: tenant.id,
      name: "Flexi Gold Plan",
      schemeType: "FLEXIBLE",
      durationMonths: 12,
      bonusPercent: 5,
      description: "Save any amount, any time. 5% bonus on maturity.",
    },
  });

  // Safe Lockers
  await prisma.safeLocker.upsert({
    where: { id: "locker-001" },
    update: {},
    create: {
      id: "locker-001",
      tenantId: tenant.id,
      name: "Vault A - Main",
      location: "Basement, Main Showroom",
      capacity: 50,
      occupied: 12,
    },
  });

  // Chart of Accounts (pre-seeded for jewellery)
  const accounts = [
    { code: "1000", name: "Cash in Hand", accountType: "ASSET" },
    { code: "1100", name: "Bank Account", accountType: "ASSET" },
    { code: "1200", name: "Gold Stock Account", accountType: "ASSET" },
    { code: "1201", name: "Silver Stock Account", accountType: "ASSET" },
    { code: "1202", name: "Diamond Stock Account", accountType: "ASSET" },
    { code: "1300", name: "Accounts Receivable", accountType: "ASSET" },
    { code: "2000", name: "Accounts Payable", accountType: "LIABILITY" },
    { code: "2100", name: "GST Payable", accountType: "LIABILITY" },
    { code: "2200", name: "Karigar Gold Outstanding", accountType: "LIABILITY" },
    { code: "3000", name: "Capital Account", accountType: "EQUITY" },
    { code: "4000", name: "Sales Revenue", accountType: "REVENUE" },
    { code: "4100", name: "Making Charges Income", accountType: "REVENUE" },
    { code: "4200", name: "Scheme Bonus Income", accountType: "REVENUE" },
    { code: "5000", name: "Purchase - Gold", accountType: "EXPENSE" },
    { code: "5001", name: "Purchase - Silver", accountType: "EXPENSE" },
    { code: "5100", name: "Wastage Account", accountType: "EXPENSE" },
    { code: "5200", name: "Staff Salary", accountType: "EXPENSE" },
    { code: "5300", name: "Rent & Utilities", accountType: "EXPENSE" },
  ];

  for (const acc of accounts) {
    await prisma.chartOfAccount.upsert({
      where: {
        tenantId_code: { tenantId: tenant.id, code: acc.code },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        ...acc,
      },
    });
  }

  console.log("Seed complete!");
  console.log(`  Tenant: ${tenant.name}`);
  console.log(`  Branches: 2`);
  console.log(`  Users: 3`);
  console.log(`  Products: 5`);
  console.log(`  Stock Items: 6`);
  console.log(`  Suppliers: 2`);
  console.log(`  Customers: 3`);
  console.log(`  Schemes: 3`);
  console.log(`  Chart of Accounts: ${accounts.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
