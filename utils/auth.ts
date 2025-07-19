import { jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface JwtPayload extends JWTPayload {
  id: string;
}

function isJwtPayload(payload: JWTPayload): payload is JwtPayload {
  return typeof payload.id === "string";
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (isJwtPayload(payload)) {
      return payload;
    }
    console.error("JWT payload missing required 'id' field");
    return null;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
