// app/api/posts/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const postId = awaitedParams.id;

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post || post.authorId !== userId) {
    return NextResponse.json({ error: "Post not found or not yours" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id: postId } });

  return NextResponse.json({ message: "Post deleted successfully" });
}
