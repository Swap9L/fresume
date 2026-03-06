import prisma from "./src/lib/prisma";
async function main() {
  try {
    const data = await prisma.resumeData.findFirst();
    console.log("Query succeeded!");
    process.exit(0);
  } catch (err) {
    console.error("Query failed:", err);
    process.exit(1);
  }
}
main();
