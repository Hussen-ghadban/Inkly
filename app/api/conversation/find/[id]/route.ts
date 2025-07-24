import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
  const receiver = params.id;

  const sender = req.headers.get("x-user-id");
  console.log('Finding conversation between sender:', sender, 'and receiver:', receiver);
  if (!sender) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sender || !receiver) {
    return NextResponse.json({ error: 'Both sender and receiver are required' }, { status: 400 });
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: sender, participant2Id: receiver },
          { participant1Id: receiver, participant2Id: sender },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json({ conversationId: null }, { status: 200 });
    }

    return NextResponse.json({ conversationId: conversation.id }, { status: 200 });
  } catch (error) {
    console.error('Error finding conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
