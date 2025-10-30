import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body: VerifyOtpRequest = await req.json();
    const { email, otp } = body;

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User is already verified." },
        { status: 400 }
      );
    }

    const isMaster = otp === process.env.MASTER_OTP;

    // Check OTP or master OTP
    const isValidOTP =
      (user.otp?.toString().trim() === otp.toString().trim() &&
        user.otpExpires &&
        user.otpExpires > Date.now()) ||
      isMaster;

    if (!isValidOTP) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { error: "Something went wrong during OTP verification." },
      { status: 500 }
    );
  }
}
