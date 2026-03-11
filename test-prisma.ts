import prisma from "./src/lib/prisma";

async function run() {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: "swap", mode: "insensitive" } },
          { username: { contains: "swap", mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        resumeData: {
          select: {
            avatarUrl: true,
            description: true,
            visits: true,
          },
        },
      },
      take: 10,
    });
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}
run();
