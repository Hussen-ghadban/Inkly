import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { id: true, name: true } } },
  });

  return NextResponse.json(posts);
}
