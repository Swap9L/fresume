import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

// Strip ?sslmode=require because it causes pg-connection-string to override the ssl object below
const pool = new Pool({
    connectionString: connectionString.split("?")[0],
    max: 10,
    ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
