import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
  const protectedPaths = ["/api/posts/add", "/api/posts/update", "/api/posts/delete"];
  const { pathname } = req.nextUrl;

  if (protectedPaths.includes(pathname)) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const verified = verifyJwtToken(token);

    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/posts/:path*"],
};
