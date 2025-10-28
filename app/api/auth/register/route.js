import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { sendOTP } from "../../../../lib/mailer";

import User from "../../../../models/User";
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, userName, email, phone, password, role, avatar, biography } =
      body;

    // Validate required fields
    if (!name || !userName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check if a verified user already exists
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

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if an unverified user exists (re-attempt registration)
    const existingUnverified = await User.findOne({
      $or: [{ email }, { userName }],
      isVerified: false,
    });

    if (existingUnverified) {
      // Update the existing unverified user
      existingUnverified.name = name;
      existingUnverified.phone = phone;
      existingUnverified.password = password;
      existingUnverified.role = role || "reader";
      existingUnverified.avatar = avatar || "";
      existingUnverified.biography = biography || "";
      existingUnverified.otp = otp;
      existingUnverified.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

      await existingUnverified.save();
    } else {
      // Create a new user
      const newUser = new User({
        name,
        userName,
        email,
        phone,
        password: password,
        role: role || "reader",
        avatar: avatar || "",
        biography: biography || "",
        isVerified: false,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      });

      await newUser.save();
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
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}
