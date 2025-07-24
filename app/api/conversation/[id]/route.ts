import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // adjust import to your setup

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const sender = req.headers.get("x-user-id");
  if (!sender) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const conversationId = params.id;
  try {
    const conversationWithMessages = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true } },
            receiver: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!conversationWithMessages) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ messages: conversationWithMessages.messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
