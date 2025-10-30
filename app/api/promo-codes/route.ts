import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PromoCode from "@/models/PromoCode";
import { getUserFromRequest } from "@/lib/auth"; // your existing JWT helper

// GET All (Public)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const includeExpired = searchParams.get("includeExpired") === "true";

    const filter: any = includeExpired
      ? {}
      : { expiry: { $gte: new Date() }, isActive: true };

    const promoCodes = await PromoCode.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: promoCodes.length,
      promoCodes,
    });
  } catch (error: any) {
    console.error("GET /api/promo-codes error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST (Admin Only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { code, discountType, discountValue, expiry } = await req.json();

    if (!code || !discountValue || !expiry) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const promo = await PromoCode.create({
      code,
      discountType,
      discountValue,
      expiry,
    });

    return NextResponse.json({ success: true, promo });
  } catch (error: any) {
    console.error("POST /api/promo-codes error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT (Admin Only)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { id, ...updates } = await req.json();

    const updatedPromo = await PromoCode.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPromo)
      return NextResponse.json(
        { success: false, error: "Promo code not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, promo: updatedPromo });
  } catch (error: any) {
    console.error("PUT /api/promo-codes error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE (Admin Only)
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { success: false, error: "Promo ID is required" },
        { status: 400 }
      );

    await PromoCode.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Promo deleted" });
  } catch (error: any) {
    console.error("DELETE /api/promo-codes error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
