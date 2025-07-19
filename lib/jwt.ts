import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET|| "default_secret_key";
export interface DecodedToken {
  id: string;
  email: string;
  // add more fields if needed
}


export function signJwtToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch  {
    return null;
  }
}