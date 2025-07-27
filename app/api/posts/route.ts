import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  const where: any = {
    published: false,
  };

  if (userId) {
    where.authorId = { not: userId };
  }

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log("response",posts)

  return NextResponse.json(posts);
}
