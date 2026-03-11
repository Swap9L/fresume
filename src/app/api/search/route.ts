import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  try {
    let users: any[] = [];
    let totalUsers = 0;
    let topResumes: any[] = [];

    const init = searchParams.get("init") === "true";

    if (q) {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
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
      return NextResponse.json({ users });
    }

    if (!q || init) {
      const [count, resumes] = await Promise.all([
        prisma.user.count(),
        prisma.resumeData.findMany({
          orderBy: {
            visits: "desc",
          },
          take: 5,
          select: {
            id: true,
            name: true,
            url: true,
            avatarUrl: true,
            visits: true,
            user: {
              select: {
                username: true,
                image: true,
              },
            },
          },
        })
      ]);
      totalUsers = count;
      topResumes = resumes;
    }

    return NextResponse.json({
      users,
      totalUsers,
      topResumes,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
