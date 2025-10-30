import { NextResponse } from "next/server";
import Product from "@/models/Product";
import Booking from "@/models/Booking";
import Promo from "@/models/PromoCode";
import { connectDB } from "@/lib/db";
import { generateReferenceNumber } from "@/utils/generateReferenceNumber";
import { sendOrderConfirmation } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { productId, name, email, date, time, promoCode } = body;
    const qty = Number(body?.qty);

    if (!productId || !name || !email || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const selectedDate = product?.dates?.find(
      (d) => new Date(d.date).toDateString() === new Date(date).toDateString()
    );

    if (!selectedDate) {
      return NextResponse.json(
        { success: false, message: "Date not available" },
        { status: 400 }
      );
    }

    const selectedSlot = selectedDate.slots.find((s) => s.time === time);
    if (!selectedSlot) {
      return NextResponse.json(
        { success: false, message: "Time slot not found" },
        { status: 400 }
      );
    }

    if (selectedSlot.booked + Number(qty) > selectedSlot.capacity) {
      return NextResponse.json(
        { success: false, message: "Not enough capacity" },
        { status: 400 }
      );
    }

    // Handle promo code (optional)
    let discount = 0;
    let appliedPromo = null;

    if (promoCode) {
      const promo = await Promo.findOne({
        code: promoCode,
        isActive: true, // only allow active codes
      });

      if (!promo) {
        return NextResponse.json(
          { success: false, message: "Promo code not found or inactive" },
          { status: 400 }
        );
      }

      // Check expiry
      if (new Date(promo.expiry) < new Date()) {
        return NextResponse.json(
          { success: false, message: "Promo code has expired" },
          { status: 400 }
        );
      }

      // ✅ Calculate subtotal before discount
      const basePrice = Number(product?.price?.basePrice || 0);
      const quantity = qty || 1;
      const subtotal = basePrice * quantity;

      // ✅ Handle both discount types
      if (promo.discountType === "percent") {
        discount = Math.min((subtotal * promo.discountValue) / 100, subtotal); // cap at subtotal
      } else if (promo.discountType === "fixed") {
        discount = Math.min(promo.discountValue, subtotal); // can't exceed subtotal
      }

      appliedPromo = promo.code;
    }

    const subtotal = product?.price?.basePrice * qty;

    const taxes = 10;
    const total = subtotal + taxes - discount;

    // Create booking
    const booking = await Booking.create({
      product: product._id,
      name,
      email,
      date,
      time,
      qty,
      subtotal,
      taxes,
      total,
      promoCode,
      status: "confirmed",
    });

    await sendOrderConfirmation(
      email,
      product?.title,
      productId,
      name,
      date,
      time,
      qty,
      total
    );

    // Update slot availability
    selectedSlot.booked += qty;
    if (selectedSlot.booked >= selectedSlot.capacity)
      selectedSlot.status = "soldout";
    await product.save();

    const refNumber = generateReferenceNumber();

    return NextResponse.json(
      { success: true, data: { booking, referenceNumber: refNumber } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
