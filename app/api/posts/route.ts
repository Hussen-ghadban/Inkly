import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true }, // Optional
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}
