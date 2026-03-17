import { db } from "@/lib/db";

/**
 * Generate sequential document numbers with prefix and date component.
 * Format: {prefix}-{YYMM}-{sequence}
 * E.g. PO-2603-0001, GRN-2603-0001, RET-2603-0001
 */
async function generateNumber(
  prefix: string,
  tableName: string,
  columnName: string,
  tenantId: string
): Promise<string> {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const datePrefix = `${prefix}-${yy}${mm}`;

  const result = await db.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*) as count FROM ${tableName} WHERE "tenantId" = $1 AND "${columnName}" LIKE $2`,
    tenantId,
    `${datePrefix}%`
  );

  const count = Number(result[0]?.count ?? 0) + 1;
  return `${datePrefix}-${String(count).padStart(4, "0")}`;
}

export async function generatePoNumber(tenantId: string): Promise<string> {
  return generateNumber("PO", "purchase_orders", "poNumber", tenantId);
}

export async function generateGrnNumber(tenantId: string): Promise<string> {
  return generateNumber("GRN", "goods_received_notes", "grnNumber", tenantId);
}

export async function generateReturnNumber(tenantId: string): Promise<string> {
  return generateNumber("RET", "purchase_returns", "returnNumber", tenantId);
}

export async function generateDebitNoteNumber(
  tenantId: string
): Promise<string> {
  return generateNumber("DN", "purchase_returns", "debitNoteNumber", tenantId);
}
