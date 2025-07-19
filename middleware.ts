// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken } from "./utils/auth";

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyJwtToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // Clone request and add x-user-id header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.id);

  return NextResponse.next({
    request: {
      // Pass original URL, method, etc.
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/posts/create", "/api/posts/delete/:path*", "/api/posts/update/:path*"],
};
