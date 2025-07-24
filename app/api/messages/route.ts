import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {

      const sender = req.headers.get("x-user-id");
  if (!sender) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { content, senderId, receiverId } = await req.json();

  if (!content || !senderId || !receiverId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Find existing conversation or create a new one
  let conversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        { participant1Id: senderId, participant2Id: receiverId },
        { participant1Id: receiverId, participant2Id: senderId },
      ],
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participant1Id: senderId,
        participant2Id: receiverId,
      },
    });
  }

  // Create the message linked to the conversation
  const message = await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
      conversationId: conversation.id,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
