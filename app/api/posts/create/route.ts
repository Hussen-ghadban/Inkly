// app/api/posts/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJwtToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const payload = token && verifyJwtToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      authorId: payload.id, // assuming the JWT includes `id`
    },
  });

  return NextResponse.json({ post: newPost }, { status: 201 });
}
