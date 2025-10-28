import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, otp } = body;

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email." },
        { status: 404 }
      );
    }

    // Already verified?
    if (user.isVerified) {
      return NextResponse.json(
        { error: "User is already verified." },
        { status: 400 }
      );
    }

    const isMaster = otp === process.env.MASTER_OTP;

    // Check OTP match or master OTP
    const isValidOTP =
      (user.otp === otp.toString().trim() && user.otpExpires > Date.now()) ||
      isMaster;

    if (!isValidOTP) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    // Mark user as verified
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
