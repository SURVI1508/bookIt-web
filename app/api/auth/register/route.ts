import { connectDB } from "@/lib/db";
import { sendOTP } from "@/lib/mailer";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

interface RegisterBody {
  name: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  avatar?: string;
  biography?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body: RegisterBody = await req.json();
    const { name, userName, email, phone, password, role, avatar, biography } =
      body;

    // Validate required fields
    if (!name || !userName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check if verified user already exists
    const existingVerified = await User.findOne({
      $or: [{ email }, { userName }],
      isVerified: true,
    });

    if (existingVerified) {
      return NextResponse.json(
        { error: "User already exists and is verified" },
        { status: 409 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if unverified user exists
    const existingUnverified = await User.findOne({
      $or: [{ email }, { userName }],
      isVerified: false,
    });

    if (existingUnverified) {
      existingUnverified.name = name;
      existingUnverified.phone = phone;
      existingUnverified.password = password;
      existingUnverified.role = role || "reader";
      existingUnverified.avatar = avatar || "";
      existingUnverified.biography = biography || "";
      existingUnverified.otp = otp;
      existingUnverified.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      await existingUnverified.save();
    } else {
      await User.create({
        name,
        userName,
        email,
        phone,
        password,
        role: role || "reader",
        avatar: avatar || "",
        biography: biography || "",
        isVerified: false,
        otp,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      });
    }

    // Send OTP
    await sendOTP(email, otp);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to email. Please verify to complete registration.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}
