import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";

// Define User type (optional — matches your Mongoose schema)
interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = (await User.findOne({ email })) as IUser | null;

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Check verification
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Account not verified. Please verify your email." },
        { status: 403 }
      );
    }

    // ✅ Generate JWT token
    const token = generateToken(user);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );

    // ✅ Set secure HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong during login." },
      { status: 500 }
    );
  }
}
