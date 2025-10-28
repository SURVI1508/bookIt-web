import mongoose, { Schema, Document, models } from "mongoose";

export interface IBooking extends Document {
  product: mongoose.Types.ObjectId;
  name: string;
  email: string;
  date: Date;
  time: string;
  qty: number;
  subtotal: number;
  taxes: number;
  total: number;
  promoCode?: string;
  status: "confirmed" | "cancelled" | "pending";
}

const BookingSchema = new Schema<IBooking>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    subtotal: { type: Number, required: true },
    taxes: { type: Number, required: true },
    total: { type: Number, required: true },
    promoCode: { type: String },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
  },
  { timestamps: true }
);

export default models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
