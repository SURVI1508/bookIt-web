import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PromoCode from "@/models/PromoCode";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { success: false, error: "Code is required" },
      { status: 400 }
    );
  }

  // Case-insensitive match
  const promo = await PromoCode.findOne({
    code: { $regex: new RegExp(`^${code}$`, "i") },
  });

  if (!promo) {
    return NextResponse.json(
      { success: false, error: "Invalid promo code" },
      { status: 404 }
    );
  }

  const now = new Date();
  const expiry = new Date(promo.expiry);

  if (expiry.getTime() < now.getTime()) {
    promo.isActive = false;
    await promo.save();
    return NextResponse.json(
      { success: false, error: "Promo code has expired" },
      { status: 410 }
    );
  }

  if (!promo.isActive) {
    return NextResponse.json(
      { success: false, error: "Promo code is inactive" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, promo });
}
