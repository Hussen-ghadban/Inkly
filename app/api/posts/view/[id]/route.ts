import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(updatedPost, { status: 200 })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }
}
