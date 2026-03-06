import prisma from "./src/lib/prisma";
async function main() {
  console.log("Prisma instance:", !!prisma);
  try {
    await prisma.$connect();
    console.log("Connected successfully!");
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error connecting:", err);
    process.exit(1);
  }
}
main();
