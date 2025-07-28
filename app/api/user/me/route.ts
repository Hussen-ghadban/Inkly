import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// If you're using a custom auth header or cookies to identify the user
export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') // or extract from token/session

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
