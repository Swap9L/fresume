// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL ?? "";

// Create a PG pool for Neon
const pool = new Pool({
  connectionString: connectionString.split("?")[0], // remove ?sslmode for pg adapter
  max: 10, // limit connections
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

// Prisma client singleton
const prismaClientSingleton = () => new PrismaClient({ adapter, log: ["error"] });

declare global {
  var prisma: PrismaClient | undefined;
}

// Use global singleton in dev to avoid too many connections
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
