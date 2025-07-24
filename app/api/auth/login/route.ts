import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signJwtToken } from "@/lib/jwt";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      password: true, // Ensure password is selected for verification
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = signJwtToken({ id: user.id});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return NextResponse.json(
    {
      message: "Login successful",
      token,
      user: userWithoutPassword,
    },
    { status: 200 }
  );
}