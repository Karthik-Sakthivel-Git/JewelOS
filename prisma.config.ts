import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasource: {
    url: process.env["DATABASE_URL"],
    directUrl: process.env["DIRECT_URL"],
  } as any,
});
