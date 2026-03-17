/**
 * Centralized tenant resolution for API routes.
 *
 * Resolution order:
 *   1. Authenticated session (once NextAuth is wired — Agent A3+)
 *   2. DEV-ONLY fallback from process.env.DEFAULT_TENANT_ID
 *
 * In production, if no session exists, returns null so the caller can 401.
 */

const IS_DEV = process.env.NODE_ENV === "development";

export async function getTenantId(
  _req?: Request
): Promise<string | null> {
  // TODO (Agent A3): Replace with real session lookup:
  //   const session = await getServerSession(authOptions);
  //   if (session?.user?.tenantId) return session.user.tenantId;

  if (IS_DEV && process.env.DEFAULT_TENANT_ID) {
    return process.env.DEFAULT_TENANT_ID;
  }

  return null;
}

/**
 * Convenience wrapper that throws-or-returns.
 * Use in API routes: `const tenantId = await requireTenantId(req);`
 * Returns the tenant ID string, or throws a Response-ready object.
 */
export async function requireTenantId(req?: Request): Promise<string> {
  const tenantId = await getTenantId(req);
  if (!tenantId) {
    throw new TenantError("Unauthorized — no tenant in session");
  }
  return tenantId;
}

export class TenantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantError";
  }
}
