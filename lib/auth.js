import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// ✅ Generate JWT
export const generateToken = (user) => {
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

// ✅ Verify JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return null;
  }
};

export const getUserFromRequest = (req) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    return null;
  }
};
