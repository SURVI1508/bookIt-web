import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params =
    "then" in (context.params as any)
      ? await (context.params as Promise<{ id: string }>)
      : (context.params as { id: string });
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("GET /api/experiences/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params =
    "then" in (context.params as any)
      ? await (context.params as Promise<{ id: string }>)
      : (context.params as { id: string });
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Admins only" }, { status: 403 });

    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updated)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("PUT /api/experiences/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params =
    "then" in (context.params as any)
      ? await (context.params as Promise<{ id: string }>)
      : (context.params as { id: string });
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Admins only" }, { status: 403 });

    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    console.error("DELETE /api/experiences/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
