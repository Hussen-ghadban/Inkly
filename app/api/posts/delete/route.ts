// app/api/posts/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const payload = token && verifyJwtToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== payload.id) {
    return NextResponse.json({ error: "Post not found or not yours" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ message: "Post deleted" });
}
