import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET|| "default_secret_key";


export function signJwtToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}