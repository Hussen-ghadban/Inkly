import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId  = params.id;
  console.log("Fetching posts for user ID:", userId);

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
