import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  console.log(req, "user");

  const user = getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin")
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );

  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
