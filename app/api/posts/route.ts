import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  //   const userId = req.headers.get("x-user-id");
  // console.log("Creating post for user ID:", userId);
  // if (!userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  const posts = await prisma.post.findMany({
    include: { author: { select: { id: true, name: true } } },
  });

  return NextResponse.json(posts);
}
