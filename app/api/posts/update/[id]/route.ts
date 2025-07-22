import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const postId = awaitedParams.id;
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, content } = await req.json();
  const updateData: { title?: string; content?: string } = {};

  if (typeof title === "string" && title.trim()) {
    updateData.title = title.trim();
  }

  if (typeof content === "string" && content.trim()) {
    updateData.content = content.trim();
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
  }


  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.authorId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: updateData,
  });

  return NextResponse.json({ post: updatedPost }, { status: 200 });
}
