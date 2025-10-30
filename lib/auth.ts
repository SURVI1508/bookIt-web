import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

if (!JWT_SECRET_KEY) {
  throw new Error("❌ Missing environment variable: JWT_SECRET_KEY");
}

// ===== Types =====
export interface UserPayload {
  _id: string;
  email: string;
  role: string;
}

export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Generate JWT
export const generateToken = (user: UserPayload): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

// Verify JWT
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as DecodedToken;
  } catch {
    return null;
  }
};

// Get user from Next.js request (App Router)
export const getUserFromRequest = (req: NextRequest): DecodedToken | null => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET_KEY) as DecodedToken;
  } catch {
    return null;
  }
};
