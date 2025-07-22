// app/api/posts/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  console.log("Creating post for user ID:", userId);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      authorId: userId,
    },
  });

  return NextResponse.json({ post: newPost }, { status: 201 });
}
