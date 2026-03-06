"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var pg_1 = require("pg");
var adapter_pg_1 = require("@prisma/adapter-pg");
var connectionString = "".concat(process.env.DATABASE_URL);
var pool = new pg_1.Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
});
var adapter = new adapter_pg_1.PrismaPg(pool);
var prismaClientSingleton = function () {
    return new client_1.PrismaClient({ adapter: adapter });
};
var prisma = (_a = globalThis.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
exports.default = prisma;
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
