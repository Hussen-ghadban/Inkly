import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signJwtToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = signJwtToken({ id: user.id });

  return NextResponse.json(
    {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
    { status: 200 }
  );
}
