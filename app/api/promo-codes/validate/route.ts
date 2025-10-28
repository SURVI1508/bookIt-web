import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PromoCode from "@/models/PromoCode";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Promo code is required" },
        { status: 400 }
      );
    }

    // Find promo code (case-insensitive)
    const promo = await PromoCode.findOne({
      code: code.toUpperCase(),
    });

    if (!promo) {
      return NextResponse.json(
        { success: false, error: "Invalid promo code" },
        { status: 404 }
      );
    }

    // Check if expired
    const now = new Date();
    if (promo.expiry < now) {
      promo.isActive = false;
      await promo.save();
      return NextResponse.json(
        { success: false, error: "Promo code has expired" },
        { status: 410 } // Gone
      );
    }

    // Check if active
    if (!promo.isActive) {
      return NextResponse.json(
        { success: false, error: "Promo code is inactive" },
        { status: 403 }
      );
    }

    // ✅ Valid promo code
    return NextResponse.json({
      success: true,
      message: "Promo code is valid",
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        expiry: promo.expiry,
      },
    });
  } catch (error: any) {
    console.error("GET /api/promo-codes/validate error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
